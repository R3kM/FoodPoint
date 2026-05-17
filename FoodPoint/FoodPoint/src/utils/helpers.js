export const getInitials = (name) => {
  return (
    name
      ?.split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?"
  );
};

export const colorForType = (type) => {
  const colors = {
    salgados: "#f97316",
    marmita: "#22c55e",
    doces: "#ec4899",
    bebidas: "#3b82f6",
    pastelaria: "#f59e0b",
    lanches: "#ef4444",
    sorvetes: "#8b5cf6",
    outro: "#6b7280",
  };

  return colors[type] || colors.outro;
};