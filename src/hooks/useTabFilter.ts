import { useState, useMemo, useCallback } from "react";

export function useTabFilter<T>(
  items: T[],
  defaultCategory: string,
  filterFn: (item: T, category: string) => boolean
) {
  const [activeCategory, setActiveCategory] = useState<string>(defaultCategory);

  const filteredItems = useMemo(() => {
    return items.filter((item) => filterFn(item, activeCategory));
  }, [items, activeCategory, filterFn]);

  const selectCategory = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  return {
    activeCategory,
    setActiveCategory: selectCategory,
    filteredItems,
  };
}
