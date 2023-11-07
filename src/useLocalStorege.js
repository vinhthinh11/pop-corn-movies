import { useEffect, useState } from "react";
export function useLocalStorage(initialState, key) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem("watchList");
    if (!storedValue) return initialState;
    return JSON.parse(storedValue);
  });
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value]
  );

  return [value, setValue];
}
