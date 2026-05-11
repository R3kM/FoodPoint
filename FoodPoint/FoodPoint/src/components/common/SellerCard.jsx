import "./Common.css";

import StarRow from "./StarRow";

import { BUSINESS_TYPES } from "../../data/businessTypes";

export default function SellerCard({
  seller,
  onClick,
}) {
  return (
    <div
      className="seller-card"
      onClick={onClick}
    >
      <div className="seller-card-banner" />

      <div className="seller-card-content">
        <div className="seller-card-header">
          <h3>{seller.nome_empresa}</h3>

          {seller.verificado && (
            <span className="verified-tag">
              Verificado
            </span>
          )}
        </div>

        <p className="seller-card-category">
          {
            BUSINESS_TYPES[
              seller.tipo_negocio
            ]
          }
        </p>

        <StarRow
          stars={seller.estrelas}
          count={seller.num_avaliacoes}
        />

        <div className="seller-card-footer">
          <span>{seller.bairro}</span>

          <span>
            {seller.tempo_medio_preparo}
            min
          </span>
        </div>
      </div>
    </div>
  );
}