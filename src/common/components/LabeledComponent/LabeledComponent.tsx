import { ReactNode } from "react";
import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

interface LabeledComponentProps {
  label: string;
  labelClassName?: string;
  children: ReactNode;
}

export default function LabeledComponent(props: LabeledComponentProps) {
  const { children, label, labelClassName } = props;

  return (
    <View className="w-full">
      <Typography className={cn("text-black text-13 font-medium", labelClassName)}>{label}</Typography>
      <View className="mt-10">{children}</View>
    </View>
  );
}
