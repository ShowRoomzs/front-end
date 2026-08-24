import { MenuAction, NativeActionEvent } from "@react-native-menu/menu";
import { ReactNode, useCallback, useMemo } from "react";
import { Platform } from "react-native";

import ActionMenu from "@/common/components/ActionMenu/ActionMenu";
import { useSelectFile } from "@/common/hooks/useSelectFile";
import { useSelectImage } from "@/common/hooks/useSelectImage";
import { useTakePhoto } from "@/common/hooks/useTakePhoto";

interface ProfileImageSelectButtonProps {
  onSelect: (imageUrl: string) => void;
  /**
   * 탭 대상. C15 설정은 별도 버튼 없이 **아바타 자체를 탭**해 사진을 바꾼다 —
   * 프로필 사진을 바꾸는 자리는 사진이지 그 아래 버튼이 아니다.
   */
  children: ReactNode;
}
export default function ProfileImageSelectButton(props: ProfileImageSelectButtonProps) {
  const { onSelect, children } = props;
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
    <ActionMenu actions={profileImageActions} onPressAction={handlePressProfileImageAction}>
      {children}
    </ActionMenu>
  );
}
