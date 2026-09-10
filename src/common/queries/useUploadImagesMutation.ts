import { useMutation } from "@tanstack/react-query";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

import { apiInstance } from "@/common/lib/apiInstance";
import { IS_DEMO } from "@/demo/config";

interface UploadImagesParams {
  localUris: Array<string>;
  type: "PROFILE" | "REVIEW" | "INQUIRY";
}

export function useUploadImagesMutation() {
  return useMutation({
    mutationFn: async ({ localUris, type }: UploadImagesParams) => {
      // 데모에서는 서버가 없다 — 고른 사진을 그대로 화면에 되돌려 업로드된 것처럼 보인다
      if (IS_DEMO) {
        return localUris;
      }
      const uploadPromises = localUris.map(async localUri => {
        if (localUri.startsWith("http")) {
          return localUri;
        }

        const manipulated = await manipulateAsync(localUri, [], {
          compress: 0.8,
          format: SaveFormat.JPEG,
        });

        const formData = new FormData();
        const filename = manipulated.uri.split("/").pop() || "image.jpg";

        // React Native FormData requires { uri, name, type } object instead of Blob
        formData.append("file", {
          uri: manipulated.uri,
          name: filename.replace(/\.[^.]+$/, ".jpg"),
          type: "image/jpeg",
        } as unknown as Blob);

        const response = await apiInstance.post<{ imageUrl: string }>(`/user/images?type=${type}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data.imageUrl;
      });

      return Promise.all(uploadPromises);
    },
  });
}
