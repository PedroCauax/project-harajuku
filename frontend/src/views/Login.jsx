import { useState } from "react";
import { send } from "../lib.jsx";

const DEMO = { email: "admin@harajuku.com", password: "admin123" };

export default function Login({ brand, onSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      onSuccess(await send("POST", "/auth/login", { email, password }));
    } catch (err) {
      setError(err.status === 401 ? "E-mail ou senha inválidos." : err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <div className="container py-3">
        <button type="button" className="llink" onClick={onBack}>← Voltar à loja</button>
      </div>

      <div className="container flex-grow-1 d-flex align-items-center justify-content-center pb-5">
        <form className="panel login-card p-4" onSubmit={handleSubmit}>
          <div className="landing-brand mb-1">{brand}</div>
          <h1 className="h3 mb-3">Entrar no painel</h1>

          {error && <div className="alert alert-danger" role="alert">{error}</div>}

          <div className="mb-3">
            <label htmlFor="login-email" className="form-label">E-mail</label>
            <input id="login-email" type="email" className="form-control" required autoComplete="username"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label htmlFor="login-pass" className="form-label">Senha</label>
            <input id="login-pass" type="password" className="form-control" required autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-accent w-100" disabled={busy}>
            {busy ? "Entrando..." : "Entrar"}
          </button>
          <button type="button" className="btn-link-plain mt-3 d-block mx-auto"
            onClick={() => { setEmail(DEMO.email); setPassword(DEMO.password); setError(""); }}>
            Preencher acesso Admin (Demo)
          </button>
        </form>
      </div>
    </div>
  );
}
