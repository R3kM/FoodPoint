import { useMemo, useState } from "react";

import "./HomePage.css";

import SellerCard from "../common/SellerCard";

import { MOCK_SELLERS } from "../../data/mockSellers";
import { BUSINESS_TYPES } from "../../data/businessTypes";

export default function HomePage({
  user,
  onSellerClick,
}) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const filters = [
    { key: "all", label: "Todos" },
    ...Object.entries(BUSINESS_TYPES).map(([key, value]) => ({
      key,
      label: value,
    })),
  ];

  const filteredSellers = useMemo(() => {
    return MOCK_SELLERS.filter((seller) => {
      const matchesType =
        selectedType === "all" ||
        seller.tipo_negocio === selectedType;

      const matchesSearch =
        seller.nome_empresa
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        seller.bairro
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [search, selectedType]);

  const featuredSellers = filteredSellers.filter(
    (seller) => seller.destaque
  );

  const regularSellers = filteredSellers.filter(
    (seller) => !seller.destaque
  );

  return (
    <main className="home-page">
      {!user && (
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-badge">
              Empreendedores locais
            </span>

            <h1 className="hero-title">
              Comida boa feita perto de você
            </h1>

            <p className="hero-description">
              Descubra vendedores locais,
              comidas artesanais e produtos
              frescos preparados com cuidado.
            </p>

            <button className="hero-button">
              Explorar vendedores
            </button>
          </div>
        </section>
      )}

      <section className="search-section">
        <input
          type="text"
          placeholder="Buscar por nome ou bairro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </section>

      <section className="filters-section">
        {filters.map((filter) => (
          <button
            key={filter.key}
            className={`filter-button ${
              selectedType === filter.key
                ? "active"
                : ""
            }`}
            onClick={() =>
              setSelectedType(filter.key)
            }
          >
            {filter.label}
          </button>
        ))}
      </section>

      {featuredSellers.length > 0 && (
        <section className="seller-section">
          <div className="section-header">
            <h2>Vendedores em destaque</h2>
          </div>

          <div className="seller-grid">
            {featuredSellers.map((seller) => (
              <SellerCard
                key={seller.id}
                seller={seller}
                onClick={() =>
                  onSellerClick(seller)
                }
              />
            ))}
          </div>
        </section>
      )}

      <section className="seller-section">
        <div className="section-header">
          <h2>Todos os vendedores</h2>

          <span>
            {filteredSellers.length} encontrados
          </span>
        </div>

        {regularSellers.length > 0 ? (
          <div className="seller-grid">
            {regularSellers.map((seller) => (
              <SellerCard
                key={seller.id}
                seller={seller}
                onClick={() =>
                  onSellerClick(seller)
                }
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>
              Nenhum vendedor encontrado
            </h3>

            <p>
              Tente alterar os filtros ou
              pesquisar outro termo.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}