/**
 * useOrders
 * ──────────
 * Gerencia pedidos locais (mock) e integração com a API.
 * Quando VITE_USE_MOCK=false, os pedidos são buscados do backend.
 */

import { useState, useCallback, useEffect } from "react";
import { getSellerOrders, getClientOrders, updateOrderStatus } from "../services/api";

const ORDERS_KEY = "fp_orders";

function loadLocal() {
  try { return JSON.parse(sessionStorage.getItem(ORDERS_KEY) || "[]"); }
  catch { return []; }
}

function saveLocal(orders) {
  sessionStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function useOrders(user) {
  const [orders,  setOrders]  = useState(loadLocal);
  const [loading, setLoading] = useState(false);

  // Busca pedidos do backend quando backend estiver ativo
  useEffect(() => {
    if (!user || import.meta.env.VITE_USE_MOCK !== "false") return;
    setLoading(true);
    const fn = user.tipo === "seller"
      ? () => getSellerOrders(user.id)
      : () => getClientOrders(user.id);
    fn().then(({ data }) => {
      if (data) { setOrders(data); saveLocal(data); }
      setLoading(false);
    });
  }, [user]);

  const addOrder = useCallback((order) => {
    setOrders(prev => {
      const next = [...prev, order];
      saveLocal(next);
      return next;
    });
  }, []);

  const updateStatus = useCallback(async (orderId, status) => {
    // Otimista: atualiza UI imediatamente
    setOrders(prev => {
      const next = prev.map(o => o.id === orderId ? { ...o, status } : o);
      saveLocal(next);
      return next;
    });
    // Sincroniza com backend
    if (import.meta.env.VITE_USE_MOCK === "false") {
      const { error } = await updateOrderStatus(orderId, status);
      if (error) {
        // Reverte se falhou
        setOrders(prev => {
          const next = prev.map(o => o.id === orderId ? { ...o, status: o.status } : o);
          saveLocal(next);
          return next;
        });
      }
    }
  }, []);

  const clearOrders = useCallback(() => {
    setOrders([]);
    sessionStorage.removeItem(ORDERS_KEY);
  }, []);

  // Filtra por tipo de usuário
  const userOrders = user?.tipo === "seller"
    ? orders.filter(o => o.vendedor_id === user.id || o.vendedor === user.nome_empresa)
    : orders.filter(o => o.cliente_id === user?.id);

  return { orders: userOrders, loading, addOrder, updateStatus, clearOrders };
}
