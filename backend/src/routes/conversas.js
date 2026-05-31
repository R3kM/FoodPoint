import { Router } from 'express';
import db from '../db.js';

const router = Router();

// ─── POST /api/conversas ──────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { cliente_id, vendedor_id } = req.body;

  if (!cliente_id || !vendedor_id) {
    return res.status(400).json({ message: 'cliente_id e vendedor_id são obrigatórios.' });
  }

  try {
    const [existing] = await db.query(
      'SELECT * FROM conversas WHERE cliente_id = ? AND vendedor_id = ?',
      [cliente_id, vendedor_id]
    );
    if (existing.length) return res.json(existing[0]);

    const [result] = await db.query(
      'INSERT INTO conversas (cliente_id, vendedor_id) VALUES (?, ?)',
      [cliente_id, vendedor_id]
    );
    res.status(201).json({ id: result.insertId, cliente_id, vendedor_id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/conversas?cliente_id= ou ?vendedor_id= ─────────────────────────
router.get('/', async (req, res) => {
  const { cliente_id, vendedor_id } = req.query;
  const col = cliente_id ? 'cliente_id' : 'vendedor_id';
  const val = cliente_id ?? vendedor_id;

  if (!val) return res.status(400).json({ message: 'Informe cliente_id ou vendedor_id.' });

  try {
    const [rows] = await db.query(
      `SELECT * FROM conversas WHERE ${col} = ? ORDER BY criado_em DESC`,
      [val]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/conversas/:id/mensagens ────────────────────────────────────────
router.get('/:id/mensagens', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM mensagens WHERE conversa_id = ? ORDER BY enviado_em ASC',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
