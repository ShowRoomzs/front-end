import { Text, View } from "react-native";

import Spinner from "@/common/components/Spinner/Spinner";

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
        <Text>No data</Text>
      </View>
    );
  }

  return null;
}
