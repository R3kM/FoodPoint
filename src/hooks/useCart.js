import { useState, useCallback } from "react";

const CART_KEY = "fp_cart";

function load() {
  try { return JSON.parse(sessionStorage.getItem(CART_KEY) || "[]"); }
  catch { return []; }
}
function save(items) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function useCart() {
  const [cart, setCart] = useState(load);

  const addItem = useCallback((product, seller) => {
    // Bloqueia produto esgotado
    if (product.esgotado) return { error: "Produto esgotado." };

    // Verifica estoque disponível
    const restante = product.quantidade_inicial - product.quantidade_vendida;
    if (product.alerta_estoque_baixo >= 0 && restante <= 0) return { error: "Produto esgotado." };

    setCart(prev => {
      // Carrinho de vendedores diferentes: pede confirmação
      if (prev.length > 0 && prev[0].vendedor?.id !== seller?.id) {
        const ok = window.confirm(
          `Seu carrinho tem itens de "${prev[0].vendedor?.nome_empresa}".\nDeseja limpar e adicionar de "${seller?.nome_empresa}"?`
        );
        if (!ok) return prev;
        const next = [{ ...product, vendedor: seller, qty: 1 }];
        save(next);
        return next;
      }

      const existing = prev.find(i => i.id === product.id);

      // Verifica se qty já atingiu o estoque disponível
      if (existing && restante !== 999 && existing.qty >= restante) return prev;

      const next = existing
        ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...product, vendedor: seller, qty: 1 }];
      save(next);
      return next;
    });

    return { error: null };
  }, []);

  const updateQty = useCallback((id, delta) => {
    setCart(prev => {
      const next = prev
        .map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
        .filter(i => i.qty > 0);
      save(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setCart([]);
    sessionStorage.removeItem(CART_KEY);
  }, []);

  const total      = cart.reduce((s, i) => s + i.preco * i.qty, 0);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  return { cart, addItem, updateQty, clear, total, totalItems };
}
