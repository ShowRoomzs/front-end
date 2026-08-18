import { TextStyle } from "react-native";

/**
 * 디자인 시스템 v0.1 · 02 타이포그래피
 *
 * 본문 서체는 Pretendard 하나. Fredoka는 워드마크 전용이며 UI 안에서는 쓰지 않는다
 * (스플래시 · 앱 아이콘 · 마이 탭 브랜딩 전용).
 *
 * 0.5px 단위 크기(13.5 본문 · 14.5 이름 · 12.5 라벨)는 클래스명에 점을 넣을 수 없어
 * tailwind가 아니라 여기서 정의한다. 위계는 색이 아니라 크기·굵기로 만들고,
 * 텍스트 최소 11px을 지킨다(10px은 탭 라벨 예외).
 */
export const TYPOGRAPHY_TOKENS = {
  /** 게시물 제목 — 700 · 16 / 1.45 · -0.4 */
  postTitle: { fontSize: 16, fontWeight: "700", lineHeight: 23.2, letterSpacing: -0.4 },
  /** 본문 — 400 · 13.5 / 1.6 (2줄 클램프) */
  body: { fontSize: 13.5, fontWeight: "400", lineHeight: 21.6 },
  /** 쇼룸 핸들(피드 헤더의 쇼룸명) — 600 · 13.5 / 1.3 */
  handle: { fontSize: 13.5, fontWeight: "600", lineHeight: 17.55 },
  /** 쇼룸 프로필 이름(C4 · 아바타 72) — 700 · 16 / 1.3 · -0.4 */
  profileName: { fontSize: 16, fontWeight: "700", lineHeight: 20.8, letterSpacing: -0.4 },
  /** 마이 프로필 이름(아바타 50) — 600 · 14 */
  profileNameSmall: { fontSize: 14, fontWeight: "600", lineHeight: 18.2 },
  /** 목록 행 이름(팔로잉 · 검색 · 최근 검색 · 아바타 44) — 600 · 14.5 */
  rowName: { fontSize: 14.5, fontWeight: "600", lineHeight: 18.85 },
  /** 상품명 — 400 · 13.5 / 1.45 (2줄 클램프) */
  productName: { fontSize: 13.5, fontWeight: "400", lineHeight: 19.6 },
  /** 가격 · 할인율 — 700 · 15 / 1 · 둘이 동일 크기 */
  price: { fontSize: 15, fontWeight: "700", lineHeight: 15 },
  /** 정가 — 400 · 12 · line-through · 단위 "원" 생략 */
  listPrice: { fontSize: 12, fontWeight: "400", lineHeight: 12, textDecorationLine: "line-through" },
  /** 버튼 라벨(더보기류) — 600 · 12.5 / 1 */
  button: { fontSize: 12.5, fontWeight: "600", lineHeight: 12.5 },
  /** 하단 고정 CTA — 15.5 / 600 (버튼 높이 52) */
  buttonPrimary: { fontSize: 15.5, fontWeight: "600", lineHeight: 15.5 },
  /** 콘텐츠 안 유도 CTA — 14 / 600 (버튼 높이 45) */
  buttonInline: { fontSize: 14, fontWeight: "600", lineHeight: 14 },
  /** 배지 — 600 · 11 / 1 */
  badge: { fontSize: 11, fontWeight: "600", lineHeight: 11 },
  /** 탭 라벨 — 활성 600 · 비활성 500 · 10 (텍스트 최소 11px의 유일한 예외) */
  tabLabel: { fontSize: 10, fontWeight: "500", lineHeight: 12 },
  tabLabelActive: { fontSize: 10, fontWeight: "600", lineHeight: 12 },
  /** 섹션 라벨 — 12 / 600 · #8E8E8E */
  sectionLabel: { fontSize: 12, fontWeight: "600", lineHeight: 15.6 },
  /** 보조 줄 — 아이디(@handle) · 시트 옵션 설명 · 잠긴 행 라벨. 12.5 / #737373 */
  caption: { fontSize: 12.5, fontWeight: "400", lineHeight: 17.5 },
  /** 타임스탬프 — 12 / #8E8E8E */
  timestamp: { fontSize: 12, fontWeight: "400", lineHeight: 15.6 },
  /** 법정 고지 · 푸터 — 400 · 11 / 1.65 · #737373 (텍스트 최소 크기) */
  legal: { fontSize: 11, fontWeight: "400", lineHeight: 18.15 },
  /** 로그인 유도 블록 제목 — 19 / 700 */
  promptTitle: { fontSize: 19, fontWeight: "700", lineHeight: 26.6 },
  /** 로그인 유도 블록 설명 — 13 / 1.7 · #737373 */
  promptBody: { fontSize: 13, fontWeight: "400", lineHeight: 22.1 },
  /** 안내 배너 본문(행동 안내) — 12.5 / 1.55 · #3C3C3C */
  infoBody: { fontSize: 12.5, fontWeight: "400", lineHeight: 19.4 },
  /** 참고 고지(아이콘 없음) — 11.5 / 1.7 · #737373 */
  infoNote: { fontSize: 11.5, fontWeight: "400", lineHeight: 19.55 },
  /** 목록/시트 항목 라벨 — 15.5 */
  listItem: { fontSize: 15.5, fontWeight: "400", lineHeight: 20.15 },
  /** 메뉴 행 액션 항목 — 15 / 500 */
  menuAction: { fontSize: 15, fontWeight: "500", lineHeight: 19.5 },
  /** 열람만 하는 도움말 행 — 14.5 / 400 회색 */
  menuPassive: { fontSize: 14.5, fontWeight: "400", lineHeight: 18.85 },
  /** 아코디언 질문 — 14.5 (펼침 600 / 접힘 400) */
  accordionQuestion: { fontSize: 14.5, fontWeight: "400", lineHeight: 21.75 },
  accordionQuestionOpen: { fontSize: 14.5, fontWeight: "600", lineHeight: 21.75 },
  /** 아코디언 답변 본문 — 13.5 / 1.7 · #3C3C3C */
  accordionAnswer: { fontSize: 13.5, fontWeight: "400", lineHeight: 22.95 },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof TYPOGRAPHY_TOKENS;
