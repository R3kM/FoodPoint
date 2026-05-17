/**
 * useSellers
 * ──────────
 * Busca a lista de vendedores, com suporte a filtros.
 * Quando o backend estiver pronto, basta trocar USE_MOCK
 * em src/services/api.js — este hook não precisa mudar.
 *
 * Uso:
 *   const { sellers, loading, error, refetch } = useSellers({ tipo_negocio, search });
 */

import { useEffect, useState, useCallback } from "react";
import { getSellers } from "../services/api";

export function useSellers({ tipo_negocio, search } = {}) {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await getSellers({ tipo_negocio, search });
    if (err) setError(err);
    else setSellers(data || []);
    setLoading(false);
  }, [tipo_negocio, search]);

  useEffect(() => { fetch(); }, [fetch]);

  return { sellers, loading, error, refetch: fetch };
}
