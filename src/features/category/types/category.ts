import { Filter } from "@/features/filter/types/filter";

export interface Category {
  categoryId: number;
  name: string;
  order: number;
  iconUrl: string;
  parentId: number | null;
  filters: Array<Filter>;
}
