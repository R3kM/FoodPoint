/**
 * FoodPoint API Service
 * ─────────────────────
 * Todas as chamadas à API estão centralizadas aqui.
 *
 * Para conectar ao backend MySQL:
 *   1. Defina VITE_API_URL no seu .env (ex: http://localhost:3001/api)
 *   2. Mude USE_MOCK para false
 *
 * Rotas esperadas no backend — todas documentadas por função abaixo.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// false = usa o backend real; true = dados mock locais
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== "false";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function request(method, path, body = null) {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    const token = sessionStorage.getItem("fp_token");
    if (token) options.headers["Authorization"] = `Bearer ${token}`;

    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${BASE_URL}${path}`, options);

    // Sessão expirada — limpa token e recarrega
    if (res.status === 401) {
      sessionStorage.removeItem("fp_token");
      sessionStorage.removeItem("fp_user");
      window.location.reload();
      return { data: null, error: "Sessão expirada. Faça login novamente." };
    }

    const json = await res.json();
    if (!res.ok) return { data: null, error: json.message || "Erro desconhecido." };
    return { data: json, error: null };
  } catch (err) {
    return { data: null, error: "Sem conexão com o servidor." };
  }
}

const get  = (path)       => request("GET",    path);
const post = (path, body) => request("POST",   path, body);
const put  = (path, body) => request("PUT",    path, body);
const del  = (path)       => request("DELETE", path);

// ─── Auth ─────────────────────────────────────────────────────────────────────
// POST /auth/login       { email, senha, tipo: "client"|"seller" }  → { user, token }
// POST /auth/register/client  { nome, cpf, telefone, email, senha, cidade, uf }
// POST /auth/register/seller  { nome_responsavel, cpf_cnpj, tipo_documento, nome_empresa,
//                               tipo_negocio, telefone, email, bairro, cidade, uf,
//                               instagram, chave_pix, tipo_chave_pix, descricao_loja, senha }

export async function login({ email, senha, tipo }) {
  if (USE_MOCK) {
    return {
      data: {
        id: 99,
        email,
        tipo,
        nome: tipo === "client" ? "Cliente Teste" : undefined,
        nome_empresa: tipo === "seller" ? "Minha Loja" : undefined,
        plano: "gratuito",
      },
      error: null,
    };
  }
  const { data, error } = await post("/auth/login", { email, senha, tipo });
  if (data?.token) sessionStorage.setItem("fp_token", data.token);
  return { data: data?.user || null, error };
}

export async function registerClient(data) {
  if (USE_MOCK) return { data: { id: Date.now(), tipo: "client", ...data }, error: null };
  const { data: res, error } = await post("/auth/register/client", data);
  if (res?.token) sessionStorage.setItem("fp_token", res.token);
  return { data: res?.user || null, error };
}

export async function registerSeller(data) {
  if (USE_MOCK) return { data: { id: Date.now(), tipo: "seller", ...data }, error: null };
  const { data: res, error } = await post("/auth/register/seller", data);
  if (res?.token) sessionStorage.setItem("fp_token", res.token);
  return { data: res?.user || null, error };
}

// ─── Vendedores ───────────────────────────────────────────────────────────────
// GET  /vendedores?tipo_negocio=&search=   → vendedor[]
// GET  /vendedores/:id                     → vendedor
// PUT  /vendedores/:id                     { nome_empresa, telefone, ... } → vendedor

export async function getSellers({ tipo_negocio, search } = {}) {
  if (USE_MOCK) {
    const { MOCK_SELLERS } = await import("../data/mockSellers");
    return { data: MOCK_SELLERS, error: null };
  }
  const params = new URLSearchParams();
  if (tipo_negocio) params.set("tipo_negocio", tipo_negocio);
  if (search)       params.set("search", search);
  return get(`/vendedores?${params}`);
}

export async function getSellerById(id) {
  if (USE_MOCK) {
    const { MOCK_SELLERS } = await import("../data/mockSellers");
    return { data: MOCK_SELLERS.find(s => s.id === id) || null, error: null };
  }
  return get(`/vendedores/${id}`);
}

export async function updateSeller(id, data) {
  if (USE_MOCK) return { data: { id, ...data }, error: null };
  return put(`/vendedores/${id}`, data);
}

// ─── Produtos ─────────────────────────────────────────────────────────────────
// GET    /produtos?vendedor_id=   → produto[] (com status de estoque via vw_estoque)
// POST   /produtos                { vendedor_id, categoria_id, nome, descricao, preco,
//                                   imagem_url, quantidade_inicial, alerta_estoque_baixo }
// PUT    /produtos/:id            { nome, descricao, preco, imagem_url, quantidade_inicial,
//                                   alerta_estoque_baixo, ativo }
// DELETE /produtos/:id

export async function getProducts({ vendedor_id } = {}) {
  if (USE_MOCK) {
    const { MOCK_PRODUCTS } = await import("../data/mockProducts");
    const data = vendedor_id
      ? MOCK_PRODUCTS.filter(p => p.vendedor_id === vendedor_id && p.ativo)
      : MOCK_PRODUCTS.filter(p => p.ativo);
    return { data, error: null };
  }
  const params = new URLSearchParams();
  if (vendedor_id) params.set("vendedor_id", vendedor_id);
  return get(`/produtos?${params}`);
}

export async function createProduct(data) {
  if (USE_MOCK) return { data: { id: Date.now(), ativo: 1, esgotado: 0, quantidade_vendida: 0, ...data }, error: null };
  return post("/produtos", data);
}

export async function updateProduct(id, data) {
  if (USE_MOCK) return { data: { id, ...data }, error: null };
  return put(`/produtos/${id}`, data);
}

export async function deleteProduct(id) {
  if (USE_MOCK) return { data: { success: true }, error: null };
  return del(`/produtos/${id}`);
}

// ─── Pedidos ──────────────────────────────────────────────────────────────────
// POST /pedidos
//   Body: {
//     cliente_id, vendedor_id,
//     tipo_entrega: "retirada",        -- único valor aceito
//     horario_retirada,                -- DATETIME opcional
//     total,
//     observacoes,
//     metodo_pagamento: "pix"|"cartao_credito"|"cartao_debito"|"dinheiro",
//     itens: [{ produto_id, quantidade, preco_unitario }]
//   }
//   → { pedido, pagamento }
//
// GET /pedidos?vendedor_id=   → pedido[]
// GET /pedidos?cliente_id=    → pedido[]
// PUT /pedidos/:id/status     { status: "confirmado"|"em_preparo"|"pronto_retirada"|"entregue"|"cancelado" }

export async function createOrder(data) {
  const payload = { ...data, tipo_entrega: "retirada" };
  if (USE_MOCK) return { data: { id: Date.now(), status: "pendente", ...payload }, error: null };
  return post("/pedidos", payload);
}

export async function getSellerOrders(vendedor_id) {
  if (USE_MOCK) return { data: [], error: null };
  return get(`/pedidos?vendedor_id=${vendedor_id}`);
}

export async function getClientOrders(cliente_id) {
  if (USE_MOCK) return { data: [], error: null };
  return get(`/pedidos?cliente_id=${cliente_id}`);
}

export async function updateOrderStatus(id, status) {
  if (USE_MOCK) return { data: { id, status }, error: null };
  return put(`/pedidos/${id}/status`, { status });
}

// ─── Conversas / Chat ─────────────────────────────────────────────────────────
// POST /conversas                       { cliente_id, vendedor_id } → conversa
// GET  /conversas?cliente_id=           → conversa[] (para o cliente listar seus chats)
// GET  /conversas?vendedor_id=          → conversa[] (para o vendedor listar seus chats)
// GET  /conversas/:id/mensagens         → mensagem[]
// POST /mensagens                       { conversa_id, remetente_tipo, remetente_id, conteudo }

export async function getOrCreateConversation(cliente_id, vendedor_id) {
  if (USE_MOCK) return { data: { id: Date.now(), cliente_id, vendedor_id }, error: null };
  return post("/conversas", { cliente_id, vendedor_id });
}

export async function getConversations({ cliente_id, vendedor_id } = {}) {
  if (USE_MOCK) return { data: [], error: null };
  const params = new URLSearchParams();
  if (cliente_id)  params.set("cliente_id", cliente_id);
  if (vendedor_id) params.set("vendedor_id", vendedor_id);
  return get(`/conversas?${params}`);
}

export async function sendMessage(data) {
  if (USE_MOCK) return { data: { id: Date.now(), lida: 0, enviado_em: new Date().toISOString(), ...data }, error: null };
  return post("/mensagens", data);
}

export async function getMessages(conversa_id) {
  if (USE_MOCK) return { data: [], error: null };
  return get(`/conversas/${conversa_id}/mensagens`);
}

// ─── Avaliações ───────────────────────────────────────────────────────────────
// POST /avaliacoes { cliente_id, vendedor_id, pedido_id, estrelas, comentario }
// GET  /avaliacoes?vendedor_id=  → avaliacao[]

export async function createReview(data) {
  if (USE_MOCK) return { data: { id: Date.now(), ...data }, error: null };
  return post("/avaliacoes", data);
}

export async function getReviews(vendedor_id) {
  if (USE_MOCK) return { data: [], error: null };
  return get(`/avaliacoes?vendedor_id=${vendedor_id}`);
}
