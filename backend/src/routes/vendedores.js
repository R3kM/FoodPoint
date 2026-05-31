import { Router } from 'express';
import db from '../db.js';

const router = Router();

// Campos que o MySQL retorna como string mas são JSON
const JSON_FIELDS = ['horario_funcionamento'];

function parseJsonFields(row) {
  const out = { ...row };
  for (const field of JSON_FIELDS) {
    if (typeof out[field] === 'string' && out[field]) {
      try { out[field] = JSON.parse(out[field]); } catch { out[field] = {}; }
    }
  }
  return out;
}

// GET /api/vendedores?tipo_negocio=&search=
router.get('/', async (req, res) => {
  const { tipo_negocio, search } = req.query;
  let sql = 'SELECT * FROM vendedores WHERE ativo = 1';
  const params = [];

  if (tipo_negocio) { sql += ' AND tipo_negocio = ?'; params.push(tipo_negocio); }
  if (search)       { sql += ' AND (nome_empresa LIKE ? OR descricao_loja LIKE ?)';
                      params.push(`%${search}%`, `%${search}%`); }

  try {
    const [rows] = await db.query(sql, params);
    res.json(rows.map(parseJsonFields));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/vendedores/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM vendedores WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Vendedor não encontrado.' });
    res.json(parseJsonFields(rows[0]));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/vendedores/:id
router.put('/:id', async (req, res) => {
  // Campos que não podem ser atualizados via este endpoint
  const PROTECTED = new Set(['id', 'senha', 'criado_em', 'estrelas', 'num_avaliacoes',
                              'total_vendas', 'verificado', 'plano', 'destaque', 'ativo',
                              'tipo', 'cpf_cnpj', 'tipo_documento']);

  const allowed = Object.entries(req.body).filter(([k]) => !PROTECTED.has(k));
  if (!allowed.length) return res.status(400).json({ message: 'Nenhum campo válido para atualizar.' });

  const keys   = allowed.map(([k]) => `\`${k}\` = ?`).join(', ');
  const values = allowed.map(([, v]) => {
    // Serializa objetos (ex: horario_funcionamento) para JSON string
    if (v !== null && typeof v === 'object') return JSON.stringify(v);
    return v;
  });
  values.push(req.params.id);

  try {
    await db.query(`UPDATE vendedores SET ${keys} WHERE id = ?`, values);
    // Devolve o vendedor atualizado do banco com campos JSON parseados
    const [rows] = await db.query('SELECT * FROM vendedores WHERE id = ?', [req.params.id]);
    res.json(parseJsonFields(rows[0] || { id: req.params.id }));
  } catch (err) {
    console.error('Erro ao atualizar vendedor:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;