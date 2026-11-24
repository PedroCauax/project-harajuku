import { useState } from "react";
import { money } from "./lib.jsx";

// Imagem com proporção fixa (4:3). Se falhar, mostra um bloco com a inicial.
export function ProductImage({ p }) {
  const [failed, setFailed] = useState(false);
  if (!p.imgUrl || failed) return <div className="pimg pimg-ph" aria-hidden="true">{p.name[0]}</div>;
  return <img className="pimg" src={p.imgUrl} alt={p.name} loading="lazy" onError={() => setFailed(true)} />;
}

export function ProductCard({ p, children, actionsBelow }) {
  return (
    <div className="panel pcard h-100 d-flex flex-column">
      <ProductImage p={p} />
      <div className="p-3 d-flex flex-column flex-grow-1">
        <h3 className="h6">{p.name}</h3>
        <p className="small flex-grow-1">{p.description}</p>
        <div className="mb-2">
          {(p.categories || []).map((c) => (
            <span key={c.id} className="badge chip me-1">{c.name}</span>
          ))}
        </div>
        <div className={`pcard-foot ${actionsBelow ? "below" : ""}`}>
          <span className="fw-semibold">{money(p.price)}</span>
          <span className="pcard-actions">{children}</span>
        </div>
      </div>
    </div>
  );
}

// Busca + categoria + ordenação + contador, usados na loja e no painel
export function useProductList(products, extra) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState("recent");

  const categoryNames = [...new Set(products.flatMap((p) => (p.categories || []).map((c) => c.name)))].sort();

  const list = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (category === "ALL" || (p.categories || []).some((c) => c.name === category))
    )
    .sort((a, b) => (sort === "asc" ? a.price - b.price : sort === "desc" ? b.price - a.price : b.id - a.id));

  const controls = (
    <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
      <input type="search" className="form-control w-auto" placeholder="Buscar produto" aria-label="Buscar produto"
        value={search} onChange={(e) => setSearch(e.target.value)} />
      <select className="form-select w-auto" aria-label="Filtrar por categoria" value={category}
        onChange={(e) => setCategory(e.target.value)}>
        <option value="ALL">Todas as categorias</option>
        {categoryNames.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className="form-select w-auto" aria-label="Ordenar produtos" value={sort}
        onChange={(e) => setSort(e.target.value)}>
        <option value="recent">Mais recentes</option>
        <option value="asc">Menor preço</option>
        <option value="desc">Maior preço</option>
      </select>
      <div className="ms-auto d-flex align-items-center gap-3">
        <span className="fw-bold small" aria-live="polite">
          Exibindo {list.length} {list.length === 1 ? "produto" : "produtos"}
        </span>
        {extra}
      </div>
    </div>
  );

  return { list, controls };
}
