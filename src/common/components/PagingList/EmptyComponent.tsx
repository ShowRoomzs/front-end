import { View } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import Spinner from "@/common/components/Spinner/Spinner";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { COMMON_ASSETS } from "@/common/utils/assets";

interface EmptyComponentProps {
  isLoading: boolean;
  hasItems: boolean;
}

export default function EmptyComponent(props: EmptyComponentProps) {
  const { isLoading, hasItems } = props;

  if (isLoading) {
    return (
      <View className="flex-1 h-[500px] items-center justify-center">
        <Spinner />
      </View>
    );
  }

  if (!hasItems) {
    return (
      <View className="flex-1 h-[500px] items-center justify-center">
        <VStack gap={10} className="items-center">
          <View
            className="flex items-center justify-center w-40 h-40 rounded-full"
            style={{ backgroundColor: "rgba(13, 12, 17, 0.05)" }}
          >
            <Icon icon={COMMON_ASSETS.empty} />
          </View>
          <Typography className="text-gray12 text-15 font-medium">결과가 없습니다</Typography>
        </VStack>
      </View>
    );
  }

  return null;
}
