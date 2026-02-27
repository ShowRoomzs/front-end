import { MenuAction, NativeActionEvent } from "@react-native-menu/menu";
import { useCallback, useMemo } from "react";
import { Platform } from "react-native";

import ActionMenu from "@/common/components/ActionMenu/ActionMenu";
import Button from "@/common/components/Button/Button";
import { useSelectFile } from "@/common/hooks/useSelectFile";
import { useSelectImage } from "@/common/hooks/useSelectImage";
import { useTakePhoto } from "@/common/hooks/useTakePhoto";

interface ProfileImageSelectButtonProps {
  onSelect: (imageUrl: string) => void;
}
export default function ProfileImageSelectButton(props: ProfileImageSelectButtonProps) {
  const { onSelect } = props;
  const { selectImage } = useSelectImage({
    allowsMultipleSelection: false,
  });
  const { takePhoto } = useTakePhoto();
  const { selectFile } = useSelectFile({ type: "image/*" });

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

  const handlePressGallery = useCallback(async () => {
    try {
      const imageUrl = await selectImage();

      if (!imageUrl.length) {
        return;
      }
      const localUri = imageUrl[0].split("file://")[1];
      const localUris = [localUri];

      onSelect(localUris[0]);
    } catch (error) {
      console.error(error);
    }
  }, [onSelect, selectImage]);

  const handlePressCamera = useCallback(async () => {
    try {
      const imageUrl = await takePhoto();

      if (!imageUrl) {
        return;
      }
      const localUri = imageUrl.split("file://")[1];

      // TODO : 실기기 테스트 필요
      onSelect(localUri);
    } catch (error) {
      console.error(error);
    }
  }, [onSelect, takePhoto]);

  const handlePressFile = useCallback(async () => {
    try {
      const file = await selectFile();

      if (!file) {
        return;
      }
      const localUrl = file.uri.split("file://")[1];

      onSelect(localUrl);
    } catch (error) {
      console.error(error);
    }
  }, [onSelect, selectFile]);

  const handlePressProfileImageAction = useCallback(
    async ({ nativeEvent }: NativeActionEvent) => {
      switch (nativeEvent.event) {
        case "gallery":
          handlePressGallery();
          break;
        case "camera":
          handlePressCamera();
          break;
        case "file":
          handlePressFile();
          break;
      }
    },
    [handlePressCamera, handlePressFile, handlePressGallery]
  );

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
