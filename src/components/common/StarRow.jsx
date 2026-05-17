import "./Common.css";

export default function StarRow({ stars = 0, count = 0 }) {
  const full    = Math.floor(stars);
  const partial = stars % 1 >= 0.5 ? 1 : 0;

  return (
    <div className="star-row">
      <div className="stars">
        {[1, 2, 3, 4, 5].map(i => (
          <svg
            key={i}
            width="13" height="13"
            viewBox="0 0 24 24"
            fill={i <= full ? "#F59E0B" : i === full + 1 && partial ? "url(#half)" : "none"}
            stroke={i <= full || (i === full + 1 && partial) ? "#F59E0B" : "var(--border)"}
            strokeWidth="2"
          >
            <defs>
              <linearGradient id="half" x1="0" x2="1" y1="0" y2="0">
                <stop offset="50%" stopColor="#F59E0B"/>
                <stop offset="50%" stopColor="transparent"/>
              </linearGradient>
            </defs>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        ))}
      </div>
      <span className="review-count">{stars.toFixed(1)} ({count})</span>
    </div>
  );
}
