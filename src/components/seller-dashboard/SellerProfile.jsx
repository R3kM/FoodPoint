import { useState } from "react";

const FF = ({ label, children }) => (
  <div className="form-field">
    <label>{label}</label>
    {children}
  </div>
);

export default function SellerProfile({ seller, onUpdateProfile, onDeleteAccount }) {
  const [form, setForm] = useState(seller || {});
  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(form);
  };

  return (
    <div>
      <div className="dashboard-page-header">
        <h1 className="dashboard-page-title">Perfil</h1>
        <p className="dashboard-page-sub">Mantenha suas informações atualizadas.</p>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="dashboard-card-title">Informações da loja</h2>
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="profile-form-grid">
            <FF label="Nome da empresa">
              <input type="text" value={form.nome_empresa||""} onChange={e => set("nome_empresa", e.target.value)} />
            </FF>
            <FF label="Telefone">
              <input type="text" value={form.telefone||""} onChange={e => set("telefone", e.target.value)} />
            </FF>
            <FF label="Instagram">
              <input type="text" value={form.instagram||""} placeholder="@minhaloja" onChange={e => set("instagram", e.target.value)} />
            </FF>
            <FF label="Chave PIX">
              <input type="text" value={form.chave_pix||""} onChange={e => set("chave_pix", e.target.value)} />
            </FF>
          </div>

          <FF label="Descrição da loja">
            <textarea value={form.descricao_loja||""} rows={4} onChange={e => set("descricao_loja", e.target.value)} />
          </FF>

          <div style={{display:"flex",gap:12,justifyContent:"space-between",paddingTop:8}}>
            <button type="button" className="btn-danger" onClick={onDeleteAccount}>
              Excluir conta
            </button>
            <button type="submit" className="btn-primary">Salvar alterações</button>
          </div>
        </form>
      </div>
    </div>
  );
}
