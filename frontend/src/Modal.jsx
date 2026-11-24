import { useEffect, useRef } from "react";

export function Modal({ title, onClose, children, wide }) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const boxRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    boxRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={boxRef} tabIndex={-1} className={`modal-box ${wide ? "modal-wide" : ""}`}
        role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h2 className="h4 mb-0">{title}</h2>
          <button type="button" className="modal-x" aria-label="Fechar" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmModal({ title, message, confirmLabel = "Confirmar", busy, onConfirm, onCancel }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p>{message}</p>
      <div className="d-flex gap-2 justify-content-end">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>
        <button type="button" className="btn btn-outline-danger" disabled={busy} onClick={onConfirm}>
          {busy ? "Aguarde..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
