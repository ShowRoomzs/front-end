import { View } from "react-native";

import { cn } from "@/common/utils/cn";
import MarketDetailProfileSection from "@/features/market/components/MarketDetailProfileSection/MarketDetailProfileSection";
import { Market } from "@/features/market/types/market";

interface MarketContentProps {
  market: Market | undefined;
  wrapperClassName?: string;
  onPressFollow: (newIsFollowed: boolean) => void;
}
export default function MarketContent(props: MarketContentProps) {
  const { market, wrapperClassName, onPressFollow } = props;

  if (!market) {
    return null;
  }
  console.log(market);
  return (
    <View className={cn(wrapperClassName)}>
      <MarketDetailProfileSection
        thumbnailUrl={market.shopImageUrl}
        marketName={market.shopName}
        categoryName={market.mainCategoryName}
        followerCount={market.followerCount}
        shopDescription={market.shopDescription}
        snsLinks={market.snsLinks}
        onPressFollow={onPressFollow}
        isFollowed={market.followed}
      />
    </View>
  );
}
