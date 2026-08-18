import { TouchableOpacity, View } from "react-native";

import Avatar from "@/common/components/Avatar/Avatar";
import { ChevronRightIcon } from "@/common/components/DsIcon/icons";
import Typography from "@/common/components/Typography/Typography";
import RoleBadge from "@/features/mypage/components/RoleBadge/RoleBadge";
import { User } from "@/features/user/types/user";

/** 마이 프로필 — 아바타 50 · 이름 600/14 · 역할 칩은 이름 아랫줄 */
interface MypageProfileCardProps {
  user: User;
  onPressProfile: () => void;
}

export default function MypageProfileCard(props: MypageProfileCardProps) {
  const { user, onPressProfile } = props;

  return (
    <TouchableOpacity
      onPress={onPressProfile}
      activeOpacity={0.7}
      className="flex-row items-center bg-white px-14 py-18"
      style={{ gap: 12 }}
    >
      <Avatar imageUrl={user.profileImageUrl} size={50} />
      <View className="min-w-0 flex-1">
        <Typography variant="profileNameSmall" className="text-ink" numberOfLines={1}>
          {user.nickname}
        </Typography>
        <View className="mt-6">
          <RoleBadge roleType={user.roleType} />
        </View>
      </View>
      <ChevronRightIcon size={16} />
    </TouchableOpacity>
  );
}
