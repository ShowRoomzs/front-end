import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import { useCallback } from "react";
import { Alert, Platform } from "react-native";

export function useTakePhoto() {
  const takePhoto = useCallback(async (): Promise<string | null> => {
    const permission = await ImagePicker.getCameraPermissionsAsync();

    if (!permission.granted) {
      if (!permission.canAskAgain) {
        if (Platform.OS === "ios") {
          Alert.alert("카메라 권한 필요", "사진을 촬영하려면 설정에서 카메라 접근 권한을 허용해주세요.", [
            { text: "취소", style: "cancel" },
            {
              text: "설정으로 이동",
              onPress: () => Linking.openSettings(),
            },
          ]);
          return null;
        }
      } else {
        Alert.alert("카메라 권한 필요", "사진을 촬영하려면 앱 권한에서 카메라 접근을 허용해주세요.");
        return null;
      }

      const request = await ImagePicker.requestCameraPermissionsAsync();

      if (!request.granted) {
        return null;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0].uri;
  }, []);

  return { takePhoto };
}
