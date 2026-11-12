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
    /*
      웹은 권한 확인이 없다(브라우저 파일 창이 곧 동의다). 그리고 먼저 await를 지나면 브라우저가 사용자 동작으로
      보지 않아 파일 창을 막는다(특히 모바일 사파리) — 누른 그 호출에서 바로 연다
    */
    const permission =
      Platform.OS === "web"
        ? ({ granted: true, canAskAgain: true } as const)
        : await ImagePicker.getMediaLibraryPermissionsAsync();

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
