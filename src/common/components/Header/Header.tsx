import { ReactNode } from "react";
import { View } from "react-native";

interface HeaderProps {
  renderLeft?: ReactNode;
  renderRight?: ReactNode;
}

export default function Header(props: HeaderProps) {
  const { renderLeft, renderRight } = props;

  return (
    <View className="flex flex-row justify-between items-center py-5">
      {renderLeft && renderLeft}
      {renderRight && renderRight}
    </View>
  );
}
