/** 서버 카테고리 응답의 필터 정의 — 앱은 필터 화면을 쓰지 않지만 응답 모양은 그대로 둔다 */
interface CategoryFilter {
  id: number;
  filterKey: string;
  label: string;
  filterType: "SELECT" | "RADIO" | "COLOR" | "BRAND" | "PRICE_RANGE" | "CHECKBOX";
  condition: "OR" | "AND";
  sortOrder: number;
  isActive: boolean;
  values: Array<{
    id: number;
    value: string;
    label: string;
    extra: string | null;
    sortOrder: number;
    isActive: boolean;
  }>;
}

export interface Category {
  categoryId: number;
  name: string;
  order: number;
  iconUrl: string;
  parentId: number | null;
  filters: Array<CategoryFilter>;
}
