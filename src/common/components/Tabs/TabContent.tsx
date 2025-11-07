import { ReactNode, useEffect, useState } from "react";
import { View } from "react-native";

interface TabContentProps {
  isMounted: boolean;
  children: ReactNode;
  className?: string;
}
export default function TabContent(props: TabContentProps) {
  const { isMounted: originMounted, children, className } = props;
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

  return <View className={className}>{children}</View>;
}
