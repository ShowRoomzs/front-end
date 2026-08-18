import { TouchableOpacity, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";
import { useMainNavigation } from "@/common/router";
import { ROOT_ROUTES } from "@/common/router/routes";
import { cn } from "@/common/utils/cn";

/**
 * 로그인 유도 블록 — 제목 19/700 + 설명 13/1.7 #737373 + 로즈 Primary 45px R8 · 라벨 14/600.
 *
 * 비로그인 화면에서 프로필·개인 데이터 영역을 대체하는 자리에만 쓰고, 한 화면에 하나만 둔다.
 * (하단 고정 CTA는 52px/15.5, 콘텐츠 안에 놓이는 유도 CTA는 45px/14로 한 단계 낮춘다)
 */
interface LoginPromptProps {
  title: string;
  description: string;
  buttonLabel?: string;
  className?: string;
  onSuccessLogin?: () => void;
}

export default function LoginPrompt(props: LoginPromptProps) {
  const {
    title,
    description,
    buttonLabel = "회원가입 하고 3초 만에 시작하기",
    className,
    onSuccessLogin,
  } = props;
  const navigation = useMainNavigation();

  const handlePress = () => {
    navigation.navigate(ROOT_ROUTES.AUTH, { params: { onSuccessLogin } });
  };

  return (
    <View className={cn("px-14 py-32", className)}>
      <Typography variant="promptTitle" className="text-ink">
        {title}
      </Typography>
      <Typography variant="promptBody" className="mt-8 text-gray45">
        {description}
      </Typography>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8} className="mt-20">
        <View className="h-45 flex-row items-center justify-center rounded-base bg-rose">
          <Typography variant="buttonInline" className="text-white">
            {buttonLabel}
          </Typography>
        </View>
      </TouchableOpacity>
    </View>
  );
}
