import * as ImagePicker from "expo-image-picker";
import { useState, useCallback } from "react";

interface UseImagePickerOptions {
  maxCount?: number;
  allowsMultipleSelection?: boolean;
}

export const useImagePicker = ({
  maxCount = 10,
  allowsMultipleSelection = true,
}: UseImagePickerOptions = {}) => {
  const [imageUrls, setImageUrls] = useState<Array<string>>([]);

  const handleAddImage = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("사진 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newUris = result.assets.map(asset => asset.uri);

      setImageUrls(prev => {
        // 단일 선택 모드일 경우 기존 사진을 덮어씌움
        if (!allowsMultipleSelection) {
          return [newUris[0]];
        }
        // 다중 선택 모드일 경우 기존 사진에 이어 붙이고 maxCount로 자름
        return [...prev, ...newUris].slice(0, maxCount);
      });
    }
  }, [maxCount, allowsMultipleSelection]);

  const handleRemoveImage = useCallback((indexToRemove: number) => {
    setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  return { imageUrls, handleAddImage, handleRemoveImage, setImageUrls };
};
