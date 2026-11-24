import { createContext, useContext, useState, useCallback, useMemo, useRef } from "react";

const ToastContext = createContext({ ok: () => {}, fail: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const remove = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const push = useCallback(
    (type, text) => {
      const id = nextId.current++;
      setToasts((list) => [...list.slice(-3), { id, type, text }]);
      setTimeout(() => remove(id), 4500);
    },
    [remove]
  );

  const api = useMemo(() => ({ ok: (t) => push("ok", t), fail: (t) => push("fail", t) }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item toast-${t.type}`} role={t.type === "fail" ? "alert" : "status"}>
            <span>{t.text}</span>
            <button type="button" aria-label="Fechar aviso" onClick={() => remove(t.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
