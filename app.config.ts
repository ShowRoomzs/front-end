import "dotenv/config";
import { ExpoConfig, ConfigContext } from "expo/config";

/**
 * src/features/auth/constants/naver.ts 의 NAVER_URL_SCHEME 과 반드시 같은 값이어야 한다.
 * app.config.ts는 src의 .ts 파일을 require할 수 없어(expo config 로더가 자기 파일만
 * 트랜스파일한다) import로 묶지 못하고 값을 옮겨 적는다. 고칠 땐 두 곳을 함께 고칠 것.
 */
const NAVER_URL_SCHEME = "showroomznaver";

export default ({ config }: ConfigContext): ExpoConfig => {
  const { EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY } = process.env;

  return {
    ...config,
    name: "showroomz",
    slug: "showroomz",
    scheme: "showroomz",
    version: "1.0.0",
    orientation: "portrait",
    // 아이콘 원본은 assets/appicon-*.svg. PNG는 거기서 1024×1024로 구운 결과물이다
    icon: "./assets/appicon-ios.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#0D0C11",
    },
    ios: {
      icon: "./assets/appicon-ios.png",
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
        // naver / kakao scheme은 각 config plugin이 직접 넣는다. 여기에 또 적으면
        // Info.plist에 같은 scheme이 두 번 들어간다.
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [`kakao${EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY}`],
          },
        ],
      },
    },
    android: {
      // 안드로이드용은 마스킹에 잘리지 않도록 심볼을 한 단계 작게 그린 별도 원본이다.
      // 전경에 로즈 배경이 이미 들어 있어 어떤 마스크(원·스퀘어클)로 잘려도 여백이 생기지 않는다 —
      // backgroundColor는 그래도 같은 값으로 둔다(전경이 못 덮는 가장자리 대비).
      icon: "./assets/appicon-android.png",
      adaptiveIcon: {
        foregroundImage: "./assets/appicon-android.png",
        backgroundColor: "#F2456E",
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
          urlScheme: NAVER_URL_SCHEME,
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
