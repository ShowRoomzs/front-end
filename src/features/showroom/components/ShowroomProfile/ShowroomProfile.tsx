import { Linking, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import Avatar from "@/common/components/Avatar/Avatar";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { parseInstagramLink } from "@/common/utils/parseDeepLink";
import { ShowroomDetail } from "@/features/showroom/types/showroom";

/**
 * C4 쇼룸 프로필 — 아바타 72(공구 진행 중이면 로즈 링) · 이름 · 아이디 · 게시물/팔로워 수 ·
 * 소개 한 줄 · 팔로우 + 인스타그램.
 *
 * 쇼룸이 소비자에게 공개하는 채널은 인스타그램 하나다. URL이 없으면 버튼을 그리지 않는다.
 */
interface ShowroomProfileProps {
  showroom: ShowroomDetail;
  onPressFollow: (showroomId: number, isFollowing: boolean) => void;
}

export default function ShowroomProfile(props: ShowroomProfileProps) {
  const { showroom, onPressFollow } = props;

  const handlePressInstagram = async () => {
    if (!showroom.instagramUrl) {
      return;
    }
    const { appUrl, webUrl } = parseInstagramLink(showroom.instagramUrl);

    // 앱이 있으면 앱으로 — 브라우저를 거치면 로그인 상태가 끊겨 프로필이 반쪽만 보인다
    const canOpenApp = await Linking.canOpenURL(appUrl).catch(() => false);

    void Linking.openURL(canOpenApp ? appUrl : webUrl);
  };

  return (
    <View className="bg-white" style={{ paddingHorizontal: 14, paddingTop: 20, paddingBottom: 18 }}>
      <View className="flex-row items-center" style={{ gap: 14 }}>
        <Avatar
          imageUrl={showroom.showroomImageUrl}
          size={72}
          hasOngoingGroupBuy={showroom.hasOngoingGroupBuy}
        />

        <View className="min-w-0 flex-1">
          <Typography variant="profileName" className="text-ink" numberOfLines={1}>
            {showroom.showroomName}
          </Typography>
          <Typography
            style={{ fontSize: 12.5, lineHeight: 16.9, marginTop: 4 }}
            className="text-gray45"
            numberOfLines={1}
          >
            @{showroom.showroomAddress}
          </Typography>

          <View className="mt-8 flex-row items-center" style={{ gap: 10 }}>
            <Typography style={{ fontSize: 12.5, lineHeight: 12.5 }} className="text-ink76">
              게시물 <Typography style={{ fontWeight: "600" }}>{showroom.postCount}</Typography>
            </Typography>
            <View className="bg-dotInactive" style={{ width: 1, height: 10 }} />
            <Typography style={{ fontSize: 12.5, lineHeight: 12.5 }} className="text-ink76">
              팔로워{" "}
              <Typography style={{ fontWeight: "600" }}>{showroom.followerCount.toLocaleString()}</Typography>
            </Typography>
          </View>
        </View>
      </View>

      <Typography
        variant="body"
        style={{ lineHeight: 22.95, marginTop: 14 }}
        className={showroom.introduction ? "text-ink76" : "text-gray55"}
      >
        {showroom.introduction ?? "소개 미등록"}
      </Typography>

      <View className="mt-14 flex-row" style={{ gap: 8 }}>
        <TouchableOpacity
          onPress={() => onPressFollow(showroom.showroomId, showroom.isFollowing)}
          activeOpacity={0.6}
          className={`h-44 flex-1 flex-row items-center justify-center rounded-base ${
            showroom.isFollowing ? "border-[1px] border-borderButton bg-white" : "bg-rose"
          }`}
        >
          <Typography variant="buttonInline" className={showroom.isFollowing ? "text-ink76" : "text-white"}>
            {showroom.isFollowing ? "팔로잉" : "팔로우"}
          </Typography>
        </TouchableOpacity>

        {!!showroom.instagramUrl && (
          <TouchableOpacity
            onPress={handlePressInstagram}
            activeOpacity={0.6}
            className="h-44 w-44 items-center justify-center rounded-base border-[1px] border-borderButton"
          >
            <Icon icon={COMMON_ASSETS.instagram} width={22} height={22} />
            <Svg
              width={9}
              height={9}
              viewBox="0 0 24 24"
              fill="none"
              style={{ position: "absolute", top: 5, right: 5 }}
            >
              <Path d="M9.5 8H16v6.5" stroke="#C7C7C7" strokeWidth={3} strokeLinecap="round" />
              <Path d="M8.4 15.6L16 8" stroke="#C7C7C7" strokeWidth={3} strokeLinecap="round" />
            </Svg>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
