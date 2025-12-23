import { useCallback } from "react";
import { TouchableOpacity } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";
import { SocialLoginResponse, useSocialLogin } from "@/features/auth/hooks/useSocialLogin";

export type SocialType = "naver" | "google" | "apple";

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
      case "naver":
        return "bg-[#47BA1B]";
      case "google":
        return "bg-white";
      case "apple":
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
      case "naver":
        return "text-white";
      case "google":
        return "text-black";
      case "apple":
        return "text-white";
    }
  };
  // ---- text ----

  const getLabel = () => {
    switch (socialType) {
      case "naver":
        return "네이버로 시작하기";
      case "google":
        return "구글로 시작하기";
      case "apple":
        return "애플로 시작하기";
    }
  };

  const getIcon = () => {
    switch (socialType) {
      case "naver":
        return <Icon icon={COMMON_ASSETS.naver} />;
      case "google":
        return <Icon icon={COMMON_ASSETS.google} />;
      case "apple":
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
