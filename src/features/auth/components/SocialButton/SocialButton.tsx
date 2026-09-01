import { useCallback } from "react";
import { TouchableOpacity } from "react-native";

import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { toast } from "@/common/providers/ToastProvider";
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
  /**
   * 아이콘과 라벨을 **한 덩어리로 가운데** 둔다(시안 C0 — `justify-content:center; gap:9px`).
   *
   * 아이콘을 왼쪽 끝에 붙이고 라벨만 남은 칸에서 가운데 정렬하면, 글자가 버튼 중심보다
   * 아이콘 폭만큼 오른쪽으로 밀려 버튼 세 개의 글자 축이 서로 어긋난다.
   */
  const getDefaultWrapperClassName = () => {
    return "h-52 w-full flex-row items-center justify-center rounded-base";
  };

  const getWrapperClassNameByVariant = () => {
    switch (socialType) {
      case "NAVER":
        return "bg-[#06B856]";
      case "KAKAO":
        return "bg-[#F7DE23]";
      case "GOOGLE":
        return "border-[1px] border-borderButtonStrong bg-white";
      case "APPLE":
        return "bg-[#1A1A1A]";
    }
  };

  // ---- text ----
  const getTextColor = () => {
    switch (socialType) {
      case "NAVER":
        return "#FFFFFF";
      case "KAKAO":
        return "#191919";
      case "GOOGLE":
        return "#2E2E2E";
      case "APPLE":
        return "#FFFFFF";
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

  /** 마크마다 글자에 대한 시각적 무게가 달라 크기를 한 값으로 맞추지 않는다(시안 C0) */
  const getIcon = () => {
    switch (socialType) {
      case "NAVER":
        return <Icon icon={COMMON_ASSETS.naver} width={17} height={17} />;
      case "KAKAO":
        return <Icon icon={COMMON_ASSETS.kakao} width={19} height={19} />;
      case "GOOGLE":
        return <Icon icon={COMMON_ASSETS.google} width={18} height={18} />;
      case "APPLE":
        return <Icon icon={COMMON_ASSETS.apple} width={18} height={18} />;
    }
  };

  /**
   * 소셜 SDK는 실패 사유를 예외로 던진다. 잡지 않으면 처리되지 않은 rejection 으로 사라져
   * 화면에는 "버튼을 눌렀는데 아무 일도 안 일어남"으로만 보인다 — 키 해시 불일치나 스킴
   * 불일치처럼 설정에서 오는 실패가 대부분이라, 사유를 보여 주지 않으면 원인을 좁힐 수 없다.
   *
   * 사용자가 로그인 창을 직접 닫은 경우는 실패가 아니므로 조용히 넘긴다.
   */
  const handlePress = useCallback(async () => {
    try {
      const res = await login();

      if (!res) {
        return;
      }
      onPress(res);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (/CANCELLED|cancel|dismiss/i.test(message)) {
        return;
      }

      console.error(`[social-login] ${socialType}`, error);
      toast.show(`로그인에 실패했어요 (${message})`);
    }
  }, [login, onPress, socialType]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      className={cn(getDefaultWrapperClassName(), getWrapperClassNameByVariant())}
      style={{ gap: 9 }}
    >
      {getIcon()}
      <Typography style={{ fontSize: 15, fontWeight: "600", lineHeight: 15, color: getTextColor() }}>
        {getLabel()}
      </Typography>
    </TouchableOpacity>
  );
}
