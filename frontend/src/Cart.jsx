import { useState, useEffect } from "react";
import { money, loadJSON, saveJSON } from "./lib.jsx";

const CART_KEY = "harajuku_cart";

// Estado da sacola, salvo no localStorage para não sumir ao recarregar
export function useCart() {
  const [items, setItems] = useState(() => {
    const saved = loadJSON(CART_KEY, []);
    return Array.isArray(saved) ? saved : [];
  });

  useEffect(() => {
    saveJSON(CART_KEY, items);
  }, [items]);

  const add = (p) =>
    setItems((cur) => {
      const found = cur.find((i) => i.id === p.id);
      if (found) return cur.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      // imagem enviada pelo usuário (data:) é grande demais para o localStorage
      const imgUrl = p.imgUrl && !p.imgUrl.startsWith("data:") ? p.imgUrl : "";
      return [...cur, { id: p.id, name: p.name, price: p.price, imgUrl, qty: 1 }];
    });

  const setQty = (id, qty) =>
    setItems((cur) => (qty < 1 ? cur.filter((i) => i.id !== id) : cur.map((i) => (i.id === id ? { ...i, qty } : i))));
  const remove = (id) => setItems((cur) => cur.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  return { items, add, setQty, remove, clear, count, total };
}

export function CartDrawer({ cart, open, user, busy, onClose, onCheckout }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="drawer-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Sacola de compras">
        <div className="drawer-head">
          <h2 className="h4 mb-0">Sacola ({cart.count})</h2>
          <button type="button" className="modal-x" aria-label="Fechar sacola" onClick={onClose}>×</button>
        </div>

        <div className="drawer-body">
          {cart.items.length === 0 ? (
            <p className="text-center py-4 mb-0">Sua sacola está vazia. Adicione um item do drop.</p>
          ) : (
            <ul className="cart-list">
              {cart.items.map((i) => (
                <li className="cart-item" key={i.id}>
                  {i.imgUrl ? (
                    <img className="cart-thumb" src={i.imgUrl} alt="" />
                  ) : (
                    <span className="cart-thumb cart-thumb-ph" aria-hidden="true">{i.name[0]}</span>
                  )}
                  <div className="flex-grow-1">
                    <div className="fw-bold small">{i.name}</div>
                    <div className="small">{money(i.price)} un.</div>
                    <div className="qty mt-1">
                      <button type="button" aria-label={`Diminuir ${i.name}`} onClick={() => cart.setQty(i.id, i.qty - 1)}>−</button>
                      <span aria-live="polite">{i.qty}</span>
                      <button type="button" aria-label={`Aumentar ${i.name}`} onClick={() => cart.setQty(i.id, i.qty + 1)}>+</button>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold">{money(i.price * i.qty)}</div>
                    <button type="button" className="btn-link-plain" onClick={() => cart.remove(i.id)}>Remover</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="drawer-foot">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="fw-bold text-uppercase">Total</span>
            <strong className="fs-5">{money(cart.total)}</strong>
          </div>
          <p className="small mb-2">Cliente do pedido: {user ? user.name : "cliente padrão (demo)"}</p>
          <button type="button" className="btn btn-accent w-100" disabled={busy || cart.count === 0} onClick={onCheckout}>
            {busy ? "Enviando..." : "Finalizar pedido"}
          </button>
        </div>
      </aside>
    </div>
  );
}
