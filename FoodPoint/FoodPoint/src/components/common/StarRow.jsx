import "./Common.css";

export default function StarRow({
  stars = 0,
  count = 0,
}) {
  const roundedStars =
    Math.round(stars);

  return (
    <div className="star-row">
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              star <= roundedStars
                ? "star filled"
                : "star"
            }
          >
            ★
          </span>
        ))}
      </div>

      <span className="review-count">
        ({count})
      </span>
    </div>
  );
}