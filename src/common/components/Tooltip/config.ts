import { TooltipBasePlacement, TooltipPlacement, TooltipPosition, TooltipSecondPlacement } from "./Tooltip";

const ARROW_WIDTH = 10;
const ARROW_HEIGHT = 5;

export const ARROW_ROTATION: Record<TooltipBasePlacement, number> = {
  top: 180,
  bottom: 0,
  left: 90,
  right: 270,
};

function getSecondPlacement(
  placement: TooltipPlacement,
  basePlacement: TooltipBasePlacement
): TooltipSecondPlacement {
  return placement.split(basePlacement)[1] as TooltipSecondPlacement;
}
export function getBasePlacement(placement: TooltipPlacement): TooltipBasePlacement {
  if (placement.startsWith("top")) {
    return "top";
  }
  if (placement.startsWith("bottom")) {
    return "bottom";
  }
  if (placement.startsWith("left")) {
    return "left";
  }
  return "right";
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

  const basePlacement = getBasePlacement(placement);

  switch (basePlacement) {
    case "top": {
      const secondPlacement = getSecondPlacement(placement, basePlacement);

      left = pageX + width / 2 - ARROW_WIDTH / 2;
      top = pageY - ARROW_HEIGHT - gap;

      if (secondPlacement === "Left" && !lockArrowPosition) {
        left = pageX - ARROW_WIDTH / 2;
      }
      if (secondPlacement === "Right" && !lockArrowPosition) {
        left = pageX + width - ARROW_WIDTH / 2;
      }
      left += arrowOffset;
      break;
    }
    case "bottom": {
      const secondPlacement = getSecondPlacement(placement, basePlacement);

      left = pageX + width / 2 - ARROW_WIDTH / 2;
      top = pageY + height + ARROW_HEIGHT / 2 + gap;

      if (secondPlacement === "Left" && !lockArrowPosition) {
        left = pageX - ARROW_WIDTH / 2;
      }
      if (secondPlacement === "Right" && !lockArrowPosition) {
        left = pageX + width - ARROW_WIDTH / 2;
      }
      left += arrowOffset;
      break;
    }
    case "left": {
      const secondPlacement = getSecondPlacement(placement, basePlacement);

      left = pageX - ARROW_HEIGHT * 2 - gap;
      top = pageY + height / 2 - ARROW_HEIGHT / 2;

      if (secondPlacement === "Top" && !lockArrowPosition) {
        top = pageY - ARROW_HEIGHT / 2;
      }
      if (secondPlacement === "Bottom" && !lockArrowPosition) {
        top = pageY + height - ARROW_HEIGHT / 2;
      }
      top += arrowOffset;
      break;
    }
    case "right": {
      const secondPlacement = getSecondPlacement(placement, basePlacement);

      left = pageX + width + gap;
      top = pageY + height / 2 - ARROW_HEIGHT / 2;

      if (secondPlacement === "Top" && !lockArrowPosition) {
        top = pageY - ARROW_HEIGHT / 2;
      }
      if (secondPlacement === "Bottom" && !lockArrowPosition) {
        top = pageY + height - ARROW_HEIGHT / 2;
      }
      top += arrowOffset;
      break;
    }
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
    const secondPlacement = getSecondPlacement(placement, "top");

    left = arrow.left + ARROW_WIDTH / 2 - tooltipWidth / 2;
    top = arrow.top - tooltipHeight + ARROW_HEIGHT / 2;

    if (secondPlacement === "Left") {
      left = arrow.left;
    }
    if (secondPlacement === "Right") {
      left = arrow.left - tooltipWidth + ARROW_WIDTH;
    }
    left += tooltipOffset;
  } else if (placement.startsWith("bottom")) {
    const secondPlacement = getSecondPlacement(placement, "bottom");

    left = arrow.left + ARROW_WIDTH / 2 - tooltipWidth / 2;
    top = arrow.top + ARROW_HEIGHT / 2;
    if (secondPlacement === "Left") {
      left = arrow.left;
    }
    if (secondPlacement === "Right") {
      left = arrow.left - tooltipWidth + ARROW_WIDTH;
    }
    left += tooltipOffset;
  } else if (placement.startsWith("left")) {
    const secondPlacement = getSecondPlacement(placement, "left");

    left = arrow.left - tooltipWidth + ARROW_HEIGHT;
    top = arrow.top - tooltipHeight / 2 + ARROW_WIDTH / 2 - ARROW_HEIGHT / 2;
    if (secondPlacement === "Top") {
      top = arrow.top - ARROW_HEIGHT / 2;
    }
    if (secondPlacement === "Bottom") {
      top = arrow.top - tooltipHeight + ARROW_WIDTH / 2;
    }
    top += tooltipOffset;
  } else if (placement.startsWith("right")) {
    const secondPlacement = getSecondPlacement(placement, "right");

    left = arrow.left + ARROW_HEIGHT;
    top = arrow.top - tooltipHeight / 2 + ARROW_WIDTH / 2 - ARROW_HEIGHT / 2;
    if (secondPlacement === "Top") {
      top = arrow.top - ARROW_WIDTH / 2;
    }
    if (secondPlacement === "Bottom") {
      top = arrow.top - tooltipHeight + ARROW_WIDTH / 2;
    }
    top += tooltipOffset;
  }

  return { left, top };
}
