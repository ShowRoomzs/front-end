/* eslint-disable @typescript-eslint/no-require-imports -- Expo config plugin 은 CommonJS 로 읽힌다 */
const fs = require("fs");
const path = require("path");

const { withAndroidStyles, withDangerousMod } = require("expo/config-plugins");

/**
 * Android 12+ 스플래시 **하단 브랜딩**에 SHOWROOMZ 워드마크를 넣는다.
 *
 * 왜 필요한가 — Android 12 부터는 시스템이 스플래시를 그리고, 가운데 이미지
 * (`windowSplashScreenAnimatedIcon`)를 **원형으로 잘라낸다.** 가로로 15:1 인 워드마크를 거기
 * 넣으면 가운데 몇 글자만 남는다("WROO"). 원에 맞춰 줄이면 글자가 다 보이긴 하지만
 * 높이가 13dp 밖에 안 돼 읽히지 않는다.
 *
 * 자르지 않는 자리는 **하단 브랜딩 슬롯 하나뿐**이다. 그래서 가운데에는 앱 아이콘(로즈 원 안의 S)을
 * 두고, 워드마크는 여기로 내린다 — Android 가 원래 의도한 배치이고 시안 C19 도 같은 판단이다.
 *
 * `expo-splash-screen` 플러그인이 이 속성을 노출하지 않아 직접 붙인다. 이 플러그인은
 * expo-splash-screen **다음에** 실행돼야 한다 — 그쪽이 만든 `Theme.App.SplashScreen` 에 항목을 더한다.
 */

const DENSITIES = ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"];
const DRAWABLE_NAME = "splashscreen_branding";
const STYLE_NAME = "Theme.App.SplashScreen";
/**
 * **`android:` 접두사가 반드시 있어야 한다.**
 *
 * 접두사 없는 이름은 androidx `core-splashscreen`이 선언한 속성을 가리킨다. 그 라이브러리에는
 * `windowSplashScreenBackground` · `windowSplashScreenAnimatedIcon` · `postSplashScreenTheme`만 있고
 * **브랜딩 이미지는 없다** — 이건 API 31 플랫폼 전용이다.
 *
 * 접두사를 빼면 prebuild 는 XML 을 잘 만들지만 **Gradle 이 리소스를 컴파일할 때** AAPT 가
 * "attribute not found"로 죽는다. 실제로 그렇게 안드로이드 빌드가 두 번 실패했다.
 * Expo 도 같은 이유로 `android:windowSplashScreenBehavior`에만 접두사를 붙인다.
 */
const ITEM_NAME = "android:windowSplashScreenBrandingImage";

/** `assets/splash-branding/<density>.png` 를 밀도별 drawable 로 복사한다 */
const withBrandingDrawables = config =>
  withDangerousMod(config, [
    "android",
    async modConfig => {
      const projectRoot = modConfig.modRequest.projectRoot;
      const resRoot = path.join(modConfig.modRequest.platformProjectRoot, "app/src/main/res");

      for (const density of DENSITIES) {
        const source = path.join(projectRoot, "assets/splash-branding", `${density}.png`);

        if (!fs.existsSync(source)) {
          // 이미지는 scripts/build-splash-wordmark.py 가 만든다. 없으면 조용히 넘어가는 대신
          // 여기서 세워야 "브랜딩이 왜 안 보이지"로 시간을 쓰지 않는다
          throw new Error(
            `[withSplashBranding] ${source} 가 없습니다. ` +
              "python scripts/build-splash-wordmark.py 를 먼저 실행하세요."
          );
        }

        const folder = path.join(resRoot, `drawable-${density}`);

        await fs.promises.mkdir(folder, { recursive: true });
        await fs.promises.copyFile(source, path.join(folder, `${DRAWABLE_NAME}.png`));
      }

      return modConfig;
    },
  ]);

/** `Theme.App.SplashScreen` 에 브랜딩 이미지 항목을 더한다 */
const withBrandingStyle = config =>
  withAndroidStyles(config, modConfig => {
    const styles = modConfig.modResults.resources.style ?? [];
    const splashTheme = styles.find(style => style.$?.name === STYLE_NAME);

    if (!splashTheme) {
      throw new Error(
        `[withSplashBranding] ${STYLE_NAME} 을 찾지 못했습니다. ` +
          "expo-splash-screen 플러그인보다 뒤에 두었는지 확인하세요."
      );
    }

    splashTheme.item = (splashTheme.item ?? []).filter(item => item.$?.name !== ITEM_NAME);
    splashTheme.item.push({ $: { name: ITEM_NAME }, _: `@drawable/${DRAWABLE_NAME}` });

    return modConfig;
  });

module.exports = config => withBrandingStyle(withBrandingDrawables(config));
