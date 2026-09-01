import { ReactNode } from "react";
import { TouchableOpacity, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { useMainNavigation } from "@/common/router";
import { ROOT_ROUTES } from "@/common/router/routes";
import { cn } from "@/common/utils/cn";

/**
 * 로그인 유도 블록 — 제목 19/700 + 설명 13/1.7 #737373 + 로즈 Primary 45px R8 · 라벨 14/600.
 *
 * 비로그인 화면에서 프로필·개인 데이터 영역을 대체하는 자리에만 쓰고, 한 화면에 하나만 둔다.
 *
 * 문구는 **화면마다 다르다.** 같은 "로그인하세요"라도 팔로잉은 팔로우한 쇼룸이, 좋아요는
 * 눌러 둔 게시물이 모이는 곳이라 로그인해서 얻는 것이 서로 다르기 때문이다. 공통 문구를
 * 세 곳에 돌려 쓰면 어느 탭에서도 "여기서 뭘 볼 수 있는지"가 설명되지 않는다.
 * (하단 고정 CTA는 52px/15.5, 콘텐츠 안에 놓이는 유도 CTA는 45px/14로 한 단계 낮춘다)
 */
interface LoginPromptProps {
  title: string;
  description: string;
  buttonLabel?: string;
  /**
   * 제목 위에 놓는 아이콘 — 그 탭이 무엇을 모아주는 곳인지 한 컷으로 말한다.
   *
   * 팔로잉·좋아요처럼 **화면 전체가 이 블록 하나뿐인** 자리에만 준다. 마이는 아래로 메뉴가
   * 계속 이어져서 아이콘을 얹으면 블록이 화면의 주인공처럼 보인다(시안 C 마이 1b).
   */
  icon?: ReactNode;
  /** 남는 세로 공간을 차지하며 가운데 정렬 — 목록이 통째로 사라진 탭(C2 1c · C3 1b)에서 쓴다 */
  fill?: boolean;
  className?: string;
  onSuccessLogin?: () => void;
}

export default function LoginPrompt(props: LoginPromptProps) {
  const {
    title,
    description,
    buttonLabel = "회원가입 하고 3초 만에 시작하기",
    icon,
    fill,
    className,
    onSuccessLogin,
  } = props;
  const navigation = useMainNavigation();

  const handlePress = () => {
    navigation.navigate(ROOT_ROUTES.AUTH, { params: { onSuccessLogin } });
  };

  return (
    <View
      className={cn(
        fill
          ? /* 아래 60은 시각 보정 — 탭바가 화면 아래를 먹어서 정중앙에 두면 밑으로 내려앉아 보인다 */
            "flex-1 items-center justify-center px-40 pb-60"
          : "px-14 pb-22 pt-24",
        className
      )}
    >
      {icon}

      <Typography variant="promptTitle" className={cn("text-ink", fill && "mt-20 text-center")}>
        {title}
      </Typography>
      <Typography variant="promptBody" className={cn("mt-9 text-gray45", fill && "mt-10 text-center")}>
        {description}
      </Typography>

      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.75}
        className={cn("mt-18 w-full", fill && "mt-22")}
      >
        <View className="h-45 flex-row items-center justify-center rounded-base bg-rose">
          <Typography variant="buttonInline" className="text-white">
            {buttonLabel}
          </Typography>
        </View>
      </TouchableOpacity>
    </View>
  );
}
