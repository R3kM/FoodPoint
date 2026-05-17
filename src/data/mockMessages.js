// Mock alinhado ao schema: tabelas `conversas` + `mensagens`
export const MOCK_CONVERSATIONS = [
  { id: 1, cliente_id: 99, vendedor_id: 1, criado_em: "2026-05-17T10:00:00" },
];

export const MOCK_MESSAGES = [
  {
    id: 1,
    conversa_id: 1,
    remetente_tipo: "cliente",
    remetente_id: 99,
    conteudo: "Olá, gostaria de saber mais sobre os produtos.",
    lida: 1,
    enviado_em: "2026-05-17T10:01:00",
  },
  {
    id: 2,
    conversa_id: 1,
    remetente_tipo: "vendedor",
    remetente_id: 1,
    conteudo: "Olá! Claro, qual produto te interessa?",
    lida: 1,
    enviado_em: "2026-05-17T10:02:00",
  },
];
