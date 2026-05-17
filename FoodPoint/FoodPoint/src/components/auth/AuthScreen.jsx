import { useState } from "react";

import "./AuthScreen.css";

export default function AuthScreen({
  onLogin,
  onRegister,
}) {
  const [mode, setMode] =
    useState("login");

  const [accountType, setAccountType] =
    useState("client");

  const [loginData, setLoginData] =
    useState({
      email: "",
      senha: "",
    });

  const [clientData, setClientData] =
    useState({
      nome: "",
      cpf: "",
      telefone: "",
      email: "",
      senha: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
    });

  const [sellerData, setSellerData] =
    useState({
      nome_responsavel: "",
      cpf_cnpj: "",
      tipo_documento: "CPF",
      telefone: "",
      email: "",
      nome_empresa: "",
      tipo_negocio: "outro",
      descricao_loja: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
      instagram: "",
      whatsapp_link: "",
      chave_pix: "",
      tipo_chave_pix: "cpf",
      senha: "",
    });

  const handleLogin = (e) => {
    e.preventDefault();

    onLogin({
      id: Date.now(),

      tipo: accountType,

      email: loginData.email,

      nome:
        accountType === "client"
          ? "Cliente"
          : undefined,

      nome_empresa:
        accountType === "seller"
          ? "Minha Loja"
          : undefined,
    });
  };

  const handleClientRegister = (
    e
  ) => {
    e.preventDefault();

    onRegister({
      id: Date.now(),

      tipo: "client",

      ...clientData,
    });
  };

  const handleSellerRegister = (
    e
  ) => {
    e.preventDefault();

    onRegister({
      id: Date.now(),

      tipo: "seller",

      ...sellerData,
    });
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>FoodPoint</h1>

          <p>
            Plataforma para clientes e
            empreendedores.
          </p>
        </div>

        <div className="account-switch">
          <button
            className={
              accountType ===
              "client"
                ? "active"
                : ""
            }
            onClick={() =>
              setAccountType(
                "client"
              )
            }
          >
            Cliente
          </button>

          <button
            className={
              accountType ===
              "seller"
                ? "active"
                : ""
            }
            onClick={() =>
              setAccountType(
                "seller"
              )
            }
          >
            Empreendedor
          </button>
        </div>

        <div className="auth-tabs">
          <button
            className={
              mode === "login"
                ? "active"
                : ""
            }
            onClick={() =>
              setMode("login")
            }
          >
            Entrar
          </button>

          <button
            className={
              mode ===
              "register"
                ? "active"
                : ""
            }
            onClick={() =>
              setMode(
                "register"
              )
            }
          >
            Cadastro
          </button>
        </div>

        {mode === "login" ? (
          <form
            className="auth-form"
            onSubmit={handleLogin}
          >
            <input
              type="email"
              placeholder="E-mail"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  email:
                    e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Senha"
              value={loginData.senha}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  senha:
                    e.target.value,
                })
              }
            />

            <button type="submit">
              Entrar
            </button>
          </form>
        ) : accountType ===
          "client" ? (
          <form
            className="auth-form"
            onSubmit={
              handleClientRegister
            }
          >
            <input
              type="text"
              placeholder="Nome"
              value={clientData.nome}
              onChange={(e) =>
                setClientData({
                  ...clientData,
                  nome:
                    e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="CPF"
              value={clientData.cpf}
              onChange={(e) =>
                setClientData({
                  ...clientData,
                  cpf:
                    e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Telefone"
              value={
                clientData.telefone
              }
              onChange={(e) =>
                setClientData({
                  ...clientData,
                  telefone:
                    e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="E-mail"
              value={
                clientData.email
              }
              onChange={(e) =>
                setClientData({
                  ...clientData,
                  email:
                    e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Senha"
              value={
                clientData.senha
              }
              onChange={(e) =>
                setClientData({
                  ...clientData,
                  senha:
                    e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Cidade"
              value={
                clientData.cidade
              }
              onChange={(e) =>
                setClientData({
                  ...clientData,
                  cidade:
                    e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="UF"
              value={clientData.uf}
              onChange={(e) =>
                setClientData({
                  ...clientData,
                  uf:
                    e.target.value,
                })
              }
            />

            <button type="submit">
              Criar Conta
            </button>
          </form>
        ) : (
          <form
            className="auth-form"
            onSubmit={
              handleSellerRegister
            }
          >
            <input
              type="text"
              placeholder="Nome do responsável"
              value={
                sellerData.nome_responsavel
              }
              onChange={(e) =>
                setSellerData({
                  ...sellerData,
                  nome_responsavel:
                    e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="CPF/CNPJ"
              value={
                sellerData.cpf_cnpj
              }
              onChange={(e) =>
                setSellerData({
                  ...sellerData,
                  cpf_cnpj:
                    e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Nome da empresa"
              value={
                sellerData.nome_empresa
              }
              onChange={(e) =>
                setSellerData({
                  ...sellerData,
                  nome_empresa:
                    e.target.value,
                })
              }
            />

            <select
              value={
                sellerData.tipo_negocio
              }
              onChange={(e) =>
                setSellerData({
                  ...sellerData,
                  tipo_negocio:
                    e.target.value,
                })
              }
            >
              <option value="outro">
                Outro
              </option>

              <option value="lanches">
                Lanches
              </option>

              <option value="doces">
                Doces
              </option>

              <option value="bebidas">
                Bebidas
              </option>

              <option value="pastelaria">
                Pastelaria
              </option>

              <option value="marmita">
                Marmita
              </option>
            </select>

            <textarea
              placeholder="Descrição da loja"
              value={
                sellerData.descricao_loja
              }
              onChange={(e) =>
                setSellerData({
                  ...sellerData,
                  descricao_loja:
                    e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Telefone"
              value={
                sellerData.telefone
              }
              onChange={(e) =>
                setSellerData({
                  ...sellerData,
                  telefone:
                    e.target.value,
                })
              }
            />

            <input
              type="email"
              placeholder="E-mail"
              value={
                sellerData.email
              }
              onChange={(e) =>
                setSellerData({
                  ...sellerData,
                  email:
                    e.target.value,
                })
              }
            />

            <input
              type="password"
              placeholder="Senha"
              value={
                sellerData.senha
              }
              onChange={(e) =>
                setSellerData({
                  ...sellerData,
                  senha:
                    e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Instagram"
              value={
                sellerData.instagram
              }
              onChange={(e) =>
                setSellerData({
                  ...sellerData,
                  instagram:
                    e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Chave PIX"
              value={
                sellerData.chave_pix
              }
              onChange={(e) =>
                setSellerData({
                  ...sellerData,
                  chave_pix:
                    e.target.value,
                })
              }
            />

            <button type="submit">
              Criar Conta
            </button>
          </form>
        )}
      </div>
    </main>
  );
}