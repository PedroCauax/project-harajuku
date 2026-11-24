import { useState } from "react";
import { useFetch, Loader, send } from "../lib.jsx";
import { useToast } from "../Toast.jsx";
import { ConfirmModal } from "../Modal.jsx";

export default function Categories() {
  const cats = useFetch("/categories");
  const prods = useFetch("/products");
  const toast = useToast();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  function resetForm() {
    setName("");
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await send(editingId ? "PUT" : "POST", editingId ? `/categories/${editingId}` : "/categories", { name });
      toast.ok(editingId ? "Categoria atualizada." : "Categoria criada.");
      resetForm();
      cats.reload();
      prods.reload();
    } catch (err) {
      toast.fail(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await send("DELETE", `/categories/${toDelete.id}`);
      toast.ok("Categoria excluída.");
      if (editingId === toDelete.id) resetForm();
      cats.reload();
    } catch (err) {
      toast.fail(err.message);
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  }

  return (
    <>
      <form className="panel p-3 mb-4 d-flex flex-wrap gap-2 align-items-end" onSubmit={handleSubmit}>
        <div className="flex-grow-1">
          <label htmlFor="cat-name" className="form-label">{editingId ? "Editar categoria" : "Nova categoria"}</label>
          <input id="cat-name" className="form-control" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-accent" disabled={saving}>
          {saving ? "Salvando..." : editingId ? "Salvar" : "Adicionar"}
        </button>
        {editingId && <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancelar</button>}
      </form>

      <Loader loading={cats.loading || prods.loading} error={cats.error || prods.error}>
        {cats.data.length === 0 ? (
          <p className="panel p-4 text-center mb-0">Nenhuma categoria cadastrada.</p>
        ) : (
          <div className="row g-3">
            {cats.data.map((c) => {
              const items = prods.data.filter((p) => (p.categories || []).some((x) => x.id === c.id));
              return (
                <div className="col-md-6 col-lg-4" key={c.id}>
                  <div className={`panel p-3 h-100 ${c.id === editingId ? "row-editing" : ""}`}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h2 className="h5 mb-0">{c.name}</h2>
                      <span className="badge count">{items.length}</span>
                    </div>
                    <ul className="small ps-3">
                      {items.map((p) => <li key={p.id}>{p.name}</li>)}
                    </ul>
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => { setEditingId(c.id); setName(c.name); }}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setToDelete(c)}>Excluir</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Loader>

      {toDelete && (
        <ConfirmModal
          title="Excluir categoria"
          message={`Excluir a categoria “${toDelete.name}”? Ela só pode ser excluída se não tiver produtos.`}
          confirmLabel="Excluir"
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}
