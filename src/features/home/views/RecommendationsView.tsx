import { View } from "react-native";

import BannerCarousel from "@/features/home/components/BannerCarousel/BannerCarousel";

export default function RecommendationsView() {
  return (
    <View className="flex-1">
      <BannerCarousel />
    </View>
  );
}
