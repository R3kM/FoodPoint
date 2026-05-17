import { useState } from "react";
import "./HomePage.css";
import SellerCard from "../common/SellerCard";
import { SellerGridSkeleton } from "../common/Skeleton";
import { useSellers } from "../../hooks/useSellers";
import { BUSINESS_TYPES } from "../../data/businessTypes";

export default function HomePage({ user, onSellerClick }) {
  const [search,       setSearch]       = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const { sellers, loading } = useSellers({ tipo_negocio: selectedType === "all" ? undefined : selectedType });

  const filters = [
    { key: "all", label: "Todos" },
    ...Object.entries(BUSINESS_TYPES).map(([key, value]) => ({ key, label: value })),
  ];

  const filtered = sellers.filter(s => {
    const q = search.toLowerCase();
    return s.nome_empresa.toLowerCase().includes(q) || s.bairro.toLowerCase().includes(q);
  });

  return (
    <main className="home-page">
      <div className="home-main">
        <div className="home-top-bar">
          <div>
            <h1 className="home-title">Vendedores</h1>
            <p className="home-sub">
              Olá, {user?.nome?.split(" ")[0] || "bem-vindo"}! O que você quer comer hoje?
            </p>
          </div>
        </div>

        <div className="search-filter-bar">
          <div className="search-wrapper">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar por nome ou bairro…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filters-section">
          {filters.map(f => (
            <button
              key={f.key}
              className={`filter-button ${selectedType === f.key ? "active" : ""}`}
              onClick={() => setSelectedType(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <section className="seller-section">
          <div className="section-header">
            <h2>Todos os vendedores</h2>
            {!loading && (
              <span className="section-count">
                {filtered.length} encontrado{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {loading ? (
            <SellerGridSkeleton count={6} />
          ) : filtered.length > 0 ? (
            <div className="seller-grid">
              {filtered.map(s => (
                <SellerCard key={s.id} seller={s} onClick={() => onSellerClick(s)} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Nenhum vendedor encontrado</h3>
              <p>Tente alterar os filtros ou pesquisar outro termo.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
