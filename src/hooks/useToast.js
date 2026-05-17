import { useState, useCallback, useRef } from "react";

export function useToast(duration = 3000) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const showToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    timers.current[id] = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      delete timers.current[id];
    }, duration);
  }, [duration]);

  const closeToast = useCallback((id) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, showToast, closeToast };
}
