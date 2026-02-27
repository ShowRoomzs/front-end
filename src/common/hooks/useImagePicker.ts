import { useState, useCallback } from "react";

import { useSelectImage } from "./useSelectImage";

interface UseImagePickerProps {
  allowsMultipleSelection?: boolean;
  maxCount?: number;
}

export function useImagePicker(props: UseImagePickerProps) {
  const { allowsMultipleSelection = true, maxCount = 1 } = props;

  const [imageUrls, setImageUrls] = useState<Array<string>>([]);
  const { selectImage } = useSelectImage({ allowsMultipleSelection });

  const handleAddImage = useCallback(async () => {
    const newUris = await selectImage();

    if (newUris.length === 0) {
      return;
    }

    setImageUrls(prev => {
      // 단일 선택 모드일 경우 기존 사진을 덮어씌움
      if (!allowsMultipleSelection) {
        return [newUris[0]];
      }
      // 다중 선택 모드일 경우 기존 사진에 이어 붙이고 maxCount로 자름
      return [...prev, ...newUris].slice(0, maxCount);
    });
  }, [selectImage, allowsMultipleSelection, maxCount]);

  const handleRemoveImage = useCallback((indexToRemove: number) => {
    setImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  return { imageUrls, handleAddImage, handleRemoveImage, setImageUrls };
}
