import { TouchableOpacity, View } from "react-native";

import Avatar from "@/common/components/Avatar/Avatar";
import { ChevronRightIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import { useSuspension } from "@/features/account/hooks/useAccountStatus";
import RoleBadge from "@/features/mypage/components/RoleBadge/RoleBadge";
import { User } from "@/features/user/types/user";

/** 마이 프로필 — 아바타 50 · 이름 600/14 · 역할 칩은 이름 아랫줄 */
interface MypageProfileCardProps {
  user: User;
  onPressProfile: () => void;
}

export default function MypageProfileCard(props: MypageProfileCardProps) {
  const { user, onPressProfile } = props;
  const suspension = useSuspension();

  return (
    <TouchableOpacity
      onPress={onPressProfile}
      activeOpacity={0.7}
      className="flex-row items-center bg-white px-14 py-20"
      style={{ gap: 14 }}
    >
      <Avatar imageUrl={user.profileImageUrl} size={50} />
      <View className="min-w-0 flex-1">
        {/* C20 1f — 상태 배지는 닉네임 옆, 등급 칩(아랫줄)과 줄을 나눠 둘이 섞이지 않게 한다 */}
        <View className="flex-row items-center" style={{ gap: 7 }}>
          <Typography variant="profileNameSmall" className="min-w-0 flex-shrink text-ink" numberOfLines={1}>
            {user.nickname}
          </Typography>
          {!!suspension && (
            <View
              className="rounded-base"
              style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: "#FDECEC" }}
            >
              <Typography style={{ fontSize: 11, fontWeight: "600", lineHeight: 11, color: "#B42318" }}>
                이용 정지
              </Typography>
            </View>
          )}
        </View>
        {/* 칩을 -4만큼 내미는 것은 칩 안쪽 여백(9) 때문에 글자가 닉네임보다 안으로 밀려 보이기 때문이다 */}
        <View style={{ marginTop: 4, marginLeft: -4 }}>
          <RoleBadge roleType={user.roleType} />
        </View>
      </View>
      <ChevronRightIcon size={17} />
    </TouchableOpacity>
  );
}
