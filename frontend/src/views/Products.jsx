import { useState } from "react";
import { useFetch, Loader, send } from "../lib.jsx";
import { useToast } from "../Toast.jsx";
import { Modal, ConfirmModal } from "../Modal.jsx";
import { ProductCard, useProductList } from "../ProductCard.jsx";

const EMPTY = { name: "", description: "", price: "", imgUrl: "", categoryIds: [] };

const GALLERY = [
  ["Tênis retrô", "tenis-retro-preto-laranja"],
  ["Jeans baggy", "jeans-baggy-claro"],
  ["Tênis chunky", "tenis-chunky-branco"],
  ["Camiseta gráfica", "camiseta-oversized-grafica"],
  ["Suéter navy", "conjunto-navy-street"],
  ["Camiseta bordada", "camiseta-bordada-preta"],
  ["Camiseta dragão", "camiseta-dragao-preta"],
  ["Camiseta branca", "camiseta-branca-costas"],
  ["Calça cargo", "calca-cargo-couro"],
  ["Bota laranja", "bota-laranja"],
  ["Jaqueta puffer", "jaqueta-puffer-branca"],
].map(([label, file]) => ({ url: `/img/produtos/${file}.jpg`, label }));

// Lê a imagem escolhida no computador e reduz (máx. 900px) para caber no banco
function fileToDataUrl(file, max = 900) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("O arquivo não é uma imagem válida."));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function Products() {
  const { data: products, loading, error, reload } = useFetch("/products");
  const { data: allCategories } = useFetch("/categories");
  const toast = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { list, controls } = useProductList(
    products,
    <button type="button" className="btn btn-accent" onClick={openNew}>+ Novo produto</button>
  );

  function openNew() {
    setEditingId(null);
    setForm(EMPTY);
    setFormOpen(true);
  }

  function openEdit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: p.price,
      imgUrl: p.imgUrl ?? "",
      categoryIds: (p.categories || []).map((c) => c.id),
    });
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY);
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function toggleCategory(id) {
    const ids = form.categoryIds.includes(id) ? form.categoryIds.filter((x) => x !== id) : [...form.categoryIds, id];
    setForm({ ...form, categoryIds: ids });
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.fail("Escolha um arquivo de imagem.");
    if (file.size > 8 * 1024 * 1024) return toast.fail("Imagem muito grande (máximo 8 MB).");
    try {
      const url = await fileToDataUrl(file);
      setForm((cur) => ({ ...cur, imgUrl: url }));
    } catch (err) {
      toast.fail(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await send(editingId ? "PUT" : "POST", editingId ? `/products/${editingId}` : "/products", {
        ...form,
        price: Number(form.price),
      });
      toast.ok(editingId ? "Produto atualizado." : "Produto cadastrado.");
      closeForm();
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
      await send("DELETE", `/products/${toDelete.id}`);
      toast.ok("Produto excluído.");
      reload();
    } catch (err) {
      toast.fail(err.message);
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  }

  return (
    <>
      {controls}

      <Loader loading={loading} error={error}>
        {list.length === 0 ? (
          <p className="panel p-4 text-center mb-0">Nenhum produto encontrado.</p>
        ) : (
          <div className="row g-4">
            {list.map((p) => (
              <div className="col-sm-6 col-lg-4 col-xl-3" key={p.id}>
                <ProductCard p={p}>
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => openEdit(p)}>Editar</button>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setToDelete(p)}>Excluir</button>
                </ProductCard>
              </div>
            ))}
          </div>
        )}
      </Loader>

      {formOpen && (
        <Modal title={editingId ? "Editar produto" : "Novo produto"} onClose={closeForm} wide>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-8">
                <label htmlFor="p-name" className="form-label">Nome</label>
                <input id="p-name" name="name" className="form-control" required value={form.name} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label htmlFor="p-price" className="form-label">Preço</label>
                <input id="p-price" name="price" type="number" step="0.01" min="0" className="form-control" required
                  value={form.price} onChange={handleChange} />
              </div>
              <div className="col-12">
                <label htmlFor="p-desc" className="form-label">Descrição</label>
                <textarea id="p-desc" name="description" rows="2" className="form-control"
                  value={form.description} onChange={handleChange} />
              </div>

              <div className="col-12">
                <div className="form-label">Categorias</div>
                {allCategories.length === 0 && <span className="small">Nenhuma categoria cadastrada ainda.</span>}
                {allCategories.map((c) => (
                  <div className="form-check form-check-inline" key={c.id}>
                    <input className="form-check-input" type="checkbox" id={`cat-${c.id}`}
                      checked={form.categoryIds.includes(c.id)} onChange={() => toggleCategory(c.id)} />
                    <label className="form-check-label" htmlFor={`cat-${c.id}`}>{c.name}</label>
                  </div>
                ))}
              </div>

              <div className="col-md-7">
                <div className="form-label">Imagem da galeria</div>
                <div className="gallery">
                  {GALLERY.map((g) => (
                    <button type="button" key={g.url} className="gallery-btn" aria-pressed={form.imgUrl === g.url}
                      title={g.label} onClick={() => setForm({ ...form, imgUrl: g.url })}>
                      <img src={g.url} alt={g.label} />
                    </button>
                  ))}
                </div>
                <label htmlFor="p-file" className="form-label mt-3">Ou envie uma imagem do computador</label>
                <input id="p-file" type="file" accept="image/*" className="form-control" onChange={handleFile} />
              </div>

              <div className="col-md-5">
                <div className="form-label">Pré-visualização</div>
                {form.imgUrl ? (
                  <img className="pimg upload-preview" src={form.imgUrl} alt="Pré-visualização da imagem do produto" />
                ) : (
                  <div className="pimg pimg-ph upload-preview" aria-hidden="true">?</div>
                )}
                {form.imgUrl && (
                  <button type="button" className="btn-link-plain mt-2" onClick={() => setForm({ ...form, imgUrl: "" })}>
                    Remover imagem
                  </button>
                )}
              </div>
            </div>

            <div className="d-flex gap-2 justify-content-end mt-4">
              <button type="button" className="btn btn-outline-secondary" onClick={closeForm}>Cancelar</button>
              <button type="submit" className="btn btn-accent" disabled={saving}>
                {saving ? "Salvando..." : editingId ? "Salvar alterações" : "Cadastrar produto"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {toDelete && (
        <ConfirmModal
          title="Excluir produto"
          message={`Tem certeza que deseja excluir “${toDelete.name}”? Essa ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}
