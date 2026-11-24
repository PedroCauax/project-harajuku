import { useFetch, Loader, money, STATUS } from "../lib.jsx";

function Stat({ label, value, tone }) {
  return (
    <div className="col-6 col-lg-3">
      <div className={`panel p-3 h-100 tone-${tone}`}>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const users = useFetch("/users");
  const orders = useFetch("/orders");
  const products = useFetch("/products");

  const loading = users.loading || orders.loading || products.loading;
  const error = users.error || orders.error || products.error;

  const revenue = orders.data
    .filter((o) => o.orderStatus !== "CANCELED")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const byStatus = Object.keys(STATUS).map((key) => ({
    key,
    count: orders.data.filter((o) => o.orderStatus === key).length,
  }));

  return (
    <Loader loading={loading} error={error}>
      <div className="row g-3 mb-4">
        <Stat tone="pink" label="Usuários" value={users.data.length} />
        <Stat tone="blue" label="Pedidos" value={orders.data.length} />
        <Stat tone="cream" label="Produtos" value={products.data.length} />
        <Stat tone="ink" label="Faturamento (sem cancelados)" value={money(revenue)} />
      </div>

      <div className="panel p-3 p-md-4">
        <h2 className="h5 mb-3">Pedidos por status</h2>
        {byStatus.map(({ key, count }) => (
          <div className="mb-3" key={key}>
            <div className="d-flex justify-content-between small mb-1">
              <span>{STATUS[key].label}</span>
              <span>{count}</span>
            </div>
            <div className="progress" style={{ height: "0.6rem" }}>
              <div className="progress-bar"
                style={{ width: `${orders.data.length ? (count / orders.data.length) * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Loader>
  );
}
