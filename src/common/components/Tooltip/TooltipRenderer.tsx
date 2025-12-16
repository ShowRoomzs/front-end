import { Fragment, useContext } from "react";

import Tooltip from "./Tooltip";

import { TooltipContext } from "@/common/providers/TooltipProvider";

export default function TooltipRenderer() {
  const context = useContext(TooltipContext);

  if (!context) {
    throw new Error("TooltipRenderer must be used within a TooltipProvider");
  }

  const { getActiveInstances } = context;

  const activeInstances = getActiveInstances();

  if (activeInstances.size === 0) {
    return null;
  }

  return (
    <Fragment>
      {Array.from(activeInstances).map(([id, instance]) => {
        return <Tooltip key={id} {...instance.config} />;
      })}
    </Fragment>
  );
}
