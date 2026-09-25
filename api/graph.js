// @ts-check

import { renderGraphCard } from "../src/cards/graph.js";
import { guardAccess } from "../src/common/access.js";
import {
  CACHE_TTL,
  resolveCacheSeconds,
  setCacheHeaders,
  setErrorCacheHeaders,
} from "../src/common/cache.js";
import { retrieveSecondaryMessage } from "../src/common/error.js";
import { parseBoolean } from "../src/common/ops.js";
import { renderError } from "../src/common/render.js";
import { fetchGraph } from "../src/fetchers/graph.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_DAYS = 31;
const MAX_DAYS = 90;
// GitHub rejects contribution ranges longer than one year.
const MAX_RANGE_DAYS = 365;

/**
 * Parses a strict YYYY-MM-DD date as UTC midnight.
 *
 * @param {unknown} value The date string.
 * @returns {Date | null} The date, or null when invalid.
 */
const parseDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value)
    ? date
    : null;
};

/**
 * Resolves the range to show: a valid custom from/to range, else the last
 * `days` days.
 *
 * @param {object} args Query values.
 * @param {unknown} args.days Number of days.
 * @param {unknown} args.from Range start (YYYY-MM-DD).
 * @param {unknown} args.to Range end (YYYY-MM-DD).
 * @returns {{ days: number, from?: Date, to?: Date }} The range.
 */
const resolveRange = ({ days, from, to }) => {
  const fromDate = parseDate(from);
  const toDate = parseDate(to);
  if (fromDate && toDate) {
    const rangeDays = Math.round(
      (toDate.getTime() - fromDate.getTime()) / DAY_MS,
    );
    if (
      rangeDays > 0 &&
      rangeDays <= MAX_RANGE_DAYS &&
      toDate.getTime() <= Date.now()
    ) {
      return { days: rangeDays, from: fromDate, to: toDate };
    }
  }

  const parsedDays = parseInt(String(days), 10);
  return {
    days: parsedDays >= 1 && parsedDays <= MAX_DAYS ? parsedDays : DEFAULT_DAYS,
  };
};

/**
 * Parses an optional number query value.
 *
 * @param {unknown} value The query value.
 * @returns {number | undefined} The number, or undefined when missing.
 */
const parseNumber = (value) => {
  return value === undefined ? undefined : parseInt(String(value), 10);
};

// @ts-ignore
export default async (req, res) => {
  const {
    username,
    theme,
    custom_title,
    hide_title,
    title_color,
    color,
    line,
    point,
    area,
    area_color,
    bg_color,
    border_color,
    hide_border,
    radius,
    height,
    days,
    from,
    to,
    grid,
    cache_seconds,
  } = req.query;

  res.setHeader("Content-Type", "image/svg+xml");

  // Graph themes differ from card themes, so errors use the plain colors.
  const errorColors = {
    title_color,
    text_color: color,
    bg_color,
    border_color,
  };

  const access = guardAccess({
    res,
    id: username,
    type: "username",
    colors: errorColors,
  });
  if (!access.isPassed) {
    return access.result;
  }

  try {
    const range = resolveRange({ days, from, to });
    const graphData = await fetchGraph(username, range);
    const cacheSeconds = resolveCacheSeconds({
      requested: parseInt(cache_seconds, 10),
      def: CACHE_TTL.GRAPH_CARD.DEFAULT,
      min: CACHE_TTL.GRAPH_CARD.MIN,
      max: CACHE_TTL.GRAPH_CARD.MAX,
    });

    setCacheHeaders(res, cacheSeconds);

    return res.send(
      renderGraphCard(graphData, {
        username,
        theme,
        custom_title,
        hide_title: parseBoolean(hide_title),
        title_color,
        color,
        line,
        point,
        area: parseBoolean(area),
        area_color,
        bg_color,
        border_color,
        hide_border: parseBoolean(hide_border),
        grid: parseBoolean(grid) !== false,
        radius: parseNumber(radius),
        height: parseNumber(height),
      }),
    );
  } catch (err) {
    setErrorCacheHeaders(res);
    if (err instanceof Error) {
      return res.send(
        renderError({
          message: err.message,
          secondaryMessage: retrieveSecondaryMessage(err),
          renderOptions: errorColors,
        }),
      );
    }
    return res.send(
      renderError({
        message: "An unknown error occurred",
        renderOptions: errorColors,
      }),
    );
  }
};
