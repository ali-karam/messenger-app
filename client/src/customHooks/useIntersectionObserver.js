import { useCallback } from 'react';

const useIntersectionObserver = (observer, setPageNum, hasMore, loading) => {
  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prevPageNum) => ++prevPageNum);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, observer, setPageNum]
  );

  return lastItemRef;
};

export default useIntersectionObserver;
