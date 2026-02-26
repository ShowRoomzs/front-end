import { MenuAction, NativeActionEvent } from "@react-native-menu/menu";
import { useCallback, useMemo } from "react";
import { ImageSourcePropType, Platform } from "react-native";

import ActionMenu from "@/common/components/ActionMenu/ActionMenu";
import Button from "@/common/components/Button/Button";

interface ProfileImageSelectButtonProps {
  onSelect: (image: ImageSourcePropType | undefined) => void;
}
export default function ProfileImageSelectButton(props: ProfileImageSelectButtonProps) {
  const { onSelect: _onSelect } = props;

  const profileImageActions = useMemo(
    (): Array<MenuAction> => [
      {
        id: "gallery",
        title: "사진 보관함",
        image: Platform.select({ ios: "photo", android: "ic_menu_gallery" }),
        imageColor: "#000000",
        preferredElementSize: "small",
      },
      {
        id: "camera",
        title: "사진 찍기",
        image: Platform.select({ ios: "camera", android: "ic_menu_camera" }),
        imageColor: "#000000",
        preferredElementSize: "small",
      },
      {
        id: "file",
        title: "파일 선택",
        image: Platform.select({ ios: "folder", android: "ic_menu_agenda" }),
        imageColor: "#000000",
        preferredElementSize: "small",
      },
    ],
    []
  );

  const handlePressProfileImageAction = useCallback(({ nativeEvent }: NativeActionEvent) => {
    console.log(nativeEvent.event);
  }, []);

  return (
    <ActionMenu
      wrapperClassName="flex-1"
      style={{ height: 36 }}
      actions={profileImageActions}
      onPressAction={handlePressProfileImageAction}
    >
      <Button size="md" variant="secondary-black">
        프로필 이미지 변경
      </Button>
    </ActionMenu>
  );
}
