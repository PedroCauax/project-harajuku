import { useState, useEffect } from "react";
import Landing from "./Landing.jsx";
import Login from "./views/Login.jsx";
import Dashboard from "./views/Dashboard.jsx";
import Orders from "./views/Orders.jsx";
import Products from "./views/Products.jsx";
import Categories from "./views/Categories.jsx";
import Users from "./views/Users.jsx";
import { Smile, Sparkle } from "./decor.jsx";
import { loadJSON, saveJSON } from "./lib.jsx";
import { useToast } from "./Toast.jsx";

const BRAND = "Harajuku"; // nome da loja: navbar, palavra gigante da entrada e letreiro
const SESSION_KEY = "harajuku_session";

const TABS = [
  { key: "dashboard", label: "Resumo", sub: "Tudo da loja num lugar só.", View: Dashboard },
  { key: "orders", label: "Pedidos", sub: "Quem comprou, o que levou e quanto pagou.", View: Orders },
  { key: "products", label: "Produtos", sub: "O drop completo: cadastre, edite, exclua.", View: Products },
  { key: "categories", label: "Categorias", sub: "Organize o drop por tipo.", View: Categories },
  { key: "users", label: "Usuários", sub: "Quem faz parte da loja.", View: Users },
];

export default function App() {
  const toast = useToast();
  const [user, setUser] = useState(() => {
    const saved = loadJSON(SESSION_KEY, null);
    return saved && saved.id && saved.token ? saved : null;
  });
  const [screen, setScreen] = useState("landing"); // "landing" | "login" | "panel"
  const [tab, setTab] = useState("dashboard");
  const [pendingTab, setPendingTab] = useState(null);

  // Sessão fica salva no navegador
  useEffect(() => {
    saveJSON(SESSION_KEY, user);
  }, [user]);

  // Painel exige usuário logado
  const view = screen === "panel" && !user ? "login" : screen;
  const current = TABS.find((t) => t.key === tab);
  const { View } = current;

  useEffect(() => {
    document.title =
      view === "panel" ? `${current.label} · ${BRAND}` : view === "login" ? `Entrar · ${BRAND}` : BRAND;
  }, [view, current.label]);

  function goTop() {
    window.scrollTo(0, 0);
  }

  function enterPanel(key = "dashboard") {
    if (user) {
      setTab(key);
      setScreen("panel");
    } else {
      setPendingTab(key);
      setScreen("login");
    }
    goTop();
  }

  function handleLogin(data) {
    setUser(data);
    setTab(pendingTab || "dashboard");
    setPendingTab(null);
    setScreen("panel");
    toast.ok(`Bem-vindo(a), ${data.name.split(" ")[0]}!`);
    goTop();
  }

  function logout() {
    setUser(null);
    setScreen("landing");
    toast.ok("Você saiu da conta.");
    goTop();
  }

  if (view === "landing") {
    return (
      <Landing brand={BRAND} user={user} onEnterPanel={enterPanel}
        onLogin={() => { setPendingTab(null); setScreen("login"); }} onLogout={logout} />
    );
  }

  if (view === "login") {
    return <Login brand={BRAND} onSuccess={handleLogin} onBack={() => { setScreen("landing"); goTop(); }} />;
  }

  return (
    <>
      <nav className="navbar topbar navbar-dark navbar-expand">
        <div className="container">
          <button className="navbar-brand brand-btn" onClick={() => { setScreen("landing"); goTop(); }} title="Voltar para a loja">
            {BRAND}
          </button>
          <ul className="navbar-nav ms-auto flex-wrap align-items-center">
            {TABS.map(({ key, label }) => (
              <li className="nav-item" key={key}>
                <button className={`nav-link tab ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>
                  {label}
                </button>
              </li>
            ))}
            <li className="nav-item ms-lg-3 d-flex align-items-center gap-2">
              <span className="user-chip-panel" title={user.email}>{user.name.split(" ")[0]}</span>
              <button className="btn btn-sm btn-outline-secondary" onClick={logout}>Sair</button>
            </li>
          </ul>
        </div>
      </nav>

      <header className="hero">
        <div className="container position-relative">
          <h1 className="hero-title">{current.label}</h1>
          <p className="hero-sub">{current.sub}</p>
          <Smile />
          <Sparkle />
        </div>
      </header>

      <main className="container pb-5">
        <View />
      </main>
    </>
  );
}
