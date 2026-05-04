import { useState } from "react";
import "./AuthPage.css";

const API_BASE = "http://localhost:3001";

async function apiPost(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erro desconhecido");
  return data;
}


const clienteLoginInit = { email: "", senha: "" };
const vendedorLoginInit = { email: "", senha: "" };

const clienteCadastroInit = {
  nome: "", cpf: "", telefone: "", email: "", senha: "",
  logradouro: "", numero: "", complemento: "",
  bairro: "", cidade: "", uf: "", cep: "",
};

const vendedorCadastroInit = {
  nome_responsavel: "", tipo_documento: "CPF", cpf_cnpj: "",
  telefone: "", email: "", senha: "",
  nome_empresa: "", tipo_negocio: "salgados",
  logradouro: "", numero: "", complemento: "",
  bairro: "", cidade: "", uf: "", cep: "",
  tipo_chave_pix: "", chave_pix: "",
};

function Field({ label, type = "text", value, onChange, optional }) {
  return (
    <div className="field">
      <label className="label">
        {label} {optional && <span>(opcional)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="input"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      <select value={value} onChange={onChange} className="input">
        {options.map(o => (
          <option key={o.v} value={o.v}>{o.l}</option>
        ))}
      </select>
    </div>
  );
}

function LoginForm({ userType, onSubmit, loading }) {
  const [form, setForm] = useState(
    userType === "cliente" ? clienteLoginInit : vendedorLoginInit
  );

  const set = key => e => setForm(p => ({ ...p, [key]: e.target.value }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <Field label="E-mail" type="email" value={form.email} onChange={set("email")} />
      <Field label="Senha" type="password" value={form.senha} onChange={set("senha")} />

      <button className="btn" disabled={loading}>
        {loading ? "Verificando..." : "Entrar"}
      </button>
    </form>
  );
}

function CadastroCliente({ onSubmit, loading }) {
  const [form, setForm] = useState(clienteCadastroInit);
  const set = key => e => setForm(p => ({ ...p, [key]: e.target.value }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <Field label="Nome completo" value={form.nome} onChange={set("nome")} />
      <Field label="CPF" value={form.cpf} onChange={set("cpf")} />
      <Field label="Telefone" value={form.telefone} onChange={set("telefone")} />
      <Field label="E-mail" type="email" value={form.email} onChange={set("email")} />
      <Field label="Senha" type="password" value={form.senha} onChange={set("senha")} />

      <button className="btn" disabled={loading}>
        {loading ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}

function CadastroVendedor({ onSubmit, loading }) {
  const [form, setForm] = useState(vendedorCadastroInit);
  const set = key => e => setForm(p => ({ ...p, [key]: e.target.value }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(form); }}>
      <Field label="Nome responsável" value={form.nome_responsavel} onChange={set("nome_responsavel")} />

      <Select
        label="Tipo documento"
        value={form.tipo_documento}
        onChange={set("tipo_documento")}
        options={[
          { v: "CPF", l: "CPF" },
          { v: "CNPJ", l: "CNPJ" }
        ]}
      />

      <Field label="CPF/CNPJ" value={form.cpf_cnpj} onChange={set("cpf_cnpj")} />

      <button className="btn" disabled={loading}>
        {loading ? "Cadastrando..." : "Cadastrar"}
      </button>
    </form>
  );
}



export default function AuthPage() {
  const [userType, setUserType] = useState("cliente");
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSubmit(formData) {
    setLoading(true);
    setFeedback(null);

    try {
      const endpoint =
        mode === "login"
          ? userType === "cliente"
            ? "/auth/cliente/login"
            : "/auth/vendedor/login"
          : userType === "cliente"
            ? "/auth/cliente/cadastro"
            : "/auth/vendedor/cadastro";

      const data = await apiPost(endpoint, formData);

      if (data.token) {
        localStorage.setItem("fp_token", data.token);
      }

      setFeedback({
        type: "success",
        msg: mode === "login" ? "Login realizado!" : "Cadastro criado!"
      });

    } catch (err) {
      setFeedback({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="blob1" />
      <div className="blob2" />

      <div className="container">
        <div className="logoWrap">
          <span className="logo">
            Food<span style={{ color: "#f97316" }}>Point</span> 🍔
          </span>
          <div className="logoSub">Seu mercado local</div>
        </div>

        <div className="card">
          {/* Tipo */}
          <div className="typeTabs">
            {["cliente", "vendedor"].map(t => (
              <button
                key={t}
                onClick={() => setUserType(t)}
                className={`typeTab ${userType === t ? "typeTabActive" : ""}`}
              >
                {t}
              </button>
            ))}
          </div>

          {}
          <div className="modeWrap">
            <div className="modeTabs">
              {["login", "cadastro"].map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`modeTab ${mode === m ? "modeTabActive" : ""}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {}
          <div className="formWrap">
            <div className="formScroll">
              {mode === "login" && (
                <LoginForm userType={userType} onSubmit={handleSubmit} loading={loading} />
              )}

              {mode === "cadastro" && userType === "cliente" && (
                <CadastroCliente onSubmit={handleSubmit} loading={loading} />
              )}

              {mode === "cadastro" && userType === "vendedor" && (
                <CadastroVendedor onSubmit={handleSubmit} loading={loading} />
              )}
            </div>

            {feedback && (
              <div className={`feedback ${feedback.type === "success" ? "feedbackOk" : "feedbackErr"}`}>
                {feedback.msg}
              </div>
            )}

            <div className="hint">
              {mode === "login" ? (
                <>
                  Não tem conta?{" "}
                  <span className="hintLink" onClick={() => setMode("cadastro")}>
                    Cadastre-se
                  </span>
                </>
              ) : (
                <>
                  Já tem conta?{" "}
                  <span className="hintLink" onClick={() => setMode("login")}>
                    Entrar
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}