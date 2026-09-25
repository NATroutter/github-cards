// @ts-check

import { graphThemes } from "../../themes/graph.js";
import { isValidHexColor } from "../common/color.js";
import { encodeHTML } from "../common/html.js";
import { clampValue } from "../common/ops.js";

const CARD_WIDTH = 1200;
const DEFAULT_HEIGHT = 420;
const MIN_HEIGHT = 200;
const MAX_HEIGHT = 600;
const MAX_RADIUS = 16;

// Chart layout. Matches the Chartist options of the original activity graph.
const CHART_PADDING = { top: 80, right: 50, bottom: 20, left: 20 };
const AXIS_Y_OFFSET = 70;
const AXIS_X_OFFSET = 50;
const MIN_TICK_SPACE = 20;

/**
 * @typedef {import('../fetchers/graph.js').GraphData} GraphData Graph data.
 */

/**
 * @typedef {{
 *  titleColor: string;
 *  color: string;
 *  lineColor: string;
 *  pointColor: string;
 *  areaColor: string;
 *  bgColor: string;
 *  borderColor: string;
 * }} GraphColors
 */

/**
 * Returns the first valid hex color from the candidates.
 *
 * @param {...(string|undefined)} candidates Colors in order of priority.
 * @returns {string} The color prefixed with "#".
 */
const pickColor = (...candidates) => {
  const color = candidates.find(
    (candidate) => typeof candidate === "string" && isValidHexColor(candidate),
  );
  return `#${color}`;
};

/**
 * Returns theme based graph colors with user overrides.
 *
 * @param {object} args Function arguments.
 * @param {string=} args.theme Graph theme name.
 * @param {string=} args.title_color Title color.
 * @param {string=} args.color Text and grid color.
 * @param {string=} args.line Line color.
 * @param {string=} args.point Point color.
 * @param {string=} args.area_color Area color.
 * @param {string=} args.bg_color Background color.
 * @param {string=} args.border_color Border color.
 * @param {boolean=} args.hide_border Whether to hide the border.
 * @returns {GraphColors} Graph colors.
 */
const getGraphColors = ({
  theme,
  title_color,
  color,
  line,
  point,
  area_color,
  bg_color,
  border_color,
  hide_border,
}) => {
  const selected =
    theme && Object.hasOwn(graphThemes, theme)
      ? graphThemes[/** @type {keyof typeof graphThemes} */ (theme)]
      : graphThemes.default;

  return {
    titleColor: pickColor(title_color, color, selected.title_color),
    color: pickColor(color, selected.color),
    lineColor: pickColor(line, selected.line_color),
    pointColor: pickColor(point, selected.point_color),
    areaColor: pickColor(area_color, selected.area_color),
    bgColor: pickColor(bg_color, selected.bg_color),
    borderColor: pickColor(
      border_color,
      hide_border ? "0000" : selected.border_color,
    ),
  };
};

/**
 * Returns the smallest 1-2-5 step that keeps grid lines at least
 * MIN_TICK_SPACE pixels apart.
 *
 * @param {number} range The value range of the axis.
 * @param {number} axisLength The axis length in pixels.
 * @returns {number} The step between ticks.
 */
const getTickStep = (range, axisLength) => {
  for (let magnitude = 1; ; magnitude *= 10) {
    for (const base of [1, 2, 5]) {
      const step = base * magnitude;
      if ((step / range) * axisLength >= MIN_TICK_SPACE) {
        return step;
      }
    }
  }
};

/**
 * Rounds a coordinate to 3 decimals.
 *
 * @param {number} value The coordinate.
 * @returns {number} The rounded coordinate.
 */
const round = (value) => Math.round(value * 1000) / 1000;

/**
 * Builds a monotone cubic path through the points, the same interpolation
 * Chartist uses. The curve never overshoots, so it never dips below zero.
 *
 * @param {{ x: number; y: number }[]} points Points in drawing order.
 * @returns {string} SVG path commands.
 */
const monotoneCubicPath = (points) => {
  const n = points.length;
  if (n === 0) {
    return "";
  }
  let path = `M${round(points[0].x)},${round(points[0].y)}`;
  if (n === 1) {
    return path;
  }

  const dxs = [];
  const slopes = [];
  for (let i = 0; i < n - 1; i++) {
    dxs[i] = points[i + 1].x - points[i].x;
    slopes[i] = (points[i + 1].y - points[i].y) / dxs[i];
  }

  const tangents = [slopes[0]];
  for (let i = 1; i < n - 1; i++) {
    const before = slopes[i - 1];
    const after = slopes[i];
    if (before === 0 || after === 0 || before > 0 !== after > 0) {
      tangents[i] = 0;
    } else {
      const tangent =
        (3 * (dxs[i - 1] + dxs[i])) /
        ((2 * dxs[i] + dxs[i - 1]) / before +
          (dxs[i] + 2 * dxs[i - 1]) / after);
      tangents[i] = Number.isFinite(tangent) ? tangent : 0;
    }
  }
  tangents[n - 1] = slopes[n - 2];

  for (let i = 0; i < n - 1; i++) {
    const third = dxs[i] / 3;
    const c1x = points[i].x + third;
    const c1y = points[i].y + tangents[i] * third;
    const c2x = points[i + 1].x - third;
    const c2y = points[i + 1].y - tangents[i + 1] * third;
    path += `C${round(c1x)},${round(c1y)},${round(c2x)},${round(c2y)},${round(points[i + 1].x)},${round(points[i + 1].y)}`;
  }
  return path;
};

/**
 * Renders the activity graph card.
 *
 * @param {GraphData} data Contribution data.
 * @param {object} options Card options.
 * @param {string} options.username GitHub username.
 * @param {string=} options.theme Graph theme name.
 * @param {string=} options.custom_title Custom title.
 * @param {boolean=} options.hide_title Whether to hide the title.
 * @param {string=} options.title_color Title color.
 * @param {string=} options.color Text and grid color.
 * @param {string=} options.line Line color.
 * @param {string=} options.point Point color.
 * @param {string=} options.area_color Area color.
 * @param {string=} options.bg_color Background color.
 * @param {string=} options.border_color Border color.
 * @param {boolean=} options.hide_border Whether to hide the border.
 * @param {boolean=} options.area Whether to fill the area under the line.
 * @param {boolean=} options.grid Whether to show the grid.
 * @param {number=} options.radius Border radius, 0 to 16.
 * @param {number=} options.height Card height, 200 to 600.
 * @returns {string} The SVG markup.
 */
const renderGraphCard = (data, options) => {
  const {
    username,
    custom_title,
    hide_title = false,
    area = false,
    grid = true,
    radius,
    height,
  } = options;

  const colors = getGraphColors(options);
  const cardHeight =
    height === undefined || Number.isNaN(height)
      ? DEFAULT_HEIGHT
      : clampValue(height, MIN_HEIGHT, MAX_HEIGHT);
  const borderRadius = clampValue(radius ?? 0, 0, MAX_RADIUS);

  const defaultTitle = `${data.name ?? username}'s Contribution Graph`;
  const title = hide_title ? "" : encodeHTML(custom_title ?? defaultTitle);

  // Chart area.
  const x1 = CHART_PADDING.left + AXIS_Y_OFFSET;
  const x2 = CARD_WIDTH - CHART_PADDING.right;
  const y1 = CHART_PADDING.top;
  const y2 = cardHeight - CHART_PADDING.bottom - AXIS_X_OFFSET;

  const counts = data.contributions.map((day) => day.count);
  const range = Math.max(1, ...counts);
  const step = getTickStep(range, y2 - y1);
  const high = Math.ceil(range / step) * step;

  const xStep =
    data.contributions.length > 1
      ? (x2 - x1) / (data.contributions.length - 1)
      : 0;
  /**
   * @param {number} value Contribution count.
   * @returns {number} Y coordinate.
   */
  const toY = (value) => y2 - (value / high) * (y2 - y1);

  const points = data.contributions.map((day, index) => ({
    x: x1 + index * xStep,
    y: toY(day.count),
    day: parseInt(day.date.slice(8, 10), 10),
  }));

  const ticks = [];
  for (let value = 0; value <= high; value += step) {
    ticks.push({ value, y: toY(value) });
  }

  const gridLines = grid
    ? [
        ...points.map(
          (p) =>
            `<line x1="${round(p.x)}" x2="${round(p.x)}" y1="${y1}" y2="${y2}" class="grid"/>`,
        ),
        ...ticks.map(
          (t) =>
            `<line x1="${x1}" x2="${x2}" y1="${round(t.y)}" y2="${round(t.y)}" class="grid"/>`,
        ),
      ].join("")
    : "";

  const linePath = monotoneCubicPath(points);
  const areaPath =
    area && points.length > 1
      ? `M${round(points[0].x)},${y2}L${linePath.slice(1)}L${round(points[points.length - 1].x)},${y2}Z`
      : "";

  const pointMarks = points
    .map(
      (p) =>
        `<line x1="${round(p.x)}" y1="${round(p.y)}" x2="${round(p.x + 0.01)}" y2="${round(p.y)}" class="point"/>`,
    )
    .join("");

  const xLabels = points
    .map(
      (p) =>
        `<text x="${round(p.x - 4.5)}" y="${y2 + 20}" class="label">${p.day}</text>`,
    )
    .join("");
  const yLabels = ticks
    .map(
      (t) =>
        `<text x="${x1 - 10}" y="${round(t.y + 4.5)}" class="label" text-anchor="end">${t.value}</text>`,
    )
    .join("");

  const yCenter = (y1 + y2) / 2;

  return `
    <svg
      width="${CARD_WIDTH}"
      height="${cardHeight}"
      viewBox="0 0 ${CARD_WIDTH} ${cardHeight}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="titleId"
    >
      <title id="titleId">${title || encodeHTML(defaultTitle)}</title>
      <style>
        svg { font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif; user-select: none; }
        .header { font: 600 20px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${colors.titleColor}; }
        .label { font: 600 12px 'Segoe UI', Ubuntu, Sans-Serif; fill: ${colors.color}; }
        .grid { stroke: ${colors.color}; stroke-width: 1px; stroke-opacity: 0.3; stroke-dasharray: 2px; }
        .line {
          fill: none;
          stroke: ${colors.lineColor};
          stroke-width: 4px;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: dash 5s ease-in-out forwards;
        }
        .area { stroke: none; fill: ${colors.areaColor}; fill-opacity: 0.1; }
        .point {
          stroke: ${colors.pointColor};
          stroke-width: 10px;
          stroke-linecap: round;
          animation: blink 1s ease-in-out forwards;
        }
        @keyframes dash { to { stroke-dashoffset: 0; } }
        @keyframes blink {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      </style>
      <rect
        x="0.5"
        y="0.5"
        rx="${borderRadius}"
        width="${CARD_WIDTH - 1}"
        height="${cardHeight - 1}"
        fill="${colors.bgColor}"
        stroke="${colors.borderColor}"
        stroke-width="1"
      />
      ${title ? `<text x="${CARD_WIDTH / 2}" y="40" class="header" text-anchor="middle">${title}</text>` : ""}
      <g>${gridLines}</g>
      ${areaPath ? `<path d="${areaPath}" class="area"/>` : ""}
      ${linePath ? `<path d="${linePath}" class="line" pathLength="1"/>` : ""}
      <g>${pointMarks}</g>
      <g>${xLabels}${yLabels}</g>
      <text x="${(x1 + x2) / 2}" y="${y2 + AXIS_X_OFFSET}" class="label" text-anchor="middle" dominant-baseline="text-after-edge">Days</text>
      <text x="${CHART_PADDING.left}" y="${yCenter}" class="label" text-anchor="middle" dominant-baseline="hanging" transform="rotate(-90, ${CHART_PADDING.left}, ${yCenter})">Contributions</text>
    </svg>
  `;
};

export { getGraphColors, renderGraphCard };
export default renderGraphCard;
