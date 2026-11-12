import { useMutation } from "@tanstack/react-query";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { Platform } from "react-native";

import { apiInstance } from "@/common/lib/apiInstance";

interface UploadImagesParams {
  localUris: Array<string>;
  /** back-end `ImageType.USER_ALLOWED_TYPES` — CLAIM은 반품·교환 사진(브랜드 검수 화면과 서로 본다) */
  type: "PROFILE" | "REVIEW" | "INQUIRY" | "CLAIM";
}

export function useUploadImagesMutation() {
  return useMutation({
    mutationFn: async ({ localUris, type }: UploadImagesParams) => {
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

        if (Platform.OS === "web") {
          /*
            웹 FormData는 { uri, name, type } 객체를 파일로 알아보지 못하고 "[object Object]" 글자로 보낸다.
            주소(blob: · data:)에서 실제 파일 내용을 꺼내 Blob으로 붙인다. Content-Type은 브라우저가
            경계(boundary)까지 붙여야 하므로 직접 정하지 않는다
          */
          const blob = await (await fetch(manipulated.uri)).blob();

          formData.append("file", blob, "image.jpg");
          const response = await apiInstance.post<{ imageUrl: string }>(
            `/user/images?type=${type}`,
            formData
          );

          return response.data.imageUrl;
        }

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
