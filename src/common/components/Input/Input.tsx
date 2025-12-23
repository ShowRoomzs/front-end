import { forwardRef, ReactNode, useEffect, useState } from "react";
import { TextInput, TextInputProps, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import Typography from "@/common/components/Typography/Typography";
import { cn } from "@/common/utils/cn";

type InputSize = "small" | "medium";
type InputStatus = "default" | "error" | "success";

export interface InputProps extends Omit<TextInputProps, "className"> {
  wrapperClassName?: string;
  inputClassName?: string;
  renderPreFix?: ReactNode;
  size?: InputSize;
  helperText?: string;
  status?: InputStatus;
}

const Input = forwardRef<TextInput, InputProps>((props, ref) => {
  const {
    size = "medium",
    renderPreFix,
    wrapperClassName,
    helperText,
    status = "default",
    inputClassName,
    ...inputProps
  } = props;

  const [displayHelperText, setDisplayHelperText] = useState(helperText);
  const [textHeight, setTextHeight] = useState(0);

  const opacity = useSharedValue(helperText ? 1 : 0);
  const marginTop = useSharedValue(helperText ? 10 : 0);
  const height = useSharedValue(helperText ? -1 : 0);

  useEffect(() => {
    if (helperText) {
      // 텍스트가 있으면 바로 보여주기 시작
      setDisplayHelperText(helperText);
      opacity.value = withTiming(1, { duration: 200 });
      marginTop.value = withTiming(10, { duration: 200 });
      height.value = withTiming(textHeight || -1, { duration: 200 });
    } else if (displayHelperText) {
      // 텍스트가 없어지면 페이드아웃
      opacity.value = withTiming(0, { duration: 150 });
      marginTop.value = withTiming(0, { duration: 150 });
      height.value = withTiming(0, { duration: 150 });
    }
  }, [helperText, opacity, marginTop, height, textHeight, displayHelperText]);

  const handleLayout = (event: { nativeEvent: { layout: { height: number } } }) => {
    const layoutHeight = event.nativeEvent.layout.height;

    if (layoutHeight > 0 && textHeight === 0) {
      setTextHeight(layoutHeight);
      if (helperText) {
        height.value = layoutHeight;
      }
    }
  };

  const animatedHelperStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      marginTop: marginTop.value,
      height: height.value === -1 ? undefined : height.value,
      overflow: "hidden",
    };
  });

  const getDefaultClassName = () => {
    return "flex flex-row items-center w-full";
  };

  const getClassNameBySize = () => {
    switch (size) {
      case "small":
        return "h-37 px-10 text-12";
      case "medium":
        return "h-47 px-15 text-14";
    }
  };

  const getHelperTextClassName = () => {
    let className = "text-[12px] font-[400]";
    switch (status) {
      case "error":
        className += " text-negativeColor";
        break;
      case "success":
        // TODO
        break;
      case "default":
        className += " text-gray8";
        break;
    }
    return className;
  };

  return (
    <View>
      <View className={cn(getDefaultClassName(), getClassNameBySize(), wrapperClassName)}>
        {renderPreFix && <View className="mr-10">{renderPreFix}</View>}
        <TextInput ref={ref} className={cn("flex-1", inputClassName)} {...inputProps} />
      </View>
      {(helperText || displayHelperText) && (
        <Animated.View style={animatedHelperStyle}>
          <View onLayout={handleLayout}>
            <Typography className={cn(getHelperTextClassName())}>{displayHelperText}</Typography>
          </View>
        </Animated.View>
      )}
    </View>
  );
});

Input.displayName = "Input";

export default Input;
