import { ReactNode, useEffect, useState } from "react";
import { LayoutChangeEvent, View } from "react-native";

import { cn } from "@/common/utils/cn";

interface TabContentProps {
  isMounted: boolean;
  children: ReactNode;
  className?: string;
  onLayout?: (e: LayoutChangeEvent) => void;
}
export default function TabContent(props: TabContentProps) {
  const { isMounted: originMounted, children, className, onLayout } = props;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isMounted) {
      return;
    }

    setIsMounted(originMounted);
  }, [isMounted, originMounted]);

  if (!isMounted) {
    return null; // TODO 스켈레톤
  }

  return (
    <View onLayout={onLayout} className={cn("flex-grow-1", className)}>
      {children}
    </View>
  );
}
