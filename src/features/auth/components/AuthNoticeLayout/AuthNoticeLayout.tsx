import { ReactNode } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Typography from "@/common/components/Typography/Typography";

/**
 * 인증 결과 안내 화면의 공통 뼈대 — 만 14세 차단(C0 1d)과 인증 실패(C0 1e)가 함께 쓴다.
 *
 * 아이콘 원 64 · 제목 19/700 · 설명 13.5/1.75 · 회색 안내 블록 · 하단 고정 버튼 순서다.
 * 두 화면의 성격이 달라 **아이콘 색만 갈린다** — 차단은 로즈 틴트(되돌릴 수 없는 상태),
 * 실패는 중립 회색(일시적 중단이라 경고색을 쓰지 않는다).
 */
interface AuthNoticeLayoutProps {
  icon: ReactNode;
  /** 아이콘을 감싸는 원의 배경 — 로즈 틴트(#FEF4F6) 또는 중립(#F4F4F5) */
  iconBackgroundColor: string;
  title: string;
  description: string;
  /** 회색 블록 안 부가 안내. 없으면 그리지 않는다 */
  notice?: string;
  footer: ReactNode;
}

export default function AuthNoticeLayout(props: AuthNoticeLayoutProps) {
  const { icon, iconBackgroundColor, title, description, notice, footer } = props;
  const { bottom } = useSafeAreaInsets();

  return (
    <>
      <View
        className="flex-1 items-center justify-center"
        style={{ paddingHorizontal: 34, paddingBottom: 40 }}
      >
        <View
          className="items-center justify-center rounded-full"
          style={{ width: 64, height: 64, backgroundColor: iconBackgroundColor }}
        >
          {icon}
        </View>

        <Typography
          style={{ fontSize: 19, fontWeight: "700", lineHeight: 27.55, letterSpacing: -0.4, marginTop: 20 }}
          className="text-center text-ink"
        >
          {title}
        </Typography>
        <Typography
          style={{ fontSize: 13.5, lineHeight: 23.6, marginTop: 11 }}
          className="text-center text-gray45"
        >
          {description}
        </Typography>

        {!!notice && (
          <View className="mt-16 rounded-base bg-band" style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <Typography style={{ fontSize: 12, lineHeight: 20.4 }} className="text-center text-gray45">
              {notice}
            </Typography>
          </View>
        )}
      </View>

      <View className="bg-white px-14 pt-12" style={{ gap: 9, paddingBottom: bottom + 26 }}>
        {footer}
      </View>
    </>
  );
}
