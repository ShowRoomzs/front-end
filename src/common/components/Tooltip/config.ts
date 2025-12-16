import { TooltipPlacement, TooltipPosition } from "./Tooltip";

const ARROW_WIDTH = 10;
const ARROW_HEIGHT = 5;

function getSecondPosition(placement: TooltipPlacement, mainPosition: string) {
  return placement.split(mainPosition)[1];
}

export function calculateArrowPosition(
  width: number,
  height: number,
  pageX: number,
  pageY: number,
  placement: TooltipPlacement,
  gap: number,
  lockArrowPosition: boolean,
  arrowOffset: number
) {
  let left = 0;
  let top = 0;

  if (placement.startsWith("top")) {
    const secondPosition = getSecondPosition(placement, "top");

    left = pageX + width / 2 - ARROW_WIDTH / 2;
    top = pageY - ARROW_HEIGHT - gap;

    if (secondPosition === "Left" && !lockArrowPosition) {
      left = pageX - ARROW_WIDTH / 2;
    }
    if (secondPosition === "Right" && !lockArrowPosition) {
      left = pageX + width - ARROW_WIDTH / 2;
    }
    left += arrowOffset;
  }
  if (placement.startsWith("bottom")) {
    const secondPosition = getSecondPosition(placement, "bottom");

    left = pageX + width / 2 - ARROW_WIDTH / 2;
    top = pageY + height + ARROW_HEIGHT / 2 + gap;

    if (secondPosition === "Left" && !lockArrowPosition) {
      left = pageX - ARROW_WIDTH / 2;
    }
    if (secondPosition === "Right" && !lockArrowPosition) {
      left = pageX + width - ARROW_WIDTH / 2;
    }
    left += arrowOffset;
  }
  if (placement.startsWith("left")) {
    const secondPosition = getSecondPosition(placement, "left");

    left = pageX - ARROW_HEIGHT * 2 - gap;
    top = pageY + height / 2 - ARROW_HEIGHT / 2;

    if (secondPosition === "Top" && !lockArrowPosition) {
      top = pageY - ARROW_HEIGHT / 2;
    }
    if (secondPosition === "Bottom" && !lockArrowPosition) {
      top = pageY + height - ARROW_HEIGHT / 2;
    }
    top += arrowOffset;
  }
  if (placement.startsWith("right")) {
    const secondPosition = getSecondPosition(placement, "right");

    left = pageX + width + gap;
    top = pageY + height / 2 - ARROW_HEIGHT / 2;

    if (secondPosition === "Top" && !lockArrowPosition) {
      top = pageY - ARROW_HEIGHT / 2;
    }
    if (secondPosition === "Bottom" && !lockArrowPosition) {
      top = pageY + height - ARROW_HEIGHT / 2;
    }
    top += arrowOffset;
  }
  return { left, top };
}

export function calculateTooltipFromArrow(
  arrow: TooltipPosition,
  tooltipWidth: number,
  tooltipHeight: number,
  placement: TooltipPlacement,
  tooltipOffset: number
): TooltipPosition {
  let left = 0;
  let top = 0;

  if (placement.startsWith("top")) {
    const secondPosition = getSecondPosition(placement, "top");

    left = arrow.left + ARROW_WIDTH / 2 - tooltipWidth / 2;
    top = arrow.top - tooltipHeight + ARROW_HEIGHT / 2;

    if (secondPosition === "Left") {
      left = arrow.left;
    }
    if (secondPosition === "Right") {
      left = arrow.left - tooltipWidth + ARROW_WIDTH;
    }
    left += tooltipOffset;
  } else if (placement.startsWith("bottom")) {
    const secondPosition = getSecondPosition(placement, "bottom");

    left = arrow.left + ARROW_WIDTH / 2 - tooltipWidth / 2;
    top = arrow.top + ARROW_HEIGHT / 2;
    if (secondPosition === "Left") {
      left = arrow.left;
    }
    if (secondPosition === "Right") {
      left = arrow.left - tooltipWidth + ARROW_WIDTH;
    }
    left += tooltipOffset;
  } else if (placement.startsWith("left")) {
    const secondPosition = getSecondPosition(placement, "left");

    left = arrow.left - tooltipWidth + ARROW_HEIGHT;
    top = arrow.top - tooltipHeight / 2 + ARROW_WIDTH / 2 - ARROW_HEIGHT / 2;
    if (secondPosition === "Top") {
      top = arrow.top - ARROW_HEIGHT / 2;
    }
    if (secondPosition === "Bottom") {
      top = arrow.top - tooltipHeight + ARROW_WIDTH / 2;
    }
    top += tooltipOffset;
  } else if (placement.startsWith("right")) {
    const secondPosition = getSecondPosition(placement, "right");

    left = arrow.left + ARROW_HEIGHT;
    top = arrow.top - tooltipHeight / 2 + ARROW_WIDTH / 2 - ARROW_HEIGHT / 2;
    if (secondPosition === "Top") {
      top = arrow.top - ARROW_WIDTH / 2;
    }
    if (secondPosition === "Bottom") {
      top = arrow.top - tooltipHeight + ARROW_WIDTH / 2;
    }
    top += tooltipOffset;
  }

  return { left, top };
}
