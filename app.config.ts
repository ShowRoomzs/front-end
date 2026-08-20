import "dotenv/config";
import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const { EXPO_PUBLIC_NAVER_CLIENT_ID, EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY } = process.env;

  return {
    ...config,
    name: "showroomz",
    slug: "showroomz",
    scheme: "showroomz",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#0D0C11",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.showroomz.app",
      infoPlist: {
        NSPhotoLibraryUsageDescription: "이미지 업로드를 위해 사진 보관함 접근 권한이 필요합니다.",
        NSCameraUsageDescription: "사진 촬영을 위해 카메라 접근이 필요합니다.",
        LSApplicationQueriesSchemes: [
          "naversearchapp",
          "naversearchthirdlogin",
          "kakaokompassauth",
          "kakaolink",
          "instagram",
          "youtube",
          "tiktok",
          "twitter",
        ],
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [`naver${EXPO_PUBLIC_NAVER_CLIENT_ID}`],
          },
          {
            CFBundleURLSchemes: [`kakao${EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY}`],
          },
        ],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.showroomz.app",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "e809e38e-16f5-44c4-9609-17d230a58e6e",
      },
    },
    owner: "showroomz",
    plugins: [
      "expo-font",
      [
        "@react-native-seoul/naver-login",
        {
          urlScheme: `naver${EXPO_PUBLIC_NAVER_CLIENT_ID}`,
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            extraMavenRepos: ["https://devrepo.kakao.com/nexus/content/groups/public/"],
          },
          ios: {
            // RN 0.81의 프리빌트 ReactNativeDependencies.xcframework를 쓰지 않는다.
            // 그 안의 glog/boost/folly 번들 Info.plist에 CFBundleSupportedPlatforms=[XRSimulator]가
            // 박혀 있어 App Store Connect 업로드가 ITMS-90542로 거부된다(업스트림 버그).
            // 소스 빌드로 돌리면 해당 프레임워크가 앱에 포함되지 않아 문제가 사라진다.
            // 대가는 iOS 빌드 시간 증가다.
            buildReactNativeFromSource: true,
          },
        },
      ],
      [
        "@react-native-kakao/core",
        {
          nativeAppKey: EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY,
          android: {
            authCodeHandlerActivity: true,
          },
        },
      ],
    ],
  };
};
