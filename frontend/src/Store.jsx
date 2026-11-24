import { Loader } from "./lib.jsx";
import { ProductCard, useProductList } from "./ProductCard.jsx";

// Vitrine pública: só adicionar à sacola (editar/excluir ficam no painel)
export default function Store({ products, loading, error, onAdd }) {
  const { list, controls } = useProductList(products);

  return (
    <section id="loja" className="section container" aria-labelledby="loja-title">
      <h2 id="loja-title" className="section-title">Drop 01</h2>
      {controls}
      <Loader loading={loading} error={error}>
        {list.length === 0 ? (
          <p className="panel p-4 text-center mb-0">Nenhum produto encontrado.</p>
        ) : (
          <div className="row g-4">
            {list.map((p) => (
              <div className="col-sm-6 col-lg-4 col-xl-3" key={p.id}>
                <ProductCard p={p} actionsBelow>
                  <button type="button" className="btn btn-sm btn-accent w-100" onClick={() => onAdd(p)}>
                    + Adicionar à sacola
                  </button>
                </ProductCard>
              </div>
            ))}
          </div>
        )}
      </Loader>
    </section>
  );
}
