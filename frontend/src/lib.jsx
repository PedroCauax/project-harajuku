import { useState, useEffect } from "react";

export const API = "http://localhost:8080";

export const money = (v) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v ?? 0);

export const fmtDate = (v) => (v ? new Date(v).toLocaleDateString("pt-BR") : "-");
export const fmtDateTime = (v) =>
  v ? new Date(v).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "-";

// localStorage com proteção (pode estar bloqueado ou corrompido)
export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
export function saveJSON(key, value) {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* sem espaço ou bloqueado: ignora */
  }
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export const STATUS = {
  WAITING_PAYMENT: { label: "Aguardando pagamento", cls: "st-waiting" },
  PAID: { label: "Pago", cls: "st-paid" },
  SHIPPED: { label: "Enviado", cls: "st-shipped" },
  DELIVERED: { label: "Entregue", cls: "st-delivered" },
  CANCELED: { label: "Cancelado", cls: "st-canceled" },
};

export function StatusBadge({ status }) {
  const s = STATUS[status] || { label: status, cls: "st-shipped" };
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

// Hook próprio: junta useState + useEffect para buscar dados da API
export function useFetch(path) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  useEffect(() => {
    fetch(API + path)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        setData(json);
        setError("");
      })
      .catch((e) => {
        if (e instanceof TypeError)
          setError(`Sem resposta do back-end em ${API}${path}. Ele está rodando? (pode ser CORS ou porta errada)`);
        else if (e.message.startsWith("HTTP"))
          setError(`O back-end respondeu ${e.message} em ${path}. Veja o erro no console do Spring Boot.`);
        else setError(`Resposta inválida de ${path}.`);
      })
      .finally(() => setLoading(false));
  }, [path, version]);

  return { data, loading, error, reload: () => setVersion((v) => v + 1) };
}

export function Loader({ loading, error, children }) {
  if (error) return <div className="alert alert-danger" role="alert">{error}</div>;
  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  return children;
}

// POST / PUT / PATCH / DELETE. Em erro lança Error com a mensagem da API (ex.: 400 do ResourceExceptionHandler)
export async function send(method, path, body) {
  let res;
  try {
    res = await fetch(API + path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw Object.assign(new Error("Sem resposta do back-end. Ele está rodando?"), { status: 0 });
  }
  if (!res.ok) {
    let message = `Erro ${res.status} ao falar com o servidor.`;
    try {
      const data = await res.json();
      if (data && data.message) message = data.message;
    } catch {
      /* resposta sem corpo */
    }
    throw Object.assign(new Error(message), { status: res.status });
  }
  return res.status === 204 ? null : res.json();
}
