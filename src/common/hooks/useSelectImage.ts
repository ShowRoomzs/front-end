import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import { useCallback } from "react";
import { Alert, Platform } from "react-native";

interface UseSelectImageProps {
  allowsMultipleSelection: boolean;
}

export function useSelectImage(props: UseSelectImageProps) {
  const { allowsMultipleSelection } = props;
  const selectImage = useCallback(async (): Promise<string[]> => {
    const permission = await ImagePicker.getMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      if (!permission.canAskAgain) {
        if (Platform.OS === "ios") {
          Alert.alert("권한 필요", "사진을 선택하려면 설정에서 사진 접근 권한을 허용해주세요.", [
            { text: "취소", style: "cancel" },
            {
              text: "설정으로 이동",
              onPress: () => Linking.openSettings(),
            },
          ]);
        } else {
          Alert.alert("권한 필요", "사진을 선택하려면 앱 권한에서 사진 접근을 허용해주세요.");
        }
        return [];
      }

      const request = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!request.granted) {
        return [];
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection,
      quality: 0.8,
    });

    if (result.canceled) {
      return [];
    }

    return result.assets.map(asset => asset.uri);
  }, [allowsMultipleSelection]);

  return { selectImage };
}
