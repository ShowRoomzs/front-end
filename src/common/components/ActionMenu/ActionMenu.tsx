import { MenuView, MenuAction, NativeActionEvent, MenuComponentProps } from "@react-native-menu/menu";
import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

interface ActionMenuProps extends MenuComponentProps {
  actions: MenuAction[];
  onPressAction: ({ nativeEvent }: NativeActionEvent) => void;
  children: ReactNode;
  wrapperClassName?: string;
  style?: StyleProp<ViewStyle>;
}

export default function ActionMenu(props: ActionMenuProps) {
  const { actions, onPressAction, children, wrapperClassName, style, ...menuProps } = props;

  return (
    <View className={wrapperClassName} style={style}>
      <MenuView actions={actions} onPressAction={onPressAction} shouldOpenOnLongPress={false} {...menuProps}>
        {children}
      </MenuView>
    </View>
  );
}
