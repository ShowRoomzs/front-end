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

  /*
    키가 없으면 카카오 플러그인이 예외를 던지는데, EAS 빌드에서는 그게 "Read app config 단계에서
    Unknown error"로만 보여 원인을 찾기까지 로그를 파야 한다. 여기서 먼저 걸러 무엇이 왜 없는지 남긴다.

    로컬에서는 `.env`가 채워 주므로 이 분기를 만날 일이 거의 없다. 대부분 EAS 빌드에서 나는데,
    EAS는 **프로필 이름으로 환경을 고른다** — `extends`로는 따라오지 않는다.
    프로필에 `"environment": "production"`을 적어야 그 환경의 변수가 실린다.
  */
  if (!EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY) {
    throw new Error(
      "EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY 가 없습니다. " +
        "EAS 빌드라면 eas.json 의 해당 프로필에 \"environment\" 를 지정했는지 확인하세요."
    );
  }


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
    ios: {
      icon: "./assets/appicon-ios.png",
      supportsTablet: true,
      bundleIdentifier: "com.showroomz.app",
      infoPlist: {
        /*
          업로드할 때마다 App Store Connect가 "암호화를 쓰나요"를 묻고, 답하기 전까지 빌드가
          '규정 준수 정보 누락'으로 멈춰 테스터에게 나가지 않는다. 여기서 미리 답해 두면 그 단계가 없어진다.

          이 앱은 HTTPS(TLS)만 쓴다 — 애플이 면제로 보는 표준 암호화라 false가 맞다.
          자체 암호화 알고리즘을 넣거나 통신을 직접 암호화하게 되면 이 값을 다시 판단해야 한다.
        */
        ITSAppUsesNonExemptEncryption: false,
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
      /*
        런치 스크린 (시안 C19) — 흰 배경 + 로즈 워드마크, iOS·Android 동일한 인상.

        예전에는 잉크 배경(#0D0C11)에 흰 워드마크였다. 다음 프레임이 흰 홈이라 앱을 열 때마다
        섬광이 생겼고, 하루에 여러 번 여는 커머스에서는 그 깜빡임이 첫인상보다 오래 남는다.
        흰 배경이면 스플래시에서 홈으로 이어 붙어 앱이 빠르게 느껴진다.

        스피너·진행바·버전 표기는 넣지 않는다 — 느리게 느껴지고, 실제로 기다리게 만들면
        애플 심사에서 지적된다. iOS 런치 스크린은 스토리보드라 애니메이션도 넣을 수 없다.
      */
      [
        "expo-splash-screen",
        {
          backgroundColor: "#FFFFFF",
          // 아래쪽 투명 여백이 들어간 워드마크다. 플러그인은 이미지를 정중앙에만 놓을 수 있어,
          // 시안의 "시각 중심에서 살짝 위"를 이미지 자체로 만든다 (scripts/build-splash-wordmark.py)
          image: "./assets/splash-wordmark.png",
          imageWidth: 262, // 390 화면의 67% — 시안 값
          resizeMode: "contain",
          android: {
            /*
              Android 12+ 는 시스템이 스플래시를 그리고 가운데 이미지를 **원형으로 마스킹**한다.
              가로로 긴 워드마크를 그대로 주면 양끝이 잘려 나가므로 앱 아이콘을 쓴다.
              아이콘 전경에 이미 로즈 배경이 들어 있어 원형으로 잘려도 여백이 생기지 않는다.

              워드마크는 원래 하단 브랜딩 자리(windowSplashScreenBrandingImage)에 놓여야 하지만
              이 플러그인이 그 속성을 노출하지 않는다. 배경과 로즈 마크는 같으므로 인상은 유지된다.
            */
            image: "./assets/appicon-android.png",
            /*
              Expo 는 아이콘을 288dp 캔버스 가운데에 얹고, Android 12+ 는 그중 **2/3(192dp)만
              원형으로** 남긴다. 288 로 꽉 채워야 그 마스크가 아이콘 설계와 맞는다 —
              이 아이콘은 심볼이 캔버스의 34%라 2/3 안에 넉넉히 들어가고 모서리까지 로즈다.
              이보다 작게 주면 원 가장자리에 흰 틈이 생긴다.
            */
            imageWidth: 288,
            backgroundColor: "#FFFFFF",
            resizeMode: "contain",
          },
        },
      ],
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
