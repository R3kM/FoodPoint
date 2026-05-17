export function colorForType(tipo) {
  const map = {
    salgados:  "linear-gradient(135deg,#f97316,#fb923c)",
    marmita:   "linear-gradient(135deg,#22c55e,#4ade80)",
    doces:     "linear-gradient(135deg,#ec4899,#f472b6)",
    bebidas:   "linear-gradient(135deg,#6366f1,#818cf8)",
    pastelaria:"linear-gradient(135deg,#eab308,#facc15)",
    lanches:   "linear-gradient(135deg,#E84A1E,#ff7b54)",
    sorvetes:  "linear-gradient(135deg,#06b6d4,#22d3ee)",
    outro:     "linear-gradient(135deg,#78716c,#a8a29e)",
  };
  return map[tipo] || map.outro;
}
