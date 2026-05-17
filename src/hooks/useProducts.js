import { useState, useCallback, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/api";

export function useProducts(vendedor_id) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const fetch = useCallback(async () => {
    if (!vendedor_id) return;
    setLoading(true);
    const { data, error: err } = await getProducts({ vendedor_id });
    setLoading(false);
    if (err) { setError(err); return; }
    setProducts(data || []);
  }, [vendedor_id]);

  useEffect(() => { fetch(); }, [fetch]);

  const addProduct = useCallback(async (product) => {
    const { data, error: err } = await createProduct({ ...product, vendedor_id });
    if (err) return { error: err };
    setProducts(prev => [...prev, data]);
    return { data };
  }, [vendedor_id]);

  const editProduct = useCallback(async (updated) => {
    const { data, error: err } = await updateProduct(updated.id, updated);
    if (err) return { error: err };
    setProducts(prev => prev.map(p => p.id === updated.id ? data : p));
    return { data };
  }, []);

  const removeProduct = useCallback(async (id) => {
    const { error: err } = await deleteProduct(id);
    if (err) return { error: err };
    setProducts(prev => prev.filter(p => p.id !== id));
    return { data: true };
  }, []);

  return { products, loading, error, refetch: fetch, addProduct, editProduct, removeProduct };
}
