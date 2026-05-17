import { useState } from "react";
import "./AuthScreen.css";
import FieldError from "../common/FieldError";
import { validateLogin, validateClientRegister, validateSellerRegister, hasErrors } from "../../utils/validate";

// Máscara simples para CPF e CNPJ
function maskCpfCnpj(value, tipo) {
  const d = value.replace(/\D/g, "");
  if (tipo === "CPF") {
    return d.slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return d.slice(0, 14)
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function maskPhone(v) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10)
    return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

const F = ({ label, error, children }) => (
  <div className="auth-field">
    <label>{label}</label>
    {children}
    <FieldError msg={error} />
  </div>
);

export default function AuthScreen({ onLogin, onRegister, loading }) {
  const [mode, setMode]               = useState("login");
  const [accountType, setAccountType] = useState("client");
  const [errors, setErrors]           = useState({});

  const [loginData, setLoginData] = useState({ email: "", senha: "" });
  const setL = (k, v) => { setLoginData(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  const [clientData, setClientData] = useState({
    nome: "", cpf: "", telefone: "", email: "", senha: "", confirma_senha: "",
    cidade: "", uf: "",
  });
  const setC = (k, v) => { setClientData(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  const [sellerData, setSellerData] = useState({
    nome_responsavel: "", cpf_cnpj: "", tipo_documento: "CPF",
    telefone: "", email: "", nome_empresa: "", tipo_negocio: "outro",
    descricao_loja: "", bairro: "", cidade: "", uf: "",
    instagram: "", chave_pix: "", tipo_chave_pix: "cpf", senha: "", confirma_senha: "",
  });
  const setS = (k, v) => { setSellerData(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = validateLogin(loginData);
    if (hasErrors(errs)) { setErrors(errs); return; }
    await onLogin({ ...loginData, tipo: accountType });
  };

  const handleClientRegister = async (e) => {
    e.preventDefault();
    const errs = validateClientRegister(clientData);
    if (hasErrors(errs)) { setErrors(errs); return; }
    // Nunca enviar confirma_senha ao backend
    const { confirma_senha, ...payload } = clientData;
    await onRegister({ ...payload, tipo: "client" });
  };

  const handleSellerRegister = async (e) => {
    e.preventDefault();
    const errs = validateSellerRegister(sellerData);
    if (hasErrors(errs)) { setErrors(errs); return; }
    const { confirma_senha, ...payload } = sellerData;
    await onRegister({ ...payload, tipo: "seller" });
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-brand-logo">Food<span>Point</span></div>
          <p className="auth-brand-sub">Plataforma para clientes e empreendedores locais</p>
        </div>

        <div className="auth-type-selector">
          <button
            className={`auth-type-btn ${accountType === "client" ? "active" : ""}`}
            onClick={() => { setAccountType("client"); setErrors({}); }}
          >
            <svg className="auth-type-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="auth-type-title">Sou cliente</span>
            <span className="auth-type-desc">Quero descobrir e comprar de vendedores locais</span>
          </button>
          <button
            className={`auth-type-btn ${accountType === "seller" ? "active" : ""}`}
            onClick={() => { setAccountType("seller"); setErrors({}); }}
          >
            <svg className="auth-type-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="auth-type-title">Sou empreendedor</span>
            <span className="auth-type-desc">Quero vender meus produtos na plataforma</span>
          </button>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button className={`auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => { setMode("login"); setErrors({}); }}>Entrar</button>
            <button className={`auth-tab ${mode === "register" ? "active" : ""}`}
              onClick={() => { setMode("register"); setErrors({}); }}>Criar conta</button>
          </div>

          {/* ── LOGIN ── */}
          {mode === "login" && (
            <form className="auth-form" onSubmit={handleLogin} noValidate>
              <F label="E-mail" error={errors.email}>
                <input type="email" placeholder="seu@email.com" value={loginData.email}
                  onChange={e => setL("email", e.target.value)}
                  className={errors.email ? "input-error" : ""} />
              </F>
              <F label="Senha" error={errors.senha}>
                <input type="password" placeholder="••••••••" value={loginData.senha}
                  onChange={e => setL("senha", e.target.value)}
                  className={errors.senha ? "input-error" : ""} />
              </F>
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Entrando…" : "Entrar na plataforma"}
              </button>
            </form>
          )}

          {/* ── CADASTRO CLIENTE ── */}
          {mode === "register" && accountType === "client" && (
            <form className="auth-form" onSubmit={handleClientRegister} noValidate>
              <p className="auth-section-label">Dados pessoais</p>
              <div className="auth-form-grid">
                <F label="Nome completo *" error={errors.nome}>
                  <input type="text" placeholder="João Silva" value={clientData.nome}
                    onChange={e => setC("nome", e.target.value)}
                    className={errors.nome ? "input-error" : ""} />
                </F>
                <F label="CPF" error={errors.cpf}>
                  <input type="text" placeholder="000.000.000-00" value={clientData.cpf}
                    onChange={e => setC("cpf", maskCpfCnpj(e.target.value, "CPF"))}
                    className={errors.cpf ? "input-error" : ""} maxLength={14} />
                </F>
                <F label="Telefone *" error={errors.telefone}>
                  <input type="text" placeholder="(11) 99999-9999" value={clientData.telefone}
                    onChange={e => setC("telefone", maskPhone(e.target.value))}
                    className={errors.telefone ? "input-error" : ""} maxLength={15} />
                </F>
                <F label="E-mail *" error={errors.email}>
                  <input type="email" placeholder="seu@email.com" value={clientData.email}
                    onChange={e => setC("email", e.target.value)}
                    className={errors.email ? "input-error" : ""} />
                </F>
              </div>
              <div className="auth-divider" />
              <p className="auth-section-label">Localização</p>
              <div className="auth-form-grid">
                <F label="Cidade">
                  <input type="text" placeholder="São Paulo" value={clientData.cidade}
                    onChange={e => setC("cidade", e.target.value)} />
                </F>
                <F label="UF">
                  <input type="text" placeholder="SP" maxLength={2} value={clientData.uf}
                    onChange={e => setC("uf", e.target.value.toUpperCase())} />
                </F>
              </div>
              <div className="auth-divider" />
              <p className="auth-section-label">Acesso</p>
              <div className="auth-form-grid">
                <F label="Senha *" error={errors.senha}>
                  <input type="password" placeholder="Mínimo 6 caracteres" value={clientData.senha}
                    onChange={e => setC("senha", e.target.value)}
                    className={errors.senha ? "input-error" : ""} />
                </F>
                <F label="Confirmar senha *" error={errors.confirma_senha}>
                  <input type="password" placeholder="Repita a senha" value={clientData.confirma_senha}
                    onChange={e => setC("confirma_senha", e.target.value)}
                    className={errors.confirma_senha ? "input-error" : ""} />
                </F>
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Criando conta…" : "Criar conta de cliente"}
              </button>
            </form>
          )}

          {/* ── CADASTRO VENDEDOR ── */}
          {mode === "register" && accountType === "seller" && (
            <form className="auth-form" onSubmit={handleSellerRegister} noValidate>
              <p className="auth-section-label">Responsável</p>
              <div className="auth-form-grid">
                <F label="Nome do responsável *" error={errors.nome_responsavel}>
                  <input type="text" placeholder="Maria Santos" value={sellerData.nome_responsavel}
                    onChange={e => setS("nome_responsavel", e.target.value)}
                    className={errors.nome_responsavel ? "input-error" : ""} />
                </F>
                <F label="Tipo de documento">
                  <select value={sellerData.tipo_documento}
                    onChange={e => { setS("tipo_documento", e.target.value); setS("cpf_cnpj", ""); }}>
                    <option value="CPF">CPF</option>
                    <option value="CNPJ">CNPJ</option>
                  </select>
                </F>
                <F label={`${sellerData.tipo_documento}`} error={errors.cpf_cnpj}>
                  <input type="text"
                    placeholder={sellerData.tipo_documento === "CPF" ? "000.000.000-00" : "00.000.000/0001-00"}
                    value={sellerData.cpf_cnpj}
                    onChange={e => setS("cpf_cnpj", maskCpfCnpj(e.target.value, sellerData.tipo_documento))}
                    maxLength={sellerData.tipo_documento === "CPF" ? 14 : 18}
                    className={errors.cpf_cnpj ? "input-error" : ""} />
                </F>
              </div>
              <div className="auth-divider" />
              <p className="auth-section-label">Negócio</p>
              <div className="auth-form-grid">
                <F label="Nome da empresa *" error={errors.nome_empresa}>
                  <input type="text" placeholder="Delícias da Maria" value={sellerData.nome_empresa}
                    onChange={e => setS("nome_empresa", e.target.value)}
                    className={errors.nome_empresa ? "input-error" : ""} />
                </F>
                <F label="Tipo de negócio">
                  <select value={sellerData.tipo_negocio} onChange={e => setS("tipo_negocio", e.target.value)}>
                    <option value="salgados">Salgados</option>
                    <option value="marmita">Marmitas</option>
                    <option value="doces">Doces</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="pastelaria">Pastelaria</option>
                    <option value="lanches">Lanches</option>
                    <option value="sorvetes">Sorvetes</option>
                    <option value="outro">Outro</option>
                  </select>
                </F>
                <F label="Telefone *" error={errors.telefone}>
                  <input type="text" placeholder="(11) 99999-9999" value={sellerData.telefone}
                    onChange={e => setS("telefone", maskPhone(e.target.value))}
                    className={errors.telefone ? "input-error" : ""} maxLength={15} />
                </F>
                <F label="E-mail *" error={errors.email}>
                  <input type="email" placeholder="contato@loja.com" value={sellerData.email}
                    onChange={e => setS("email", e.target.value)}
                    className={errors.email ? "input-error" : ""} />
                </F>
                <F label="Bairro *" error={errors.bairro}>
                  <input type="text" placeholder="Centro" value={sellerData.bairro}
                    onChange={e => setS("bairro", e.target.value)}
                    className={errors.bairro ? "input-error" : ""} />
                </F>
                <F label="Cidade *" error={errors.cidade}>
                  <input type="text" placeholder="São Paulo" value={sellerData.cidade}
                    onChange={e => setS("cidade", e.target.value)}
                    className={errors.cidade ? "input-error" : ""} />
                </F>
                <F label="UF *" error={errors.uf}>
                  <input type="text" placeholder="SP" maxLength={2} value={sellerData.uf}
                    onChange={e => setS("uf", e.target.value.toUpperCase())}
                    className={errors.uf ? "input-error" : ""} />
                </F>
                <F label="Instagram">
                  <input type="text" placeholder="@minhaloja" value={sellerData.instagram}
                    onChange={e => setS("instagram", e.target.value)} />
                </F>
                <F label="Tipo de chave PIX">
                  <select value={sellerData.tipo_chave_pix} onChange={e => setS("tipo_chave_pix", e.target.value)}>
                    <option value="cpf">CPF</option>
                    <option value="cnpj">CNPJ</option>
                    <option value="email">E-mail</option>
                    <option value="telefone">Telefone</option>
                    <option value="aleatoria">Chave aleatória</option>
                  </select>
                </F>
                <F label="Chave PIX">
                  <input type="text" placeholder="CPF, e-mail, telefone…" value={sellerData.chave_pix}
                    onChange={e => setS("chave_pix", e.target.value)} />
                </F>
              </div>
              <F label="Descrição da loja">
                <textarea placeholder="Conte um pouco sobre o seu negócio…" rows={3}
                  value={sellerData.descricao_loja} onChange={e => setS("descricao_loja", e.target.value)} />
              </F>
              <div className="auth-divider" />
              <p className="auth-section-label">Acesso</p>
              <div className="auth-form-grid">
                <F label="Senha *" error={errors.senha}>
                  <input type="password" placeholder="Mínimo 6 caracteres" value={sellerData.senha}
                    onChange={e => setS("senha", e.target.value)}
                    className={errors.senha ? "input-error" : ""} />
                </F>
                <F label="Confirmar senha *" error={errors.confirma_senha}>
                  <input type="password" placeholder="Repita a senha" value={sellerData.confirma_senha}
                    onChange={e => setS("confirma_senha", e.target.value)}
                    className={errors.confirma_senha ? "input-error" : ""} />
                </F>
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Criando conta…" : "Criar conta de empreendedor"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
