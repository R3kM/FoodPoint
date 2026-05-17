// Dados mock alinhados ao schema da tabela `produtos` e view `vw_estoque`
export const MOCK_PRODUCTS = [
  /* Sabor Caseiro (id: 1) */
  { id: 1, vendedor_id: 1, categoria_id: null, nome: "Marmita Tradicional", descricao: "Arroz, feijão, carne grelhada e salada.", preco: 24.9, imagem_url: null, horario_disponivel: "11:00-20:00", quantidade_inicial: 50, quantidade_vendida: 12, alerta_estoque_baixo: 5, esgotado: 0, ativo: 1 },
  { id: 2, vendedor_id: 1, categoria_id: null, nome: "Marmita Fitness", descricao: "Frango grelhado, legumes e arroz integral.", preco: 29.9, imagem_url: null, horario_disponivel: "11:00-20:00", quantidade_inicial: 30, quantidade_vendida: 8, alerta_estoque_baixo: 5, esgotado: 0, ativo: 1 },
  { id: 3, vendedor_id: 1, categoria_id: null, nome: "Lasanha Caseira", descricao: "Lasanha artesanal com molho especial.", preco: 32.5, imagem_url: null, horario_disponivel: "11:00-20:00", quantidade_inicial: 20, quantidade_vendida: 18, alerta_estoque_baixo: 3, esgotado: 0, ativo: 1 },

  /* Doce Encanto (id: 2) */
  { id: 4, vendedor_id: 2, categoria_id: null, nome: "Brigadeiro Gourmet", descricao: "Brigadeiro artesanal feito com chocolate nobre.", preco: 4.5, imagem_url: null, horario_disponivel: null, quantidade_inicial: 100, quantidade_vendida: 40, alerta_estoque_baixo: 10, esgotado: 0, ativo: 1 },
  { id: 5, vendedor_id: 2, categoria_id: null, nome: "Bolo de Chocolate", descricao: "Fatia de bolo recheado com cobertura cremosa.", preco: 14.9, imagem_url: null, horario_disponivel: null, quantidade_inicial: 25, quantidade_vendida: 5, alerta_estoque_baixo: 3, esgotado: 0, ativo: 1 },
  { id: 6, vendedor_id: 2, categoria_id: null, nome: "Cheesecake", descricao: "Cheesecake com calda de frutas vermelhas.", preco: 18.9, imagem_url: null, horario_disponivel: null, quantidade_inicial: 15, quantidade_vendida: 15, alerta_estoque_baixo: 3, esgotado: 1, ativo: 1 },

  /* Pastel do Bairro (id: 3) */
  { id: 7, vendedor_id: 3, categoria_id: null, nome: "Pastel de Carne", descricao: "Pastel recheado com carne temperada.", preco: 11.9, imagem_url: null, horario_disponivel: null, quantidade_inicial: 80, quantidade_vendida: 10, alerta_estoque_baixo: 5, esgotado: 0, ativo: 1 },
  { id: 8, vendedor_id: 3, categoria_id: null, nome: "Pastel de Queijo", descricao: "Pastel crocante recheado com queijo.", preco: 10.9, imagem_url: null, horario_disponivel: null, quantidade_inicial: 80, quantidade_vendida: 20, alerta_estoque_baixo: 5, esgotado: 0, ativo: 1 },
  { id: 9, vendedor_id: 3, categoria_id: null, nome: "Pastel Especial", descricao: "Pastel completo com carne, queijo e bacon.", preco: 16.5, imagem_url: null, horario_disponivel: null, quantidade_inicial: 40, quantidade_vendida: 5, alerta_estoque_baixo: 5, esgotado: 0, ativo: 1 },

  /* Lanches Prime (id: 4) */
  { id: 10, vendedor_id: 4, categoria_id: null, nome: "Hambúrguer Artesanal", descricao: "Pão brioche, hambúrguer bovino e cheddar.", preco: 34.9, imagem_url: null, horario_disponivel: null, quantidade_inicial: 60, quantidade_vendida: 15, alerta_estoque_baixo: 5, esgotado: 0, ativo: 1 },
  { id: 11, vendedor_id: 4, categoria_id: null, nome: "Combo Prime", descricao: "Hambúrguer, fritas e refrigerante.", preco: 44.9, imagem_url: null, horario_disponivel: null, quantidade_inicial: 40, quantidade_vendida: 8, alerta_estoque_baixo: 5, esgotado: 0, ativo: 1 },
  { id: 12, vendedor_id: 4, categoria_id: null, nome: "Batata Suprema", descricao: "Batata frita com cheddar e bacon.", preco: 22.9, imagem_url: null, horario_disponivel: null, quantidade_inicial: 50, quantidade_vendida: 2, alerta_estoque_baixo: 5, esgotado: 0, ativo: 1 },

  /* Gelato Tropical (id: 5) */
  { id: 13, vendedor_id: 5, categoria_id: null, nome: "Sorvete de Morango", descricao: "Sorvete artesanal sabor morango.", preco: 13.9, imagem_url: null, horario_disponivel: null, quantidade_inicial: 30, quantidade_vendida: 5, alerta_estoque_baixo: 3, esgotado: 0, ativo: 1 },
  { id: 14, vendedor_id: 5, categoria_id: null, nome: "Taça Tropical", descricao: "Taça de sorvete com frutas frescas.", preco: 19.9, imagem_url: null, horario_disponivel: null, quantidade_inicial: 20, quantidade_vendida: 3, alerta_estoque_baixo: 3, esgotado: 0, ativo: 1 },
  { id: 15, vendedor_id: 5, categoria_id: null, nome: "Milkshake Cremoso", descricao: "Milkshake artesanal com chantilly.", preco: 17.5, imagem_url: null, horario_disponivel: null, quantidade_inicial: 25, quantidade_vendida: 25, alerta_estoque_baixo: 3, esgotado: 1, ativo: 1 },

  /* Café da Praça (id: 6) */
  { id: 16, vendedor_id: 6, categoria_id: null, nome: "Cappuccino Especial", descricao: "Cappuccino cremoso com canela.", preco: 12.9, imagem_url: null, horario_disponivel: "07:00-19:00", quantidade_inicial: 999, quantidade_vendida: 0, alerta_estoque_baixo: 0, esgotado: 0, ativo: 1 },
  { id: 17, vendedor_id: 6, categoria_id: null, nome: "Café Gelado", descricao: "Café gelado com leite e caramelo.", preco: 14.5, imagem_url: null, horario_disponivel: "07:00-19:00", quantidade_inicial: 999, quantidade_vendida: 0, alerta_estoque_baixo: 0, esgotado: 0, ativo: 1 },
  { id: 18, vendedor_id: 6, categoria_id: null, nome: "Suco Natural", descricao: "Suco natural feito na hora.", preco: 11.9, imagem_url: null, horario_disponivel: "07:00-19:00", quantidade_inicial: 999, quantidade_vendida: 0, alerta_estoque_baixo: 0, esgotado: 0, ativo: 1 },
];
