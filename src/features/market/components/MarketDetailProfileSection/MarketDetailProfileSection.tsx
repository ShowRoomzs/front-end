import { useMemo, useState } from "react";
import { Image, Linking, View } from "react-native";

import Button from "@/common/components/Button/Button";
import HStack from "@/common/components/HStack/HStack";
import Typography from "@/common/components/Typography/Typography";
import VStack from "@/common/components/VStack/VStack";
import { usePermissionPress } from "@/common/hooks/usePermissionPress";
import { parseDeepLink } from "@/common/utils/parseDeepLink";
import SnsButton from "@/features/market/components/SnsButton/SnsButton";
import { SnsLink, SnsLinks } from "@/features/market/types/market";

interface MarketDetailProfileSectionProps {
  thumbnailUrl: string;
  marketName: string;
  followerCount: number;
  categoryName: string;
  shopDescription: string;
  snsLinks: SnsLinks;
  onPressFollow: (newIsFollowed: boolean) => void;
  isFollowed: boolean;
  wrapperClassName?: string;
}
export default function MarketDetailProfileSection(props: MarketDetailProfileSectionProps) {
  const {
    thumbnailUrl,
    marketName,
    followerCount,
    shopDescription,
    snsLinks,
    onPressFollow,
    categoryName,
    isFollowed,
    wrapperClassName,
  } = props;
  const [localIsFollowed, setLocalIsFollowed] = useState(isFollowed);

  const handlePressSns = async (snsLink: SnsLink) => {
    const { appUrl, webUrl } = parseDeepLink(snsLink);
    const supported = await Linking.canOpenURL(appUrl);

    await Linking.openURL(supported ? appUrl : webUrl);
  };

  const handlePressFollow = usePermissionPress(() => {
    const newIsFollowed = !localIsFollowed;

    // 낙관적 업데이트
    setLocalIsFollowed(newIsFollowed);
    onPressFollow(newIsFollowed);
  });

  // 낙관적 업데이트를 위한 팔로워 수
  const localFollowCount = useMemo(() => {
    // 원래 팔로우인 경우
    if (isFollowed) {
      return localIsFollowed ? followerCount : followerCount - 1;
    }
    // 원래 팔로우 아닌 경우
    return localIsFollowed ? followerCount + 1 : followerCount;
  }, [followerCount, isFollowed, localIsFollowed]);

  return (
    <VStack gap={20} className={wrapperClassName}>
      <View className="flex flex-row" style={{ gap: 10 }}>
        <Image
          style={{ borderColor: "rgba(13, 12, 17, 0.1)" }}
          source={{ uri: thumbnailUrl }}
          className="w-60 h-60 rounded-full border-[1px]"
        />
        <View className="flex flex-row justify-between flex-1">
          <View className="flex flex-col">
            <Typography className="text-black text-16 font-semibold">{marketName}</Typography>
            <Typography className="text-gray10 text-11 font-normal mt-4">{categoryName}</Typography>
            <HStack className="mt-10">
              {snsLinks.map(sns => (
                <SnsButton key={sns.snsType} snsLink={sns} onPress={() => handlePressSns(sns)} />
              ))}
            </HStack>
          </View>
          <VStack gap={5}>
            <Typography className="text-black text-11 font-normal text-center">팔로워</Typography>
            <Typography className="text-black text-16 font-medium text-center">
              {localFollowCount.toLocaleString()}
            </Typography>
          </VStack>
        </View>
      </View>
      <Typography className="text-13 text-gray10 font-normal">{shopDescription}</Typography>
      <Button onPress={handlePressFollow} className="w-full" variant="primary">
        {localIsFollowed ? "팔로잉" : "팔로우"}
      </Button>
    </VStack>
  );
}
