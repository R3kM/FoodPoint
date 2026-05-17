import { useState } from "react";
import "../client/ClientProfile.css";
import FieldError from "../common/FieldError";
import { updateSeller } from "../../services/api";

function maskPhone(v) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

function validate(data) {
  const e = {};
  if (!data.nome_empresa?.trim()) e.nome_empresa = "Nome da empresa é obrigatório.";
  if (!data.email?.trim())        e.email        = "E-mail é obrigatório.";
  else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = "E-mail inválido.";
  if (!data.telefone?.trim())     e.telefone     = "Telefone é obrigatório.";
  if (!data.bairro?.trim())       e.bairro       = "Bairro é obrigatório.";
  if (!data.cidade?.trim())       e.cidade       = "Cidade é obrigatória.";
  if (!data.uf?.trim())           e.uf           = "UF é obrigatório.";
  return e;
}

const DIAS = ["seg","ter","qua","qui","sex","sab","dom"];
const DIA_LABEL = { seg:"Seg",ter:"Ter",qua:"Qua",qui:"Qui",sex:"Sex",sab:"Sáb",dom:"Dom" };

export default function SellerProfileModal({ seller, onSave, onDelete, onClose }) {
  const [form,          setForm]    = useState({ ...seller });
  const [errors,        setErrors]  = useState({});
  const [confirmDelete, setConfirm] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  const setHorario = (dia, val) => {
    setForm(p => ({
      ...p,
      horario_funcionamento: { ...(p.horario_funcionamento || {}), [dia]: val },
    }));
  };

  const handleSave = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    // Sincroniza com o backend (silencioso em modo mock)
    await updateSeller(form.id, form);
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 680 }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Perfil da Loja</h2>
            <p className="modal-sub">Edite as informações do seu negócio</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Fechar modal">×</button>
        </div>

        <div className="modal-body">
          <div className="profile-grid">

            {/* Dados da empresa */}
            <div className="form-field" style={{ gridColumn: "1/-1" }}>
              <label>Nome da empresa *</label>
              <input type="text" value={form.nome_empresa || ""}
                onChange={e => set("nome_empresa", e.target.value)}
                className={errors.nome_empresa ? "input-error" : ""} />
              <FieldError msg={errors.nome_empresa} />
            </div>

            <div className="form-field">
              <label>Responsável</label>
              <input type="text" value={form.nome_responsavel || ""}
                onChange={e => set("nome_responsavel", e.target.value)} />
            </div>

            <div className="form-field">
              <label>Tipo de negócio</label>
              <select value={form.tipo_negocio || "outro"} onChange={e => set("tipo_negocio", e.target.value)}>
                <option value="salgados">Salgados</option>
                <option value="marmita">Marmitas</option>
                <option value="doces">Doces</option>
                <option value="bebidas">Bebidas</option>
                <option value="pastelaria">Pastelaria</option>
                <option value="lanches">Lanches</option>
                <option value="sorvetes">Sorvetes</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="form-field">
              <label>Telefone *</label>
              <input type="text" value={form.telefone || ""} maxLength={15}
                onChange={e => set("telefone", maskPhone(e.target.value))}
                className={errors.telefone ? "input-error" : ""} />
              <FieldError msg={errors.telefone} />
            </div>

            <div className="form-field">
              <label>E-mail *</label>
              <input type="email" value={form.email || ""}
                onChange={e => set("email", e.target.value)}
                className={errors.email ? "input-error" : ""} />
              <FieldError msg={errors.email} />
            </div>

            {/* Localização */}
            <div className="form-field">
              <label>Bairro *</label>
              <input type="text" value={form.bairro || ""}
                onChange={e => set("bairro", e.target.value)}
                className={errors.bairro ? "input-error" : ""} />
              <FieldError msg={errors.bairro} />
            </div>

            <div className="form-field">
              <label>Cidade *</label>
              <input type="text" value={form.cidade || ""}
                onChange={e => set("cidade", e.target.value)}
                className={errors.cidade ? "input-error" : ""} />
              <FieldError msg={errors.cidade} />
            </div>

            <div className="form-field">
              <label>UF *</label>
              <input type="text" maxLength={2} value={form.uf || ""}
                onChange={e => set("uf", e.target.value.toUpperCase())}
                className={errors.uf ? "input-error" : ""} />
              <FieldError msg={errors.uf} />
            </div>

            <div className="form-field">
              <label>CEP</label>
              <input type="text" value={form.cep || ""} maxLength={9} placeholder="00000-000"
                onChange={e => set("cep", e.target.value.replace(/\D/g, "").slice(0, 8))} />
            </div>

            {/* Redes sociais */}
            <div className="form-field">
              <label>Instagram</label>
              <input type="text" value={form.instagram || ""} placeholder="@minhaloja"
                onChange={e => set("instagram", e.target.value)} />
            </div>

            <div className="form-field">
              <label>Facebook</label>
              <input type="text" value={form.facebook || ""} placeholder="facebook.com/minhaloja"
                onChange={e => set("facebook", e.target.value)} />
            </div>

            <div className="form-field">
              <label>Link do WhatsApp</label>
              <input type="url" value={form.whatsapp_link || ""} placeholder="https://wa.me/55..."
                onChange={e => set("whatsapp_link", e.target.value)} />
            </div>

            {/* PIX */}
            <div className="form-field">
              <label>Tipo de chave PIX</label>
              <select value={form.tipo_chave_pix || "cpf"} onChange={e => set("tipo_chave_pix", e.target.value)}>
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
                <option value="email">E-mail</option>
                <option value="telefone">Telefone</option>
                <option value="aleatoria">Chave aleatória</option>
              </select>
            </div>

            <div className="form-field">
              <label>Chave PIX</label>
              <input type="text" value={form.chave_pix || ""}
                onChange={e => set("chave_pix", e.target.value)} />
            </div>

            {/* Tempo médio */}
            <div className="form-field">
              <label>Tempo médio de preparo (min)</label>
              <input type="number" min="0" value={form.tempo_medio_preparo || ""}
                onChange={e => set("tempo_medio_preparo", parseInt(e.target.value) || 0)} />
            </div>

            {/* Descrição */}
            <div className="form-field" style={{ gridColumn: "1/-1" }}>
              <label>Descrição</label>
              <textarea rows={3} value={form.descricao_loja || ""}
                onChange={e => set("descricao_loja", e.target.value)} />
            </div>

            {/* Horário de funcionamento (JSON) */}
            <div className="form-field" style={{ gridColumn: "1/-1" }}>
              <label>Horário de funcionamento</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                {DIAS.map(dia => (
                  <div key={dia} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", width: 30 }}>
                      {DIA_LABEL[dia]}
                    </span>
                    <input type="text" placeholder="fechado"
                      value={form.horario_funcionamento?.[dia] || ""}
                      onChange={e => setHorario(dia, e.target.value)}
                      style={{ fontSize: 13, flex: 1 }}
                      aria-label={`Horário de ${DIA_LABEL[dia]}`} />
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4, display: "block" }}>
                Formato: 08:00-18:00 ou "fechado"
              </span>
            </div>

          </div>
        </div>

        <div className="modal-footer">
          {!confirmDelete ? (
            <>
              <button className="btn-danger-soft" onClick={() => setConfirm(true)}>Excluir conta</button>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-ghost" onClick={onClose}>Cancelar</button>
                <button className="btn-save" onClick={handleSave}>Salvar</button>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontSize: 14, color: "var(--danger)", fontWeight: 600 }}>
                Tem certeza? Todos os seus dados e produtos serão removidos permanentemente.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
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
