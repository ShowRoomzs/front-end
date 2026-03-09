import { View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

interface BannerNavigationProps {
  currentIndex: number;
  maxIndex: number;
  containerClassName?: string;
}
export default function BannerNavigation(props: BannerNavigationProps) {
  const { currentIndex, maxIndex, containerClassName } = props;

  return (
    <View
      className={cn(
        "flex flex-row items-center px-10 py-4 bg-[#0D0C1199] border-[1px] border-[#FFFFFF26] rounded-[30px]",
        containerClassName
      )}
    >
      <Typography className="text-white text-10 font-normal">
        {`${currentIndex + 1} / ${maxIndex}`}
      </Typography>
    </View>
  );
}
