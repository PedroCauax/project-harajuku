import { useState } from "react";
import { useFetch, Loader, send } from "../lib.jsx";
import { useToast } from "../Toast.jsx";
import { ConfirmModal } from "../Modal.jsx";

const EMPTY = { name: "", email: "", phone: "", password: "" };

const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("");

export default function Users() {
  const { data: users, loading, error, reload } = useFetch("/users");
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase()));
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  function handleEdit(u) {
    setEditingId(u.id);
    setForm({ name: u.name, email: u.email, phone: u.phone, password: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await send("PUT", `/users/${editingId}`, { name: form.name, email: form.email, phone: form.phone });
      } else {
        await send("POST", "/users", form);
      }
      toast.ok(editingId ? "Usuário atualizado." : "Usuário cadastrado.");
      resetForm();
      reload();
    } catch (err) {
      toast.fail(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await send("DELETE", `/users/${toDelete.id}`);
      toast.ok("Usuário excluído.");
      if (editingId === toDelete.id) resetForm();
      reload();
    } catch (err) {
      toast.fail(err.message);
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  }

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <form className="panel p-3 p-md-4" onSubmit={handleSubmit}>
          <h2 className="h5 mb-3">{editingId ? "Editar usuário" : "Novo usuário"}</h2>
          <div className="mb-3">
            <label htmlFor="u-name" className="form-label">Nome</label>
            <input id="u-name" name="name" className="form-control" required value={form.name} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="u-email" className="form-label">E-mail</label>
            <input id="u-email" name="email" type="email" className="form-control" required value={form.email} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="u-phone" className="form-label">Telefone</label>
            <input id="u-phone" name="phone" className="form-control" required value={form.phone} onChange={handleChange} />
          </div>
          {!editingId && (
            <div className="mb-3">
              <label htmlFor="u-pass" className="form-label">Senha</label>
              <input id="u-pass" name="password" type="password" className="form-control" required
                autoComplete="new-password" value={form.password} onChange={handleChange} />
            </div>
          )}
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-accent" disabled={saving}>
              {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Cadastrar usuário"}
            </button>
            {editingId && <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="col-lg-8">
        <div className="panel p-3 p-md-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h2 className="h5 mb-0">Usuários</h2>
            <input type="search" className="form-control w-auto" placeholder="Buscar por nome ou e-mail"
              aria-label="Buscar usuários" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <Loader loading={loading} error={error}>
            {filtered.length === 0 ? (
              <p className="text-center py-5 mb-0">Nenhum usuário encontrado.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead><tr><th>Usuário</th><th>Telefone</th><th className="text-end">Ações</th></tr></thead>
                  <tbody>
                    {filtered.map((u) => (
                      <tr key={u.id} className={u.id === editingId ? "row-editing" : ""}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <span className="avatar">{initials(u.name)}</span>
                            <div>
                              <div className="fw-semibold">{u.name}</div>
                              <div className="small">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{u.phone}</td>
                        <td className="text-end text-nowrap">
                          <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(u)}>Editar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => setToDelete(u)}>Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Loader>
        </div>
      </div>

      {toDelete && (
        <ConfirmModal
          title="Excluir usuário"
          message={`Excluir ${toDelete.name}? Usuários com pedidos não podem ser excluídos.`}
          confirmLabel="Excluir"
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
