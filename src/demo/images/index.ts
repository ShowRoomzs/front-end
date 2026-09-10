/* eslint-disable @typescript-eslint/no-require-imports -- React Native 자산은 require()로만 번들에 실린다. import로 바꾸면 Metro가 파일을 찾지 못한다 */
import { Image, ImageSourcePropType } from "react-native";

/**
 * 데모 이미지 — 번들에 담긴 파일을 `<Image source={{ uri }}>`가 쓸 수 있는 문자열로 바꾼다.
 *
 * 앱의 모든 이미지 자리가 URL 문자열을 받도록 만들어져 있어(서버가 CDN 주소를 주므로),
 * 번들 자산도 같은 통로로 흘려보내려면 `resolveAssetSource`로 한 번 풀어야 한다.
 * 이 파일 하나만 통과하면 화면 컴포넌트는 데모인지 실서비스인지 알 필요가 없다.
 *
 * ⚠️ 상품 · 게시물 이미지는 `scripts/build-demo-photos.py`가 `photo-drop/posts`의 원본에서
 * 구워 낸다. 파일 목록을 바꿀 때는 그 스크립트의 `POSTS` · `PRODUCTS`와 짝을 맞춰야 한다.
 * 쇼룸 · 사용자 프로필만 아직 `scripts/generate-demo-images.py`가 만든 생성 이미지다.
 */
function uri(source: ImageSourcePropType): string {
  return Image.resolveAssetSource(source)?.uri ?? "";
}

export interface DemoProductImages {
  main: string;
  sub: string;
  detail: string;
}

export const DEMO_SHOWROOM_IMAGE = {
  jenny: uri(require("./showrooms/jenny.jpg")),
  haru: uri(require("./showrooms/haru.jpg")),
  mia: uri(require("./showrooms/mia.jpg")),
  yoon: uri(require("./showrooms/yoon.jpg")),
  soyeon: uri(require("./showrooms/soyeon.jpg")),
  daeun: uri(require("./showrooms/daeun.jpg")),
} as const;

/**
 * 상품 이미지 — 브랜드 공식 컷에서 구웠다.
 *
 * `detail`은 여러 컷을 세로로 이어 붙인 1080×2000 한 장이다. 케라시스는 한글 카피가 들어간
 * 실제 상세페이지 세 컷을 이어서, 상세정보 탭이 진짜 상세페이지처럼 스크롤된다.
 *
 * ⚠️ `Record<string, _>`로 두면 **없는 키를 써도 컴파일이 통과하고 앱을 켤 때 터진다.**
 * `satisfies`로 두어 키를 정확히 추론시킨다 — 오타나 옛 키는 tsc가 잡는다.
 */
export const DEMO_PRODUCT_IMAGE = {
  "anua-serum": {
    main: uri(require("./products/anua-serum-1.jpg")),
    sub: uri(require("./products/anua-serum-2.jpg")),
    detail: uri(require("./products/anua-serum-detail.jpg")),
  },
  "anua-toner": {
    main: uri(require("./products/anua-toner-1.jpg")),
    sub: uri(require("./products/anua-toner-2.jpg")),
    detail: uri(require("./products/anua-toner-detail.jpg")),
  },
  "ahc-lotion": {
    main: uri(require("./products/ahc-lotion-1.jpg")),
    sub: uri(require("./products/ahc-lotion-2.jpg")),
    detail: uri(require("./products/ahc-lotion-detail.jpg")),
  },
  "cetaphil-cream": {
    main: uri(require("./products/cetaphil-cream-1.jpg")),
    sub: uri(require("./products/cetaphil-cream-2.jpg")),
    detail: uri(require("./products/cetaphil-cream-detail.jpg")),
  },
  "paulmedison-lotion": {
    main: uri(require("./products/paulmedison-lotion-1.jpg")),
    sub: uri(require("./products/paulmedison-lotion-2.jpg")),
    detail: uri(require("./products/paulmedison-lotion-detail.jpg")),
  },
  "onthebody-wash": {
    main: uri(require("./products/onthebody-wash-1.jpg")),
    sub: uri(require("./products/onthebody-wash-2.jpg")),
    detail: uri(require("./products/onthebody-wash-detail.jpg")),
  },
  "elastine-shampoo": {
    main: uri(require("./products/elastine-shampoo-1.jpg")),
    sub: uri(require("./products/elastine-shampoo-2.jpg")),
    detail: uri(require("./products/elastine-shampoo-detail.jpg")),
  },
  "kerasys-treatment": {
    main: uri(require("./products/kerasys-treatment-1.jpg")),
    sub: uri(require("./products/kerasys-treatment-2.jpg")),
    detail: uri(require("./products/kerasys-treatment-detail.jpg")),
  },
} satisfies Record<string, DemoProductImages>;

export type DemoProductSlug = keyof typeof DEMO_PRODUCT_IMAGE;

/** post-01 ~ post-23 — 인덱스가 아니라 파일명으로 고른다(사진을 갈아 끼워도 짝이 안 흐트러진다) */
export const DEMO_POST_IMAGE = {
  p01: uri(require("./posts/post-01.jpg")),
  p02: uri(require("./posts/post-02.jpg")),
  p03: uri(require("./posts/post-03.jpg")),
  p04: uri(require("./posts/post-04.jpg")),
  p05: uri(require("./posts/post-05.jpg")),
  p06: uri(require("./posts/post-06.jpg")),
  p07: uri(require("./posts/post-07.jpg")),
  p08: uri(require("./posts/post-08.jpg")),
  p09: uri(require("./posts/post-09.jpg")),
  p10: uri(require("./posts/post-10.jpg")),
  p11: uri(require("./posts/post-11.jpg")),
  p12: uri(require("./posts/post-12.jpg")),
  p13: uri(require("./posts/post-13.jpg")),
  p14: uri(require("./posts/post-14.jpg")),
  p15: uri(require("./posts/post-15.jpg")),
  p16: uri(require("./posts/post-16.jpg")),
  p17: uri(require("./posts/post-17.jpg")),
  p18: uri(require("./posts/post-18.jpg")),
  p19: uri(require("./posts/post-19.jpg")),
  p20: uri(require("./posts/post-20.jpg")),
  p21: uri(require("./posts/post-21.jpg")),
  p22: uri(require("./posts/post-22.jpg")),
  p23: uri(require("./posts/post-23.jpg")),
} as const;

export const DEMO_USER_IMAGE = uri(require("./user/me.jpg"));
