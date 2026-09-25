// @ts-check

import githubUsernameRegex from "github-username-regex";
import { CustomError, MissingParamError } from "../common/error.js";
import { wrapTextMultiline } from "../common/fmt.js";
import { request } from "../common/http.js";
import { logger } from "../common/log.js";
import { retryer } from "../common/retryer.js";

const DAY_MS = 24 * 60 * 60 * 1000;

const QUERY = `
query userContributions($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    name
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}
`;

/**
 * Contribution calendar fetcher.
 *
 * @param {object} variables Fetcher variables.
 * @param {string} token GitHub token.
 * @returns {Promise<import('axios').AxiosResponse>} The response.
 */
const fetcher = (variables, token) => {
  return request(
    { query: QUERY, variables },
    { Authorization: `bearer ${token}` },
  );
};

/**
 * @typedef {{ date: string; count: number }} ContributionDay Contributions on one day.
 * @typedef {{ name: string | null; contributions: ContributionDay[] }} GraphData Graph data.
 */

/**
 * Fetch daily contribution counts for a user.
 *
 * Without a custom range it fetches the last `days` days. Today is dropped
 * when it has no contributions yet.
 *
 * @param {string} username GitHub username.
 * @param {object} range Date range.
 * @param {number} range.days Number of days to show.
 * @param {Date=} range.from Custom range start.
 * @param {Date=} range.to Custom range end.
 * @returns {Promise<GraphData>} Graph data.
 */
const fetchGraph = async (username, { days, from, to }) => {
  if (!username) {
    throw new MissingParamError(["username"], "/graph?username=USERNAME");
  }
  if (!githubUsernameRegex.test(username)) {
    throw new Error("Invalid username provided.");
  }

  const isCustomRange = Boolean(from && to);
  const now = Date.now();
  const rangeFrom = from && to ? from : new Date(now - days * DAY_MS);
  // Also include the next day in case the server is behind GitHub's time.
  const rangeTo = from && to ? to : new Date(now + DAY_MS);

  const res = await retryer(fetcher, {
    login: username,
    from: rangeFrom.toISOString(),
    to: rangeTo.toISOString(),
  });

  if (res.data.errors) {
    logger.error(res.data.errors);
    if (res.data.errors[0].type === "NOT_FOUND") {
      throw new CustomError(
        res.data.errors[0].message || "Could not fetch user.",
        CustomError.USER_NOT_FOUND,
      );
    }
    throw new CustomError(
      wrapTextMultiline(
        res.data.errors[0].message || "Could not fetch contributions.",
        90,
        1,
      )[0],
      CustomError.GRAPHQL_ERROR,
    );
  }

  const user = res.data.data?.user;
  if (!user) {
    throw new CustomError("Could not fetch user.", CustomError.USER_NOT_FOUND);
  }

  /** @type {ContributionDay[]} */
  const contributions =
    user.contributionsCollection.contributionCalendar.weeks.flatMap(
      (/** @type {any} */ week) =>
        week.contributionDays.map((/** @type {any} */ day) => ({
          date: day.date,
          count: day.contributionCount,
        })),
    );

  if (!isCustomRange) {
    if (contributions.at(-1)?.count === 0) {
      contributions.pop();
    }
    contributions.splice(0, Math.max(0, contributions.length - days));
  }

  return { name: user.name, contributions };
};

export { fetchGraph };
export default fetchGraph;
