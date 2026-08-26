import "dotenv/config";
import { ExpoConfig, ConfigContext } from "expo/config";

/**
 * src/features/auth/constants/naver.ts 의 NAVER_URL_SCHEME 과 반드시 같은 값이어야 한다.
 * app.config.ts는 src의 .ts 파일을 require할 수 없어(expo config 로더가 자기 파일만
 * 트랜스파일한다) import로 묶지 못하고 값을 옮겨 적는다. 고칠 땐 두 곳을 함께 고칠 것.
 */
const NAVER_URL_SCHEME = "showroomznaver";

export default ({ config }: ConfigContext): ExpoConfig => {
  const { EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY, EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID } = process.env;

  /**
   * 구글 iOS 리다이렉트 스킴 = 클라이언트 ID를 뒤집은 값.
   * "495703171100-xxx.apps.googleusercontent.com" → "com.googleusercontent.apps.495703171100-xxx"
   *
   * 카카오·네이버는 각자 SDK가 스킴을 알아서 쓰지만 구글(expo-auth-session)은 이 값이
   * Info.plist에 없으면 로그인 창은 정상적으로 뜨고 계정 선택까지 되는데 앱으로 돌아오지 못한다 —
   * 에러가 아니라 "아무 일도 일어나지 않은 것"처럼 보여서 원인을 찾기 어렵다.
   */
  const googleIosUrlScheme = EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
    ? `com.googleusercontent.apps.${EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID.replace(
        ".apps.googleusercontent.com",
        ""
      )}`
    : undefined;

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
        // naver scheme은 naver-login 플러그인이 넣으므로 여기 적지 않는다(중복 방지).
        // kakao scheme은 남겨 둔다 — kakao 플러그인도 넣지만 이미 있으면 건너뛰므로 중복되지 않고,
        // 플러그인 설정이 흔들려도 scheme만은 살아 있게 하는 보험이다.
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [`kakao${EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY}`],
          },
          // 값이 없으면 항목 자체를 넣지 않는다 — 빈 스킴이 박히면 iOS가 그 URL 타입을 무시한다
          ...(googleIosUrlScheme ? [{ CFBundleURLSchemes: [googleIosUrlScheme] }] : []),
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
          // ios 키가 없으면 플러그인이 `if (ios)`에서 걸러 **withIos를 아예 실행하지 않는다**.
          // 그러면 AppDelegate의 application(_:open:options:)에 KakaoSDK 핸들러가 주입되지 않아,
          // 카카오톡에서 인증을 마치고 kakao{key}://oauth 로 돌아와도 SDK가 그 URL을 받지 못한다 —
          // 로그인 Promise가 영영 풀리지 않고 화면은 "갔다 왔는데 아무 일도 없음"이 된다.
          ios: {
            handleKakaoOpenUrl: true,
          },
        },
      ],
    ],
  };
};
