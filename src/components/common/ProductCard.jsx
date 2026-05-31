import "./Common.css";
import { formatCurrency } from "../../utils/formatters";

// Calcula status de estoque igual à view vw_estoque do banco
function getEstoqueStatus(product) {
  if (product.esgotado) return "esgotado";
  const restante = product.quantidade_inicial - product.quantidade_vendida;
  if (product.alerta_estoque_baixo > 0 && restante <= product.alerta_estoque_baixo) return "baixo";
  return "ok";
}

// Valida URL de imagem para evitar XSS / conteúdo não confiável
function resolveImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("data:image/")) return url;
  if (url.startsWith("/uploads/")) {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
    const base = apiUrl.replace(/\/api\/?$/, "");
    return `${base}${url}`;
  }
  try {
    const u = new URL(url);
    return u.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

export default function ProductCard({ product, onAdd }) {
  const estoqueStatus = getEstoqueStatus(product);
  const esgotado = estoqueStatus === "esgotado";
  const estoqueBaixo = estoqueStatus === "baixo";
  const restante = product.quantidade_inicial - product.quantidade_vendida;

  return (
    <div className={`product-card ${esgotado ? "product-card--esgotado" : ""}`}>
      <div className="product-image-placeholder">
        {resolveImageUrl(product.imagem_url)
          ? <img src={resolveImageUrl(product.imagem_url)} alt={product.nome} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <span style={{ fontSize: 13, color: "var(--text-3)" }}>Sem imagem</span>
        }
        {esgotado && (
          <div className="product-esgotado-overlay">Esgotado</div>
        )}
      </div>
      <div className="product-content">
        <h3>{product.nome}</h3>
        <p className="product-description">{product.descricao}</p>
        {estoqueBaixo && !esgotado && (
          <p style={{ fontSize: 11, color: "#C98300", fontWeight: 600, marginBottom: 4 }}>
            ⚠ Apenas {restante} restante{restante !== 1 ? "s" : ""}
          </p>
        )}
        <div className="product-footer">
          <strong>{formatCurrency(product.preco)}</strong>
          <button
            className="add-button"
            onClick={onAdd}
            disabled={esgotado}
            aria-label={esgotado ? `${product.nome} — esgotado` : `Adicionar ${product.nome} ao carrinho`}
            style={esgotado ? { opacity: 0.4, cursor: "not-allowed" } : {}}
          >
            {esgotado ? "Esgotado" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}
