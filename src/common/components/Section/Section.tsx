import { ReactNode } from "react";
import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

export interface SectionItem {
  label: string;
  renderRight: ReactNode;
}

interface SectionProps {
  title: string;
  items: Array<SectionItem>;
}

export default function Section(props: SectionProps) {
  const { title, items } = props;

  return (
    <View className="flex flex-col">
      <Typography className="text-gray9 font-semibold text-11">{title}</Typography>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <View
            key={index}
            className={cn(
              "flex flex-row justify-between items-center py-15",
              !isLast && "border-b border-gray2"
            )}
          >
            <Typography className="text-black font-medium text-14">{item.label}</Typography>
            {item.renderRight}
          </View>
        );
      })}
    </View>
  );
}
