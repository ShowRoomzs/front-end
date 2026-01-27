import { Filter, FilterValue } from "@/features/category/types/category";

export function mergeFilters(categoryFilters: Array<Filter>, detailFilters: Array<Filter>): Array<Filter> {
  const filterMap = new Map<number, Filter>();

  for (const filter of categoryFilters) {
    filterMap.set(filter.id, {
      ...filter,
      values: [...filter.values],
    });
  }

  for (const filter of detailFilters) {
    const existing = filterMap.get(filter.id);

    if (!existing) {
      filterMap.set(filter.id, {
        ...filter,
        values: [...filter.values],
      });
      continue;
    }

    const valueMap = new Map<number, FilterValue>();

    for (const value of existing.values) {
      valueMap.set(value.id, value);
    }

    for (const value of filter.values) {
      if (!valueMap.has(value.id)) {
        valueMap.set(value.id, value);
      }
    }

    existing.values = Array.from(valueMap.values());
  }

  return Array.from(filterMap.values());
}
