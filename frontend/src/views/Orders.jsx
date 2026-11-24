import { useState } from "react";
import { useFetch, Loader, send, StatusBadge, STATUS, money, fmtDate, fmtDateTime } from "../lib.jsx";
import { useToast } from "../Toast.jsx";
import { Modal } from "../Modal.jsx";

function Receipt({ order }) {
  return (
    <>
      <div className="row g-3 mb-3">
        <div className="col-sm-6">
          <div className="form-label">Cliente</div>
          <div className="fw-bold">{order.client?.name}</div>
          <div className="small">{order.client?.email}</div>
          <div className="small">{order.client?.phone}</div>
        </div>
        <div className="col-sm-6">
          <div className="form-label">Pedido</div>
          <div>Feito em {fmtDateTime(order.moment)}</div>
          <div className="mt-1"><StatusBadge status={order.orderStatus} /></div>
          <div className="small mt-1">
            {order.payment ? `Pagamento registrado em ${fmtDateTime(order.payment.moment)}` : "Nenhum pagamento registrado"}
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr><th>Produto</th><th className="text-center">Qtd</th><th className="text-end">Unitário</th><th className="text-end">Subtotal</th></tr>
          </thead>
          <tbody>
            {order.items?.map((it) => (
              <tr key={it.product.id}>
                <td>{it.product.name}</td>
                <td className="text-center">{it.quantity}</td>
                <td className="text-end">{money(it.price)}</td>
                <td className="text-end">{money(it.subTotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><th colSpan="3">Total</th><th className="text-end">{money(order.total)}</th></tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}

export default function Orders() {
  const { data: orders, loading, error, reload } = useFetch("/orders");
  const toast = useToast();
  const [status, setStatus] = useState("ALL");
  const [receiptId, setReceiptId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const list = orders.filter((o) => status === "ALL" || o.orderStatus === status).sort((a, b) => b.id - a.id);
  const receipt = orders.find((o) => o.id === receiptId);

  async function changeStatus(order, next) {
    if (next === order.orderStatus) return;
    setUpdatingId(order.id);
    try {
      await send("PATCH", `/orders/${order.id}/status`, { status: next });
      toast.ok(`Pedido #${order.id}: ${STATUS[next].label}.`);
      reload();
    } catch (err) {
      toast.fail(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <Loader loading={loading} error={error}>
      <div className="panel p-3 p-md-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <h2 className="h5 mb-0">Pedidos</h2>
          <select className="form-select w-auto" aria-label="Filtrar por status" value={status}
            onChange={(e) => setStatus(e.target.value)}>
            <option value="ALL">Todos os status</option>
            {Object.entries(STATUS).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
          </select>
        </div>

        {list.length === 0 ? (
          <p className="text-center py-4 mb-0">Nenhum pedido com esse status.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th><th>Data</th><th>Cliente</th><th>Status</th>
                  <th className="text-end">Total</th><th>Mudar status</th><th className="text-end">Recibo</th>
                </tr>
              </thead>
              <tbody>
                {list.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{fmtDate(o.moment)}</td>
                    <td>{o.client?.name}</td>
                    <td><StatusBadge status={o.orderStatus} /></td>
                    <td className="text-end">{money(o.total)}</td>
                    <td>
                      <select className="form-select form-select-sm w-auto" aria-label={`Mudar status do pedido ${o.id}`}
                        value={o.orderStatus} disabled={updatingId === o.id}
                        onChange={(e) => changeStatus(o, e.target.value)}>
                        {Object.entries(STATUS).map(([key, s]) => <option key={key} value={key}>{s.label}</option>)}
                      </select>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => setReceiptId(o.id)}>Ver recibo</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {receipt && (
        <Modal title={`Recibo do pedido #${receipt.id}`} onClose={() => setReceiptId(null)} wide>
          <Receipt order={receipt} />
        </Modal>
      )}
    </Loader>
  );
}
