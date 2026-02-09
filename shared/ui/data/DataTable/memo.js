import { useCallback, useRef } from "react";

export function useStableCallback(fn) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  return useCallback((...args) => fnRef.current(...args), []);
}
