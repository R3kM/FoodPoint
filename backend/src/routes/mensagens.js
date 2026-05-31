import { Router } from 'express';
import db from '../db.js';

const router = Router();

// ─── POST /api/mensagens ──────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { conversa_id, remetente_tipo, remetente_id, conteudo } = req.body;

  if (!conversa_id || !remetente_tipo || !remetente_id || !conteudo?.trim()) {
    return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO mensagens (conversa_id, remetente_tipo, remetente_id, conteudo)
       VALUES (?, ?, ?, ?)`,
      [conversa_id, remetente_tipo, remetente_id, conteudo.trim()]
    );
    res.status(201).json({
      id:             result.insertId,
      conversa_id,
      remetente_tipo,
      remetente_id,
      conteudo:       conteudo.trim(),
      lida:           0,
      enviado_em:     new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PUT /api/mensagens/lidas ─────────────────────────────────────────────────
// Marca como lidas todas as mensagens de uma conversa recebidas pelo leitor
// Body: { conversa_id, lido_por: 'cliente' | 'vendedor' }
router.put('/lidas', async (req, res) => {
  const { conversa_id, lido_por } = req.body;
  if (!conversa_id || !lido_por) {
    return res.status(400).json({ message: 'conversa_id e lido_por são obrigatórios.' });
  }

  // O remetente oposto é quem enviou as mensagens que precisam ser marcadas
  const remetente_oposto = lido_por === 'vendedor' ? 'cliente' : 'vendedor';

  try {
    await db.query(
      `UPDATE mensagens SET lida = 1
       WHERE conversa_id = ? AND remetente_tipo = ? AND lida = 0`,
      [conversa_id, remetente_oposto]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
