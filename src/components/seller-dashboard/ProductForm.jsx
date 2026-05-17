import { useState, useRef } from "react";
import FieldError from "../common/FieldError";
import { validateProduct, hasErrors } from "../../utils/validate";

const TIPOS_NEGOCIO = [
  { value: "salgados",   label: "Salgados" },
  { value: "marmita",    label: "Marmitas" },
  { value: "doces",      label: "Doces" },
  { value: "bebidas",    label: "Bebidas" },
  { value: "pastelaria", label: "Pastelaria" },
  { value: "lanches",    label: "Lanches" },
  { value: "sorvetes",   label: "Sorvetes" },
  { value: "outro",      label: "Outro" },
];

// Valida URL de imagem — só aceita HTTPS externo ou base64 local
function isSafeImageUrl(url) {
  if (!url) return false;
  if (url.startsWith("data:image/")) return true;
  try {
    const u = new URL(url);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function ProductForm({ editingProduct, onAddProduct, onEditProduct, onClose }) {
  const [form, setForm] = useState(
    editingProduct
      ? { ...editingProduct }
      : {
          nome: "", descricao: "", preco: "", categoria_id: null,
          quantidade_inicial: 0, alerta_estoque_baixo: 3,
          horario_disponivel: "", imagem_url: "",
        }
  );
  const [preview,   setPreview]   = useState(editingProduct?.imagem_url || "");
  const [imageErr,  setImageErr]  = useState("");
  const [errors,    setErrors]    = useState({});
  const fileRef = useRef(null);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setImageErr("Arquivo inválido. Use JPG, PNG ou WEBP."); return; }
    if (file.size > 5 * 1024 * 1024) { setImageErr("Imagem deve ter no máximo 5 MB."); return; }
    setImageErr("");
    const reader = new FileReader();
    reader.onload = (ev) => { setPreview(ev.target.result); set("imagem_url", ev.target.result); };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    set("imagem_url", url);
    if (url && !isSafeImageUrl(url)) {
      setImageErr("Use uma URL HTTPS válida.");
      setPreview("");
    } else {
      setImageErr("");
      setPreview(url);
    }
  };

  const handleSubmit = () => {
    const data = {
      ...form,
      preco:                parseFloat(form.preco) || 0,
      quantidade_inicial:   parseInt(form.quantidade_inicial) || 0,
      alerta_estoque_baixo: parseInt(form.alerta_estoque_baixo) || 0,
      // Garantir que imagem_url vazia vira null
      imagem_url: form.imagem_url?.trim() || null,
    };
    const errs = validateProduct(data);
    if (hasErrors(errs)) { setErrors(errs); return; }

    if (editingProduct) {
      onEditProduct(data);
    } else {
      onAddProduct({
        ...data,
        id:                Date.now(),
        ativo:             1,
        esgotado:          0,
        quantidade_vendida: 0,
      });
    }
    onClose?.();
  };

  return (
    <div className="product-form">
      <div className="product-form-title">
        {editingProduct ? "Editar produto" : "Novo produto"}
      </div>

      <div className="product-form-grid">
        {/* Nome */}
        <div className="form-field" style={{ gridColumn: "1/-1" }}>
          <label>Nome do produto *</label>
          <input type="text" placeholder="Ex: Marmita Fitness" value={form.nome}
            onChange={e => set("nome", e.target.value)}
            className={errors.nome ? "input-error" : ""}
            aria-invalid={!!errors.nome} />
          <FieldError msg={errors.nome} />
        </div>

        {/* Preço */}
        <div className="form-field">
          <label>Preço (R$) *</label>
          <input type="number" step="0.01" min="0" placeholder="0,00" value={form.preco}
            onChange={e => set("preco", e.target.value)}
            className={errors.preco ? "input-error" : ""}
            aria-invalid={!!errors.preco} />
          <FieldError msg={errors.preco} />
        </div>

        {/* Categoria */}
        <div className="form-field">
          <label>Categoria</label>
          <select value={form.categoria_id || ""} onChange={e => set("categoria_id", e.target.value || null)}>
            <option value="">— Sem categoria —</option>
            {TIPOS_NEGOCIO.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Estoque inicial */}
        <div className="form-field">
          <label>Estoque inicial</label>
          <input type="number" min="0" placeholder="0" value={form.quantidade_inicial}
            onChange={e => set("quantidade_inicial", e.target.value)} />
          <span style={{ fontSize: 11, color: "var(--text-3)", marginTop: 3, display: "block" }}>
            0 = sem controle de estoque
          </span>
        </div>

        {/* Alerta de estoque baixo */}
        <div className="form-field">
          <label>Alerta de estoque baixo</label>
          <input type="number" min="0" placeholder="3" value={form.alerta_estoque_baixo}
            onChange={e => set("alerta_estoque_baixo", e.target.value)} />
          <span style={{ fontSize: 11, color: "var(--text-3)", marginTop: 3, display: "block" }}>
            Avisa quando restarem X unidades
          </span>
        </div>

        {/* Horário disponível */}
        <div className="form-field">
          <label>Horário disponível</label>
          <input type="text" placeholder="Ex: 11:00-20:00" value={form.horario_disponivel || ""}
            onChange={e => set("horario_disponivel", e.target.value)} />
        </div>

        {/* Descrição */}
        <div className="form-field" style={{ gridColumn: "1/-1" }}>
          <label>Descrição *</label>
          <textarea placeholder="Descreva ingredientes, porção, etc." value={form.descricao}
            onChange={e => set("descricao", e.target.value)}
            style={{ minHeight: 80, resize: "vertical" }}
            className={errors.descricao ? "input-error" : ""}
            aria-invalid={!!errors.descricao} />
          <FieldError msg={errors.descricao} />
        </div>

        {/* Imagem */}
        <div className="form-field" style={{ gridColumn: "1/-1" }}>
          <label>Imagem do produto</label>
          <div className="product-image-upload" onClick={() => fileRef.current?.click()}
            role="button" aria-label="Selecionar imagem do produto" tabIndex={0}
            onKeyDown={e => e.key === "Enter" && fileRef.current?.click()}>
            {preview && isSafeImageUrl(preview) ? (
              <>
                <img src={preview} alt="preview" className="product-image-preview" />
                <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 8 }}>Clique para trocar</p>
              </>
            ) : (
              <>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                  style={{ margin: "0 auto 8px", display: "block", color: "var(--text-3)" }}>
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-2)", marginBottom: 4 }}>
                  Clique para adicionar imagem
                </p>
                <p style={{ fontSize: 12, color: "var(--text-3)" }}>JPG, PNG ou WEBP — máx. 5 MB</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
            style={{ display: "none" }} onChange={handleImageFile} aria-hidden="true" />
          <input type="url" placeholder="Ou cole uma URL HTTPS da imagem"
            value={form.imagem_url?.startsWith("data:") ? "" : (form.imagem_url || "")}
            onChange={handleUrlChange}
            style={{ marginTop: 8, fontSize: 13 }}
            aria-label="URL da imagem (HTTPS)" />
          {imageErr && <p style={{ fontSize: 12, color: "#C9291A", marginTop: 4 }}>{imageErr}</p>}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
        {onClose && (
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
        )}
        <button type="button" className="btn-primary" onClick={handleSubmit}>
          {editingProduct ? "Salvar alterações" : "Criar produto"}
        </button>
      </div>
    </div>
  );
}
