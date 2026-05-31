import { Router } from 'express';
import db from '../db.js';

const router = Router();

// POST /api/pedidos
router.post('/', async (req, res) => {
  const { cliente_id, vendedor_id, tipo_entrega, horario_retirada,
          total, metodo_pagamento, itens } = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [pedResult] = await conn.query(
      `INSERT INTO pedidos (cliente_id, vendedor_id, tipo_entrega, horario_retirada, total)
       VALUES (?, ?, ?, ?, ?)`,
      [cliente_id, vendedor_id, tipo_entrega ?? 'retirada', horario_retirada, total]
    );
    const pedido_id = pedResult.insertId;

    for (const item of itens) {
      await conn.query(
        `INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario)
         VALUES (?, ?, ?, ?)`,
        [pedido_id, item.produto_id, item.quantidade, item.preco_unitario]
      );
      await conn.query(
        `UPDATE produtos SET quantidade_vendida = quantidade_vendida + ? WHERE id = ?`,
        [item.quantidade, item.produto_id]
      );
    }

    const [pagResult] = await conn.query(
      `INSERT INTO pagamentos (pedido_id, metodo, valor) VALUES (?, ?, ?)`,
      [pedido_id, metodo_pagamento, total]
    );

    await conn.commit();
    res.status(201).json({ pedido: { id: pedido_id }, pagamento: { id: pagResult.insertId } });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
});

// GET /api/pedidos?vendedor_id= ou ?cliente_id=
router.get('/', async (req, res) => {
  const { vendedor_id, cliente_id } = req.query;
  const col = vendedor_id ? 'vendedor_id' : 'cliente_id';
  const val = vendedor_id ?? cliente_id;
  try {
    const [rows] = await db.query(`SELECT * FROM pedidos WHERE ${col} = ? ORDER BY criado_em DESC`, [val]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/pedidos/:id/status
router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await db.query('UPDATE pedidos SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ id: req.params.id, status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/pedidos/limpar?vendedor_id=&status=entregue,cancelado
// Remove pedidos finalizados do vendedor (entregue ou cancelado)
router.delete('/limpar', async (req, res) => {
  const { vendedor_id, status } = req.query;
  if (!vendedor_id) return res.status(400).json({ message: 'vendedor_id obrigatório.' });

  const allowedStatuses = ['entregue', 'cancelado'];
  const toDelete = status
    ? status.split(',').filter(s => allowedStatuses.includes(s))
    : allowedStatuses;

  if (!toDelete.length) return res.status(400).json({ message: 'Status inválido.' });

  const placeholders = toDelete.map(() => '?').join(', ');
  try {
    // Busca os ids dos pedidos a deletar
    const [toDeleteRows] = await db.query(
      `SELECT id FROM pedidos WHERE vendedor_id = ? AND status IN (${placeholders})`,
      [vendedor_id, ...toDelete]
    );
    if (toDeleteRows.length === 0) return res.json({ deleted: 0 });

    const ids = toDeleteRows.map(r => r.id);
    const idPlaceholders = ids.map(() => '?').join(', ');

    // Deleta dependentes antes (FK constraints)
    await db.query(`DELETE FROM pagamentos  WHERE pedido_id IN (${idPlaceholders})`, ids);
    await db.query(`DELETE FROM pedido_itens WHERE pedido_id IN (${idPlaceholders})`, ids);
    await db.query(`DELETE FROM pedidos      WHERE id         IN (${idPlaceholders})`, ids);

    res.json({ deleted: ids.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;