import "dotenv/config";
import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const { EXPO_PUBLIC_NAVER_CLIENT_ID, EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY } = process.env;

  return {
    ...config,
    name: "showroomz",
    slug: "showroomz",
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
        LSApplicationQueriesSchemes: [
          "naversearchapp",
          "naversearchthirdlogin",
          "kakaokompassauth",
          "kakaolink",
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
