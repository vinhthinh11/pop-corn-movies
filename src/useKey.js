import { useEffect } from "react";
export function useKey(fnc, keytype, keypress) {
  useEffect(() => {
    function callback(e) {
      if (e.code === keypress) {
        fnc();
      }
    }
    document.addEventListener(keytype, callback);
    return function () {
      document.removeEventListener(keytype, callback);
    };
  }, [fnc, keypress, keytype]);
}
