import { useLayoutEffect, useRef } from "react";
export default function Modal({ children, className = "", onClose, label }) {
  const ref = useRef(null);
  const callback = useRef(onClose);
  callback.current = onClose;
  useLayoutEffect(() => {
    const el = ref.current;
    const focus = document.activeElement;
    el.showModal();
    return () => {
      el.close();
      focus?.focus?.();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={"modal " + className}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        callback.current();
      }}
      onClick={(e) => {
        if (e.target === ref.current) callback.current();
      }}
    >
      {children}
    </dialog>
  );
}
