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

  /**
   * 높이 52 · R8로 통일한다. 브랜드 색은 유지하되 명도를 낮춰 형광 느낌을 덜어냈다 —
   * 카카오 #F7DE23 · 네이버 #06B856 · Apple #1A1A1A. Google은 브랜드 가이드상
   * 흰 배경 + 회색 테두리 + 컬러 G 마크가 표준이라 그대로 따른다.
   *
   * 로즈는 이 화면에 쓰지 않는다 — 공구 신호가 아니라 플랫폼 색이 주인공인 자리다.
   */
  const getDefaultWrapperClassName = () => {
    return "flex w-full h-52 flex-row items-center rounded-base px-20";
  };

  const getWrapperClassNameByVariant = () => {
    switch (socialType) {
      case "NAVER":
        return "bg-[#06B856]";
      case "KAKAO":
        return "bg-[#F7DE23]";
      case "GOOGLE":
        return "border-[1px] border-borderButton bg-white";
      case "APPLE":
        return "bg-[#1A1A1A]";
    }
  };

  // ---- text ----
  const getDefaultTextClassName = () => {
    return "flex-1 text-center";
  };

  const getTextClassNameByVariant = () => {
    switch (socialType) {
      case "NAVER":
        return "text-white";
      case "KAKAO":
        return "text-black";
      case "GOOGLE":
        return "text-ink";
      case "APPLE":
        return "text-white";
    }
  };
  // ---- text ----

  const getLabel = () => {
    switch (socialType) {
      case "NAVER":
        return "네이버로 계속하기";
      case "KAKAO":
        return "카카오로 계속하기";
      case "GOOGLE":
        return "Google로 계속하기";
      case "APPLE":
        return "Apple로 계속하기";
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
      <Typography
        variant="buttonPrimary"
        className={cn(getDefaultTextClassName(), getTextClassNameByVariant())}
      >
        {getLabel()}
      </Typography>
    </TouchableOpacity>
  );
}
