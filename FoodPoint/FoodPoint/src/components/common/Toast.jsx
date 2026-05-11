import { useEffect } from "react";
import "./Common.css";

export default function Toast({ msg, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return <div className="toast">{msg}</div>;
}