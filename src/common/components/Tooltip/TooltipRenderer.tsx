import { Fragment } from "react";

import TooltipContainer from "./TooltipContainer";

import { useTooltipContext } from "@/common/hooks/useTooltipContext";

export default function TooltipRenderer() {
  const { getActiveInstances } = useTooltipContext();

  const activeInstances = getActiveInstances();

  if (activeInstances.size === 0) {
    return null;
  }

  return (
    <Fragment>
      {Array.from(activeInstances).map(([id, instance]) => {
        return <TooltipContainer key={id} {...instance} />;
      })}
    </Fragment>
  );
}
