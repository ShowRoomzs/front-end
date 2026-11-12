import { ReactNode, useCallback } from "react";
import { TouchableOpacity } from "react-native";

import { useSelectImage } from "@/common/hooks/useSelectImage";

interface ProfileImageSelectButtonProps {
  onSelect: (imageUrl: string) => void;
  children: ReactNode;
}

/**
 * 프로필 사진 고르기 (웹) — 앱의 [사진 보관함 · 사진 찍기 · 파일 선택] 메뉴는 네이티브 메뉴(@react-native-menu)라
 * 웹에서 열리지 않는다. 웹은 메뉴 없이 **바로 파일 선택 창**을 연다 — 모바일 브라우저는 그 창에서
 * 사진 보관함 · 카메라 · 파일을 스스로 고르게 해 주므로 같은 세 갈래가 그대로 남는다.
 *
 * 앱은 `file://`를 떼고 넘기지만 웹의 주소는 blob: · data: 라 그대로 넘긴다(업로드가 받아 처리한다).
 */
export default function ProfileImageSelectButton(props: ProfileImageSelectButtonProps) {
  const { onSelect, children } = props;
  const { selectImage } = useSelectImage({ allowsMultipleSelection: false });

  const handlePress = useCallback(async () => {
    try {
      const [uri] = await selectImage();

      if (uri) {
        onSelect(uri);
      }
    } catch (error) {
      console.error(error);
    }
  }, [onSelect, selectImage]);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.75} accessibilityLabel="프로필 사진 변경">
      {children}
    </TouchableOpacity>
  );
}
