import { View } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";

interface InquiryBadgeProps {
  status: "QUESTION" | "ANSWER";
}
export default function InquiryBadge(props: InquiryBadgeProps) {
  const { status } = props;

  return (
    <View className="flex items-center justify-center bg-black w-25 h-25 rounded-full">
      <Typography className="text-white">
        <Icon icon={COMMON_ASSETS?.[status.toLowerCase()]} />
      </Typography>
    </View>
  );
}
