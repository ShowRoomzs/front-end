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
    /*
      두 번째 스킴은 구글 로그인 전용이다.
      expo-auth-session의 Google provider는 리다이렉트를 `${Application.applicationId}:/oauthredirect`로
      만든다(providers/Google.js) — applicationId는 안드로이드 패키지명이자 iOS 번들 ID라
      양쪽 다 `com.showroomz.app`이다. 이 스킴이 등록돼 있지 않으면 구글이 인증을 마치고
      되돌려 보낸 주소를 받을 앱이 없어, 계정을 고른 뒤 브라우저가 구글 화면에 그대로 멈춘다.
    */
    scheme: ["showroomz", "com.showroomz.app"],
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
          // 구글 로그인 리다이렉트(`com.showroomz.app:/oauthredirect`)를 받는 스킴.
          // 위 scheme 배열에도 넣었지만 introspect 결과 iOS Info.plist에는 반영되지 않아 여기 직접 적는다 —
          // 없으면 계정을 고른 뒤 브라우저가 구글 화면에 멈추고 앱으로 돌아오지 못한다.
          {
            CFBundleURLSchemes: ["com.showroomz.app"],
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
