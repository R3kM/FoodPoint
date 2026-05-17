import { useState } from "react";
import "./ClientProfile.css";
import FieldError from "../common/FieldError";

function validate(data) {
  const e = {};
  if (!data.nome?.trim())  e.nome  = "Nome é obrigatório.";
  if (!data.email?.trim()) e.email = "E-mail é obrigatório.";
  else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = "E-mail inválido.";
  return e;
}

export default function ClientProfile({ user, onSave, onDelete, onClose }) {
  const [form, setForm]             = useState({ ...user });
  const [errors, setErrors]         = useState({});
  const [confirmDelete, setConfirm] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  const handleSave = () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Meu Perfil</h2>
            <p className="modal-sub">Edite suas informações pessoais</p>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="profile-grid">
            <div className="form-field">
              <label>Nome completo *</label>
              <input type="text" value={form.nome || ""} onChange={e => set("nome", e.target.value)}
                className={errors.nome ? "input-error" : ""} />
              <FieldError msg={errors.nome} />
            </div>
            <div className="form-field">
              <label>CPF</label>
              <input type="text" value={form.cpf || ""} onChange={e => set("cpf", e.target.value)} />
            </div>
            <div className="form-field">
              <label>Telefone</label>
              <input type="text" value={form.telefone || ""} onChange={e => set("telefone", e.target.value)} />
            </div>
            <div className="form-field">
              <label>E-mail *</label>
              <input type="email" value={form.email || ""} onChange={e => set("email", e.target.value)}
                className={errors.email ? "input-error" : ""} />
              <FieldError msg={errors.email} />
            </div>
            <div className="form-field">
              <label>Cidade</label>
              <input type="text" value={form.cidade || ""} onChange={e => set("cidade", e.target.value)} />
            </div>
            <div className="form-field">
              <label>UF</label>
              <input type="text" value={form.uf || ""} maxLength={2} onChange={e => set("uf", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {!confirmDelete ? (
            <>
              <button className="btn-danger-soft" onClick={() => setConfirm(true)}>Excluir conta</button>
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn-ghost" onClick={onClose}>Cancelar</button>
                <button className="btn-save" onClick={handleSave}>Salvar</button>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize:14, color:"var(--danger)", fontWeight:600 }}>
                Tem certeza? Esta ação não pode ser desfeita.
              </p>
              <div style={{ display:"flex", gap:10 }}>
                <button className="btn-ghost" onClick={() => setConfirm(false)}>Cancelar</button>
                <button className="btn-danger-confirm" onClick={onDelete}>Confirmar exclusão</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
