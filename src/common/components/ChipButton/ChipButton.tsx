import { ReactNode, useMemo } from "react";
import { Pressable } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

interface ChipButtonProps {
  label: string | ReactNode;
  onPress: () => void;
  wrapperClassName?: string;
  labelClassName?: string;
}
export default function ChipButton(props: ChipButtonProps) {
  const { label, onPress, wrapperClassName, labelClassName } = props;

  const content = useMemo(() => {
    if (typeof label === "string") {
      return (
        <Typography className={cn("text-12 text-gray14 font-normal", labelClassName)}>{label}</Typography>
      );
    }
    return label;
  }, [label, labelClassName]);

  const getDefaultClassName = () => {
    return "px-15 py-[8.5px] rounded-[30px] bg-white border-[1px] border-gray2";
  };

  return (
    <Pressable className={cn(getDefaultClassName(), wrapperClassName)} onPress={onPress}>
      {content}
    </Pressable>
  );
}
