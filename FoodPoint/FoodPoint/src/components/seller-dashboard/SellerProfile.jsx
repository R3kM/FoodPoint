import { useState } from "react";

export default function SellerProfile({
  seller,
  onUpdateProfile,
  onDeleteAccount,
}) {
  const [form, setForm] =
    useState(seller);

  const handleSubmit = (e) => {
    e.preventDefault();

    onUpdateProfile(form);
  };

  return (
    <section className="dashboard-card">
      <h2>Perfil</h2>

      <form
        className="product-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Nome da empresa"
          value={
            form.nome_empresa || ""
          }
          onChange={(e) =>
            setForm({
              ...form,
              nome_empresa:
                e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Telefone"
          value={
            form.telefone || ""
          }
          onChange={(e) =>
            setForm({
              ...form,
              telefone:
                e.target.value,
            })
          }
        />

        <textarea
          placeholder="Descrição"
          value={
            form.descricao_loja ||
            ""
          }
          onChange={(e) =>
            setForm({
              ...form,
              descricao_loja:
                e.target.value,
            })
          }
        />

        <button
          type="submit"
          className="primary-button"
        >
          Salvar Perfil
        </button>

        <button
          type="button"
          className="danger-button"
          onClick={
            onDeleteAccount
          }
        >
          Excluir Conta
        </button>
      </form>
    </section>
  );
}