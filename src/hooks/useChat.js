/**
 * useChat
 * ───────
 * Gerencia uma conversa entre cliente e vendedor.
 * Busca ou cria a conversa automaticamente ao inicializar,
 * depois carrega as mensagens e expõe a função de envio.
 *
 * Uso:
 *   const { messages, sending, send } = useChat({ clienteId, vendedorId });
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { getOrCreateConversation, getMessages, sendMessage } from "../services/api";

export function useChat({ clienteId, vendedorId }) {
  const [conversaId, setConversaId] = useState(null);
  const [messages, setMessages]     = useState([]);
  const [sending, setSending]       = useState(false);
  const [error, setError]           = useState(null);
  const pollRef                     = useRef(null);

  // Inicializa conversa
  useEffect(() => {
    if (!clienteId || !vendedorId) return;

    async function init() {
      const { data, error: err } = await getOrCreateConversation(clienteId, vendedorId);
      if (err) { setError(err); return; }
      setConversaId(data.id);
    }

    init();
  }, [clienteId, vendedorId]);

  // Carrega mensagens e inicia polling simples (5s)
  useEffect(() => {
    if (!conversaId) return;

    async function load() {
      const { data } = await getMessages(conversaId);
      if (data) setMessages(data);
    }

    load();
    pollRef.current = setInterval(load, 5000);
    return () => clearInterval(pollRef.current);
  }, [conversaId]);

  const send = useCallback(async (conteudo, remetenteTipo, remetenteId) => {
    if (!conversaId || !conteudo.trim()) return;
    setSending(true);

    // Otimista: adiciona a mensagem imediatamente na UI
    const optimistic = {
      id: `tmp-${Date.now()}`,
      conversa_id: conversaId,
      remetente_tipo: remetenteTipo,
      remetente_id: remetenteId,
      conteudo,
      lida: 0,
      enviado_em: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);

    const { data, error: err } = await sendMessage({
      conversa_id: conversaId,
      remetente_tipo: remetenteTipo,
      remetente_id: remetenteId,
      conteudo,
    });

    if (err) {
      // Reverte se falhou
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      setError(err);
    } else {
      // Substitui o otimista pelo real
      setMessages(prev => prev.map(m => m.id === optimistic.id ? data : m));
    }

    setSending(false);
  }, [conversaId]);

  return { messages, sending, error, send };
}
