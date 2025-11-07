import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";

export default function BottomTabs(props: BottomTabBarProps) {
  console.log(props);

  return (
    <View>
      <Text>BottomTab</Text>
    </View>
  );
}
