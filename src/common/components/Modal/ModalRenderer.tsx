import { TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import Button from "@/common/components/Button/Button";
import Icon from "@/common/components/Icon/Icon";
import Typography from "@/common/components/Typography/Typography";
import { useModal, useModalState } from "@/common/providers/ModalProvider/context";
import { COMMON_ASSETS } from "@/common/utils/assets";
import { cn } from "@/common/utils/cn";

export default function ModalRenderer() {
  const { currentModal, opacity, scale } = useModalState();
  const { hide } = useModal();

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!currentModal) {
    return null;
  }

  const handleClose = () => {
    hide();
    currentModal.onClose?.();
  };

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 z-[9998] items-center justify-center">
      <Animated.View className="absolute top-0 left-0 right-0 bottom-0 bg-black" style={backdropStyle} />

      <Animated.View className="w-[335px] rounded-[10px] bg-white pt-20" style={modalStyle}>
        {currentModal.closable && (
          <TouchableOpacity className="absolute right-15 top-15 z-[1]" onPress={handleClose}>
            <Icon icon={COMMON_ASSETS.closeBlack} width={20} height={20} />
          </TouchableOpacity>
        )}

        {currentModal.title && (
          <View className="px-20 pb-7">
            <Typography
              className={cn(
                "text-15 font-semibold text-black",
                currentModal?.centered ? "text-center" : "text-left"
              )}
            >
              {currentModal.title}
            </Typography>
          </View>
        )}

        {currentModal.message !== undefined && (
          <View className="px-20 pb-5">
            {typeof currentModal.message === "string" ? (
              <Typography
                className={cn("text-14 text-gray11", currentModal?.centered ? "text-center" : "text-left")}
              >
                {currentModal.message}
              </Typography>
            ) : (
              currentModal.message
            )}
          </View>
        )}

        {currentModal.buttons && currentModal.buttons.length > 0 && (
          <View className="flex-row gap-6 px-20 pb-20 pt-10">
            {currentModal.buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant === "outline" ? "outline" : "primary"}
                size="lg"
                className="flex-1"
                onPress={button.onPress}
              >
                {button.label}
              </Button>
            ))}
          </View>
        )}
      </Animated.View>
    </View>
  );
}
