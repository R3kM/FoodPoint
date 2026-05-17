import "./Skeleton.css";

export function Skeleton({ width, height, radius, style }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius || "var(--r-sm)", ...style }}
    />
  );
}

export function SellerCardSkeleton() {
  return (
    <div className="skeleton-card">
      <Skeleton height={110} radius="var(--r-lg) var(--r-lg) 0 0" />
      <div className="skeleton-card-body">
        <Skeleton height={16} width="70%" style={{ marginBottom: 8 }} />
        <Skeleton height={12} width="45%" style={{ marginBottom: 12 }} />
        <Skeleton height={12} width="55%" style={{ marginBottom: 14 }} />
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <Skeleton height={11} width="35%" />
          <Skeleton height={11} width="28%" />
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <Skeleton height={150} radius="var(--r-lg) var(--r-lg) 0 0" />
      <div className="skeleton-card-body">
        <Skeleton height={15} width="75%" style={{ marginBottom: 8 }} />
        <Skeleton height={11} width="90%" style={{ marginBottom: 4 }} />
        <Skeleton height={11} width="60%" style={{ marginBottom: 16 }} />
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <Skeleton height={18} width="30%" />
          <Skeleton height={34} width="90px" radius="var(--r-sm)" />
        </div>
      </div>
    </div>
  );
}

export function SellerGridSkeleton({ count = 6 }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:20 }}>
      {Array.from({ length: count }).map((_, i) => <SellerCardSkeleton key={i} />)}
    </div>
  );
}
