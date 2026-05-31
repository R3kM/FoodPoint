import { Router } from 'express';
import db from '../db.js';

const router = Router();

// POST /api/avaliacoes
router.post('/', async (req, res) => {
  const { cliente_id, vendedor_id, pedido_id, estrelas, comentario } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO avaliacoes (cliente_id, vendedor_id, pedido_id, estrelas, comentario) VALUES (?, ?, ?, ?, ?)',
      [cliente_id, vendedor_id, pedido_id, estrelas, comentario]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(400).json({ message: err.sqlMessage || err.message });
  }
});

// GET /api/avaliacoes?vendedor_id=
router.get('/', async (req, res) => {
  const { vendedor_id } = req.query;
  try {
    const [rows] = await db.query('SELECT * FROM avaliacoes WHERE vendedor_id = ?', [vendedor_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;