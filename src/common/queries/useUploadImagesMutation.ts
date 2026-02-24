import { useMutation } from "@tanstack/react-query";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

import { apiInstance } from "@/common/lib/apiInstance";

interface UploadImagesParams {
  localUris: Array<string>;
  type: "PROFILE" | "REVIEW";
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

        formData.append("file", {
          uri: manipulated.uri,
          name: filename.replace(/\.[^.]+$/, ".jpg"),
          type: "image/jpeg",
        } as any);

        const response = await apiInstance.post<{ imageUrl: string }>(`/user/images?type=${type}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data.imageUrl;
      });

      return Promise.all(uploadPromises);
    },
  });
}
