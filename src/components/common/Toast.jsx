import { useEffect } from "react";
import "./Toast.css";

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    const t = setTimeout(() => onClose(toast.id), 3000);
    return () => clearTimeout(t);
  }, [toast.id, onClose]);

  const icons = {
    success: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    error: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    ),
    info: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  };

  return (
    <div className={`toast toast--${toast.type || "success"}`}>
      <div className="toast-icon">{icons[toast.type] || icons.success}</div>
      <span className="toast-msg">{toast.msg}</span>
      <button className="toast-close" onClick={() => onClose(toast.id)}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  );
}

export default function ToastStack({ toasts, onClose }) {
  if (!toasts?.length) return null;
  return (
    <div className="toast-stack">
      {toasts.map(t => <ToastItem key={t.id} toast={t} onClose={onClose} />)}
    </div>
  );
}
