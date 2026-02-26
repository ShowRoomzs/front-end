import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";

interface UseSelectImageOptions {
  allowsMultipleSelection?: boolean;
}
interface UseSelectImageProps extends UseSelectImageOptions {
  allowsMultipleSelection: boolean;
}

export function useSelectImage(props: UseSelectImageProps) {
  const { allowsMultipleSelection } = props;
  const selectImage = useCallback(async (): Promise<string[]> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("사진 접근 권한이 필요합니다.");
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      return result.assets.map(asset => asset.uri);
    }

    return [];
  }, [allowsMultipleSelection]);

  return { selectImage };
}
