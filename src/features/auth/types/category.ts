type FilterCondition = "OR" | "AND";
export type FilterType = "CHECKBOX" | "COLOR" | "RANGE" | "BRAND"; // TODO : 타입 추가

export interface FilterValue {
  id: number;
  value: string;
  label: string;
  extra: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Filter {
  id: number;
  filterKey: string;
  label: string;
  filterType: FilterType;
  condition: FilterCondition;
  sortOrder: number;
  isActive: boolean;
  values: Array<FilterValue>;
}

export interface Category {
  categoryId: number;
  name: string;
  order: number;
  iconUrl: string;
  parentId: number | null;
  filters: Array<Filter>;
}
