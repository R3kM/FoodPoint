import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import db from '../db.js';

const router = Router();

// ── Upload de imagem ──────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase() || '.jpg';
    const name = `produto_${Date.now()}${ext}`;
    cb(null, name);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
});

// POST /api/produtos/upload-imagem
router.post('/upload-imagem', upload.single('imagem'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Arquivo inválido.' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

// ── CRUD de produtos ──────────────────────────────────────────────────────────

// GET /api/produtos?vendedor_id=
router.get('/', async (req, res) => {
  const { vendedor_id } = req.query;
  let sql = 'SELECT * FROM vw_estoque WHERE 1=1';
  const params = [];
  if (vendedor_id) { sql += ' AND vendedor_id = ?'; params.push(vendedor_id); }
  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/produtos
router.post('/', async (req, res) => {
  let { vendedor_id, categoria_id, nome, descricao, preco,
        imagem_url, quantidade_inicial, alerta_estoque_baixo } = req.body;
  try {
    if (categoria_id && isNaN(categoria_id)) {
      const [cat] = await db.query('SELECT id FROM categorias WHERE LOWER(nome) = LOWER(?)', [categoria_id]);
      categoria_id = cat.length ? cat[0].id : null;
    }
    const [result] = await db.query(
      `INSERT INTO produtos (vendedor_id, categoria_id, nome, descricao, preco,
        imagem_url, quantidade_inicial, alerta_estoque_baixo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [vendedor_id, categoria_id || null, nome, descricao || '', preco,
       imagem_url || null, quantidade_inicial ?? 0, alerta_estoque_baixo ?? 3]
    );
    // Devolve o produto completo (incluindo campos calculados da view)
    const [rows] = await db.query('SELECT * FROM vw_estoque WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0] || { id: result.insertId, ...req.body });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/produtos/:id
router.put('/:id', async (req, res) => {
  const PROTECTED = new Set(['id', 'vendedor_id', 'criado_em', 'quantidade_vendida',
                              'esgotado', 'estoque_atual', 'quantidade_restante',
                              'nome_empresa', 'nome_categoria', 'status_estoque']);
  const allowed = Object.entries(req.body).filter(([k]) => !PROTECTED.has(k));
  if (!allowed.length) return res.status(400).json({ message: 'Nenhum campo válido.' });

  // Converte categoria_id textual para ID numérico
  let entries = [...allowed];
  const catEntry = entries.find(([k]) => k === 'categoria_id');
  if (catEntry && isNaN(catEntry[1]) && catEntry[1]) {
    const [cat] = await db.query('SELECT id FROM categorias WHERE LOWER(nome) = LOWER(?)', [catEntry[1]]);
    const catId = cat.length ? cat[0].id : null;
    entries = entries.map(([k, v]) => k === 'categoria_id' ? [k, catId] : [k, v]);
  }

  const keys   = entries.map(([k]) => `\`${k}\` = ?`).join(', ');
  const values = [...entries.map(([, v]) => v), req.params.id];
  try {
    await db.query(`UPDATE produtos SET ${keys} WHERE id = ?`, values);
    const [rows] = await db.query('SELECT * FROM vw_estoque WHERE id = ?', [req.params.id]);
    res.json(rows[0] || { id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/produtos/:id
router.delete('/:id', async (req, res) => {
  try {
    // Deleta dependentes antes (FK constraints)
    await db.query('DELETE FROM pedido_itens WHERE produto_id = ?', [req.params.id]);
    await db.query('DELETE FROM produtos      WHERE id = ?',        [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
