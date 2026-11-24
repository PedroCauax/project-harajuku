import { useState } from "react";
import { Smile, Sparkle, Cursor } from "./decor.jsx";
import { useFetch, send, money, scrollToId, StatusBadge } from "./lib.jsx";
import { useCart, CartDrawer } from "./Cart.jsx";
import { useToast } from "./Toast.jsx";
import { Modal } from "./Modal.jsx";
import Store from "./Store.jsx";
import { ProductImage } from "./ProductCard.jsx";

const DEFAULT_CLIENT_ID = 1; // cliente padrão do TestConfig (usado quando ninguém está logado)

const LOOKS = [
  { img: "/img/lookbook/look-1.jpg", title: "Look 01", text: "Oversized preta bordada + shorts", alt: "Jovem de camiseta preta oversized bordada e shorts pretos, segurando um skate" },
  { img: "/img/lookbook/look-2.jpg", title: "Look 02", text: "Duo: preta dragão + branca estampada", alt: "Dois jovens diante de uma cerca: um de camiseta preta com dragão e outro de costas com camiseta branca estampada" },
  { img: "/img/lookbook/look-3.jpg", title: "Look 03", text: "Puffer branca + calça preta", alt: "Jovem de óculos brancos, jaqueta puffer branca com capuz e calça preta" },
  { img: "/img/lookbook/look-4.jpg", title: "Look 04", text: "Cargo de couro + bota laranja", alt: "Calça cargo preta de couro sintético com corrente e botas laranja" },
];

function Lookbook() {
  return (
    <section id="lookbook" className="section container" aria-labelledby="lookbook-title">
      <h2 id="lookbook-title" className="section-title">Lookbook 01</h2>
      <div className="row g-4">
        {LOOKS.map((l) => (
          <div className="col-6 col-md-3" key={l.title}>
            <figure className="look m-0">
              <img src={l.img} alt={l.alt} loading="lazy" />
              <figcaption><strong>{l.title}</strong> · {l.text}</figcaption>
            </figure>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Landing({ brand, user, onEnterPanel, onLogin, onLogout }) {
  const toast = useToast();
  const cart = useCart();
  const { data: products, loading, error } = useFetch("/products");
  const [cartOpen, setCartOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const featured = [...products].sort((a, b) => b.id - a.id)[0];
  const marquee = `DROP 01 DISPONÍVEL ★ ${brand.toUpperCase()} STREETWEAR ★ `;

  function addToCart(p) {
    cart.add(p);
    toast.ok(`${p.name} foi para a sacola.`);
  }

  async function checkout() {
    setBusy(true);
    try {
      const order = await send("POST", "/orders", {
        clientId: user ? user.id : DEFAULT_CLIENT_ID,
        items: cart.items.map((i) => ({ productId: i.id, quantity: i.qty })),
      });
      cart.clear();
      setCartOpen(false);
      setReceipt(order);
      toast.ok(`Pedido #${order.id} enviado!`);
    } catch (e) {
      toast.fail(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <header className="landing-header">
        <nav className="container landing-nav" aria-label="Principal">
          <span className="landing-brand">{brand}</span>
          <ul className="landing-links">
            <li><button type="button" className="lnav-link" onClick={() => scrollToId("loja")}>Novo drop</button></li>
            <li><button type="button" className="lnav-link" onClick={() => scrollToId("lookbook")}>Lookbook</button></li>
            <li><button type="button" className="lnav-link" onClick={() => onEnterPanel("orders")}>Pedidos</button></li>
            <li><button type="button" className="lnav-link" onClick={() => onEnterPanel("categories")}>Categorias</button></li>
          </ul>
          <div className="landing-actions">
            <button type="button" className="lbtn" onClick={() => setCartOpen(true)}>Sacola ({cart.count})</button>
            {user ? (
              <>
                <span className="user-chip" title={user.email}>{user.name.split(" ")[0]}</span>
                <button type="button" className="lbtn lbtn-blue" onClick={() => onEnterPanel("dashboard")}>Painel</button>
                <button type="button" className="llink" onClick={onLogout}>Sair</button>
              </>
            ) : (
              <button type="button" className="lbtn lbtn-blue" onClick={onLogin}>Entrar / Admin</button>
            )}
          </div>
        </nav>
      </header>

      <section className="landing" aria-label="Apresentação">
        <div className="container landing-stage">
          <h1 className="landing-title">{brand}</h1>

          <img
            className="landing-model"
            src="/img/hero-photo.webp"
            width="1500"
            height="2463"
            alt="Modelo sentada com jaqueta de couro preta, calça jeans larga e tênis"
            fetchpriority="high"
          />

          <div className="landing-copy">
            <h2 className="landing-tag">Vista o que<br />você sente.</h2>
            <p>Streetwear com referência de Tóquio e Seul, feito para ocupar espaço e falar primeiro.</p>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <button type="button" className="lbtn" onClick={() => scrollToId("loja")}>Entrar na loja</button>
              <button type="button" className="llink" onClick={() => scrollToId("lookbook")}>Ver lookbook</button>
            </div>
          </div>

          <div className="landing-deco" aria-hidden="true">
            <Smile />
            <Sparkle />
            <Cursor />
          </div>

          {featured && (
            <aside className="feature-card panel" aria-label="Destaque do drop">
              <div className="feature-tag">Destaque do drop</div>
              <ProductImage p={featured} />
              <div className="p-2">
                <div className="fw-bold small">{featured.name}</div>
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <span className="fw-semibold">{money(featured.price)}</span>
                  <button type="button" className="btn btn-sm btn-accent" onClick={() => addToCart(featured)}>+ Sacola</button>
                </div>
              </div>
            </aside>
          )}
        </div>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((k) => (
              <span className="marquee-group" key={k}>
                {Array.from({ length: 6 }, (_, i) => <span key={i}>{marquee}</span>)}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Store products={products} loading={loading} error={error} onAdd={addToCart} />
      <Lookbook />

      <footer className="landing-footer">
        <div className="container d-flex flex-wrap justify-content-between gap-2">
          <span className="fw-bold text-uppercase">{brand} · streetwear</span>
          <span>Projeto acadêmico · React + Spring Boot</span>
        </div>
      </footer>

      <CartDrawer cart={cart} open={cartOpen} user={user} busy={busy}
        onClose={() => setCartOpen(false)} onCheckout={checkout} />

      {receipt && (
        <Modal title={`Pedido #${receipt.id} confirmado`} onClose={() => setReceipt(null)}>
          <p className="mb-2">
            Obrigado{receipt.client ? `, ${receipt.client.name}` : ""}! Status: <StatusBadge status={receipt.orderStatus} />
          </p>
          <table className="table table-sm">
            <thead><tr><th>Item</th><th className="text-center">Qtd</th><th className="text-end">Subtotal</th></tr></thead>
            <tbody>
              {receipt.items?.map((it) => (
                <tr key={it.product.id}>
                  <td>{it.product.name}</td>
                  <td className="text-center">{it.quantity}</td>
                  <td className="text-end">{money(it.subTotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><th colSpan="2">Total</th><th className="text-end">{money(receipt.total)}</th></tr></tfoot>
          </table>
          <div className="text-end">
            <button type="button" className="btn btn-accent" onClick={() => setReceipt(null)}>Continuar comprando</button>
          </div>
        </Modal>
      )}
    </>
  );
}
