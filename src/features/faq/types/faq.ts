/** 고객센터 FAQ — 운영자가 게시하는 정적 콘텐츠다 */
export interface FaqCategory {
  /** enum 이름. 전체는 분류 값이 아니라 "필터 없음"을 뜻하는 의사값이다 */
  key: string;
  description: string;
}

export interface Faq {
  id: number;
  category: string;
  categoryName: string;
  question: string;
  answer: string;
}
