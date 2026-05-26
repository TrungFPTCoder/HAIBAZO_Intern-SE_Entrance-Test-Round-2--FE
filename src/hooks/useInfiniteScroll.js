import { useCallback, useEffect, useRef, useState } from "react";

export default function useInfiniteScroll(fetchFn) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const pageRef = useRef(0);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const currentPage = pageRef.current;
      const response = await fetchFn({ page: currentPage, size: 10 });
      const newItems = response.data || [];

      setItems((prev) => {
        const prevIds = new Set(prev.map((item) => item.id));
        const uniqueNewItems = newItems.filter((item) => !prevIds.has(item.id));
        return [...prev, ...uniqueNewItems];
      });

      if (response.pagination && response.pagination.hasNext === false) {
        hasMoreRef.current = false;
      } else if (newItems.length < 10) {
        hasMoreRef.current = false;
      } else {
        pageRef.current += 1;
      }
    } catch (error) {
      console.log("Failed to fetch more items");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    pageRef.current = 0;
    hasMoreRef.current = true;
    loadMore();
  }, [loadMore]);

  const onPopupScroll = (e) => {
    const { target } = e;
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 10) {
      loadMore();
    }
  };
  return {items, loading, hasMore: hasMoreRef.current, onPopupScroll}
}
