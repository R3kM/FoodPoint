import "./Common.css";
import StarRow from "./StarRow";
import { BUSINESS_TYPES } from "../../data/businessTypes";

const TYPE_COLOR = {
  salgados:  "linear-gradient(135deg,#f97316,#fb923c)",
  marmita:   "linear-gradient(135deg,#22c55e,#86efac)",
  doces:     "linear-gradient(135deg,#ec4899,#f9a8d4)",
  bebidas:   "linear-gradient(135deg,#6366f1,#a5b4fc)",
  pastelaria:"linear-gradient(135deg,#eab308,#fde047)",
  lanches:   "linear-gradient(135deg,#E84A1E,#ff7b54)",
  sorvetes:  "linear-gradient(135deg,#06b6d4,#67e8f9)",
  outro:     "linear-gradient(135deg,#78716c,#a8a29e)",
};

export default function SellerCard({ seller, onClick }) {
  return (
    <div className="seller-card" onClick={onClick}>
      <div className="seller-card-banner">
        {seller.logo_url ? (
          <img src={seller.logo_url} alt={seller.nome_empresa} className="seller-card-banner-img" />
        ) : (
          <div
            className="seller-card-banner-fallback"
            style={{ background: TYPE_COLOR[seller.tipo_negocio] || TYPE_COLOR.outro }}
          />
        )}
      </div>

      <div className="seller-card-content">
        <div className="seller-card-header">
          <h3>{seller.nome_empresa}</h3>
          {seller.verificado && <span className="verified-tag">Verificado</span>}
        </div>

        <p className="seller-card-category">{BUSINESS_TYPES[seller.tipo_negocio]}</p>

        <StarRow stars={seller.estrelas} count={seller.num_avaliacoes} />

        <div className="seller-card-footer">
          <span>{seller.bairro}</span>
          <span>{seller.tempo_medio_preparo} min</span>
        </div>
      </div>
    </div>
  );
}
