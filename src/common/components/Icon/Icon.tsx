import { SvgProps } from "react-native-svg";

import { Asset, IconVariant } from "@/common/utils/assets";

interface IconProps extends SvgProps {
  icon: Asset;
  variant?: IconVariant;
}

export default function Icon(props: IconProps) {
  const { icon, variant = "default", ...svgProps } = props;

  const IconComponent = icon[variant] || icon["default"];

  return <IconComponent {...svgProps} />;
}
