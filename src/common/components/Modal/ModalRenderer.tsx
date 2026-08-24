import { TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import Typography from "@/common/components/Typography/Typography";
import { useModal, useModalState } from "@/common/providers/ModalProvider/context";

/**
 * 확인 모달 — 디자인 시스템 05.
 *
 * 좌우 32 여백 · R8 · 제목 16.5/700 · 설명 13/1.7 #737373 · 버튼 48px 2분할.
 *
 * 버튼 배치 규칙은 부르는 쪽이 정한다 —
 * - 계정·흐름을 떠나는 모달(탈퇴·가입 이탈·로그아웃)은 **머무르는 선택이 로즈·우측**,
 *   파괴 액션이 중립 외곽선·좌측이다.
 * - 데이터 항목을 지우는 모달(장바구니·배송지 삭제)은 반대로 **모달을 연 목적(삭제)이 로즈·우측**이다.
 *
 * 오른손 엄지가 닿는 우측을 "안전한 쪽"에 두어, 실수로 눌러도 되돌릴 수 없는 일이 생기지 않게 한다.
 */
export default function ModalRenderer() {
  const { currentModal, opacity, scale } = useModalState();
  const { hide } = useModal();

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.45,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!currentModal) {
    return null;
  }

  return (
    <View
      className="absolute bottom-0 left-0 right-0 top-0 z-[9998] items-center justify-center"
      style={{ paddingHorizontal: 32 }}
    >
      <Animated.View className="absolute bottom-0 left-0 right-0 top-0 bg-black" style={backdropStyle} />

      <Animated.View className="w-full overflow-hidden rounded-base bg-white" style={modalStyle}>
        <View style={{ paddingHorizontal: 22, paddingTop: 26, paddingBottom: 20 }}>
          {!!currentModal.icon && (
            <View
              className="items-center justify-center self-center rounded-full"
              style={{
                width: 46,
                height: 46,
                marginBottom: 15,
                backgroundColor: currentModal.iconBackgroundColor ?? "#F4F4F5",
              }}
            >
              {currentModal.icon}
            </View>
          )}

          {!!currentModal.title && (
            <Typography
              style={{ fontSize: 16.5, fontWeight: "700", lineHeight: 24.75, letterSpacing: -0.3 }}
              className="text-center text-ink"
            >
              {currentModal.title}
            </Typography>
          )}

          {currentModal.message !== undefined &&
            (typeof currentModal.message === "string" ? (
              <Typography
                style={{ fontSize: 13, lineHeight: 22.1, marginTop: 9 }}
                className="text-center text-gray45"
              >
                {currentModal.message}
              </Typography>
            ) : (
              <View className="mt-9">{currentModal.message}</View>
            ))}
        </View>

        {!!currentModal.buttons?.length && (
          <View className="flex-row" style={{ gap: 8, paddingHorizontal: 18, paddingBottom: 18 }}>
            {currentModal.buttons.map((button, index) => {
              const isOutline = button.variant === "outline";

              return (
                <TouchableOpacity
                  key={`${button.label}-${index}`}
                  onPress={() => {
                    hide();
                    button.onPress?.();
                  }}
                  activeOpacity={isOutline ? 0.6 : 0.75}
                  className={`h-48 flex-1 flex-row items-center justify-center rounded-base ${
                    isOutline ? "border-[1px] border-borderButton bg-white" : "bg-rose"
                  }`}
                >
                  <Typography
                    style={{ fontSize: 15, fontWeight: "600", lineHeight: 15 }}
                    className={isOutline ? "text-ink76" : "text-white"}
                  >
                    {button.label}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </Animated.View>
    </View>
  );
}
