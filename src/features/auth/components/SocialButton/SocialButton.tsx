import { useCallback } from "react";
import { TouchableOpacity } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";
import { SocialLoginResponse, useSocialLogin } from "@/features/auth/hooks/useSocialLogin";

export type SocialType = "KAKAO" | "NAVER" | "APPLE" | "GOOGLE";

export interface SocialButtonProps {
  socialType: SocialType;
  onPress: (response: SocialLoginResponse) => void;
}

export default function SocialButton(props: SocialButtonProps) {
  const { socialType, onPress } = props;
  const { login } = useSocialLogin(socialType);

  // ---- wrapper ----
  const getDefaultWrapperClassName = () => {
    return "flex flex-row items-center w-full px-20 h-49 rounded-md";
  };

  const getWrapperClassNameByVariant = () => {
    switch (socialType) {
      case "NAVER":
        return "bg-[#47BA1B]";
      case "KAKAO":
        return "bg-[#FAE100]";
      case "GOOGLE":
        return "bg-white";
      case "APPLE":
        return "bg-black border-[1px] border-[#FFFFFF33]";
    }
  };
  // ---- wrapper ----

  // ---- text ----
  const getDefaultTextClassName = () => {
    return "flex-1 font-[600] text-center text-[16px]";
  };

  const getTextClassNameByVariant = () => {
    switch (socialType) {
      case "NAVER":
        return "text-white";
      case "KAKAO":
        return "text-black";
      case "GOOGLE":
        return "text-black";
      case "APPLE":
        return "text-white";
    }
  };
  // ---- text ----

  const getLabel = () => {
    switch (socialType) {
      case "NAVER":
        return "네이버로 시작하기";
      case "KAKAO":
        return "카카오로 시작하기";
      case "GOOGLE":
        return "구글로 시작하기";
      case "APPLE":
        return "애플로 시작하기";
    }
  };

  const getIcon = () => {
    switch (socialType) {
      case "NAVER":
        return <Icon icon={COMMON_ASSETS.naver} />;
      case "KAKAO":
        return <Icon icon={COMMON_ASSETS.kakao} />;
      case "GOOGLE":
        return <Icon icon={COMMON_ASSETS.google} />;
      case "APPLE":
        return <Icon icon={COMMON_ASSETS.apple} />;
    }
  };

  const handlePress = useCallback(async () => {
    const res = await login();

    if (!res) {
      return;
    }
    onPress(res);
  }, [login, onPress]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      className={cn(getDefaultWrapperClassName(), getWrapperClassNameByVariant())}
    >
      {getIcon()}
      <Typography className={cn(getDefaultTextClassName(), getTextClassNameByVariant())}>
        {getLabel()}
      </Typography>
    </TouchableOpacity>
  );
}
