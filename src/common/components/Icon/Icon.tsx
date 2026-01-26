import { forwardRef } from "react";
import { View } from "react-native";
import { SvgProps } from "react-native-svg";

import { Asset, IconVariant } from "@/common/utils/assets";

interface IconProps extends SvgProps {
  icon: Asset;
  variant?: IconVariant;
}

const Icon = forwardRef<View, IconProps>((props, ref) => {
  const { icon, variant = "default", ...svgProps } = props;

  const IconComponent = icon[variant] || icon["default"];

  return (
    <View ref={ref}>
      <IconComponent {...svgProps} />
    </View>
  );
});

Icon.displayName = "Icon";

export default Icon;
