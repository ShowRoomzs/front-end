import { StyleProp, TextStyle, View } from "react-native";

import Typography from "@/common/components/Typography/Typography";

interface PriceRowProps {
  label: string;
  value: string | number;
  labelClassName?: string;
  valueClassName?: string;
  valueStyle?: StyleProp<TextStyle>;
}

export default function PriceRow(props: PriceRowProps) {
  const {
    label,
    value,
    labelClassName = "text-13 text-gray9 font-normal",
    valueClassName = "text-13 font-normal text-black",
    valueStyle,
  } = props;

  return (
    <View className="flex flex-row items-center justify-between">
      <Typography className={labelClassName}>{label}</Typography>
      <Typography className={valueClassName} style={valueStyle}>
        {value}
      </Typography>
    </View>
  );
}
