import { View } from "react-native";

import Spinner from "@/common/components/Spinner/Spinner";

interface FooterComponentProps {
  isLoading: boolean;
  hasItems: boolean;
}

export default function FooterComponent(props: FooterComponentProps) {
  const { isLoading, hasItems } = props;

  if (isLoading && hasItems) {
    return (
      <View className="py-20 items-center justify-center">
        <Spinner size={20} />
      </View>
    );
  }

  return null;
}
