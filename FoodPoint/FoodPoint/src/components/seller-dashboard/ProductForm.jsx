import { useState } from "react";

export default function ProductForm({
  onAddProduct,
}) {
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    quantidade: "",
    imagem: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    onAddProduct({
      id: Date.now(),

      ...form,

      preco: Number(form.preco),

      quantidade: Number(
        form.quantidade
      ),
    });

    setForm({
      nome: "",
      descricao: "",
      preco: "",
      quantidade: "",
      imagem: "",
    });
  };

  return (
    <form
      className="product-form"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Nome do produto"
        value={form.nome}
        onChange={(e) =>
          setForm({
            ...form,
            nome: e.target.value,
          })
        }
        required
      />

      <textarea
        placeholder="Descrição"
        value={form.descricao}
        onChange={(e) =>
          setForm({
            ...form,
            descricao: e.target.value,
          })
        }
        required
      />

      <input
        type="number"
        placeholder="Preço"
        value={form.preco}
        onChange={(e) =>
          setForm({
            ...form,
            preco: e.target.value,
          })
        }
        required
      />

      <input
        type="number"
        placeholder="Quantidade"
        value={form.quantidade}
        onChange={(e) =>
          setForm({
            ...form,
            quantidade:
              e.target.value,
          })
        }
        required
      />

      <input
        type="text"
        placeholder="URL da imagem"
        value={form.imagem}
        onChange={(e) =>
          setForm({
            ...form,
            imagem: e.target.value,
          })
        }
      />

      <button type="submit">
        Salvar Produto
      </button>
    </form>
  );
}