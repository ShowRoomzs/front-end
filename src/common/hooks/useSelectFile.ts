import * as DocumentPicker from "expo-document-picker";
import { useCallback } from "react";

type DocumentPickerType =
  | "*/*"
  | "image/*"
  | "audio/*"
  | "video/*"
  | "text/plain"
  | "text/*"
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  | "application/vnd.ms-powerpoint"
  | "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  | "application/zip"
  | "application/json";

interface UseSelectFileProps {
  type?: DocumentPickerType;
}
export function useSelectFile(props: UseSelectFileProps) {
  const { type = "*/*" } = props;
  const selectFile = useCallback(async (): Promise<{
    uri: string;
    name: string;
    size?: number;
    mimeType?: string;
  } | null> => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
      copyToCacheDirectory: true,
      type,
    });

    if (result.canceled) {
      return null;
    }

    const file = result.assets[0];

    return {
      uri: file.uri,
      name: file.name,
      size: file.size,
      mimeType: file.mimeType,
    };
  }, [type]);

  return { selectFile };
}
