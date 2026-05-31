import { useState, useCallback, useEffect, useRef } from "react";
import { getSellerOrders, getClientOrders, updateOrderStatus } from "../services/api";

const ORDERS_KEY = "fp_orders";
const USE_BACKEND = import.meta.env.VITE_USE_MOCK === "false";
// Vendedor recebe polling a cada 15s para ver novos pedidos em tempo real
const POLL_INTERVAL = 15_000;

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
  const pollRef = useRef(null);

  const fetchOrders = useCallback(async () => {
    if (!user || !USE_BACKEND) return;
    const fn = user.tipo === "seller"
      ? () => getSellerOrders(user.id)
      : () => getClientOrders(user.id);
    const { data } = await fn();
    if (data) {
      setOrders(data);
      saveLocal(data);
    }
  }, [user]);

  // Busca inicial + polling para vendedor
  useEffect(() => {
    if (!user || !USE_BACKEND) return;
    setLoading(true);
    fetchOrders().finally(() => setLoading(false));

    // Vendedor faz polling para pegar novos pedidos em tempo real
    if (user.tipo === "seller") {
      pollRef.current = setInterval(fetchOrders, POLL_INTERVAL);
    }
    return () => clearInterval(pollRef.current);
  }, [fetchOrders, user]);

  const addOrder = useCallback((order) => {
    setOrders(prev => {
      const next = [...prev, order];
      saveLocal(next);
      return next;
    });
    // Após criar um pedido, re-busca do backend para garantir dados atualizados
    if (USE_BACKEND) {
      setTimeout(fetchOrders, 500);
    }
  }, [fetchOrders]);

  const updateStatus = useCallback(async (orderId, status) => {
    setOrders(prev => {
      const next = prev.map(o => o.id === orderId ? { ...o, status } : o);
      saveLocal(next);
      return next;
    });
    if (USE_BACKEND) {
      const { error } = await updateOrderStatus(orderId, status);
      if (error) {
        // Reverte se falhou
        fetchOrders();
      }
    }
  }, [fetchOrders]);

  const clearOrders = useCallback(() => {
    setOrders([]);
    sessionStorage.removeItem(ORDERS_KEY);
    if (USE_BACKEND) {
      fetchOrders();
    }
  }, [fetchOrders]);

  const userOrders = user?.tipo === "seller"
    ? orders.filter(o => o.vendedor_id === user.id || o.vendedor === user.nome_empresa)
    : orders.filter(o => o.cliente_id === user?.id);

  return { orders: userOrders, loading, addOrder, updateStatus, clearOrders, refetch: fetchOrders };
}
