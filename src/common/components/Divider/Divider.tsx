import { View } from "react-native";

import { cn } from "@/common/utils/cn";

interface DividerProps {
  height?: number;
  wrapperClassName?: string;
}

export default function Divider(props: DividerProps) {
  const { wrapperClassName, height = 1 } = props;

  return <View className={cn("w-full", wrapperClassName)} style={{ height }} />;
}
