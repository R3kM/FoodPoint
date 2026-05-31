import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import db from '../db.js';

const router = Router();

// ─── Mailer (Gmail SMTP) ──────────────────────────────────────────────────────
const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, senha, tipo } = req.body;
  const tabela = tipo === 'seller' ? 'vendedores' : 'clientes';

  try {
    const [rows] = await db.query(`SELECT * FROM ${tabela} WHERE email = ?`, [email]);
    if (!rows.length) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const user = rows[0];
    const ok = await bcrypt.compare(senha, user.senha);
    if (!ok) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const token = jwt.sign({ id: user.id, tipo }, process.env.JWT_SECRET, { expiresIn: '7d' });
    delete user.senha;

    // Parseia campos JSON (ex: horario_funcionamento) que o mysql2 retorna como string
    if (tipo === 'seller' && typeof user.horario_funcionamento === 'string' && user.horario_funcionamento) {
      try { user.horario_funcionamento = JSON.parse(user.horario_funcionamento); } catch { user.horario_funcionamento = {}; }
    }

    res.json({ user: { ...user, tipo }, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/auth/register/client ──────────────────────────────────────────
router.post('/register/client', async (req, res) => {
  const { nome, cpf, telefone, email, senha, logradouro, numero,
          complemento, bairro, cidade, uf, cep } = req.body;
  try {
    const hash = await bcrypt.hash(senha, 10);
    const [result] = await db.query(
      `INSERT INTO clientes (nome, cpf, telefone, email, senha,
        logradouro, numero, complemento, bairro, cidade, uf, cep)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, cpf, telefone, email, hash,
       logradouro, numero, complemento, bairro, cidade, uf, cep]
    );
    const user = { id: result.insertId, nome, email, tipo: 'client' };
    const token = jwt.sign({ id: user.id, tipo: 'client' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.sqlMessage || err.message });
  }
});

// ─── POST /api/auth/register/seller ──────────────────────────────────────────
router.post('/register/seller', async (req, res) => {
  const { nome_responsavel, cpf_cnpj, tipo_documento, telefone, email,
          nome_empresa, tipo_negocio, bairro, cidade, uf, cep,
          instagram, chave_pix, tipo_chave_pix, descricao_loja, senha } = req.body;
  try {
    const hash = await bcrypt.hash(senha, 10);
    const [result] = await db.query(
      `INSERT INTO vendedores (nome_responsavel, cpf_cnpj, tipo_documento, telefone, email,
        nome_empresa, tipo_negocio, bairro, cidade, uf, cep,
        instagram, chave_pix, tipo_chave_pix, descricao_loja, senha)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome_responsavel, cpf_cnpj, tipo_documento, telefone, email,
       nome_empresa, tipo_negocio, bairro, cidade, uf, cep,
       instagram, chave_pix, tipo_chave_pix, descricao_loja, hash]
    );
    const user = { id: result.insertId, nome_empresa, email, tipo: 'seller' };
    const token = jwt.sign({ id: user.id, tipo: 'seller' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.sqlMessage || err.message });
  }
});

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
// Body: { email, tipo: 'client' | 'seller' }
router.post('/forgot-password', async (req, res) => {
  const { email, tipo } = req.body;
  if (!email || !tipo) return res.status(400).json({ message: 'E-mail e tipo são obrigatórios.' });

  const tabela = tipo === 'seller' ? 'vendedores' : 'clientes';

  try {
    const [rows] = await db.query(`SELECT id FROM ${tabela} WHERE email = ?`, [email]);

    // Sempre responde com sucesso para não revelar se o e-mail existe
    if (!rows.length) {
      return res.json({ message: 'Se esse e-mail estiver cadastrado, você receberá um link em breve.' });
    }

    const userId = rows[0].id;
    const token  = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Salva o token na tabela de reset
    await db.query(
      `INSERT INTO password_resets (usuario_id, tipo, token, expira_em)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE token = VALUES(token), expira_em = VALUES(expira_em)`,
      [userId, tipo, token, expiry]
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&tipo=${tipo}`;

    await mailer.sendMail({
      from: `"FoodPoint" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Recuperação de senha — FoodPoint',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #111; margin-bottom: 8px;">Recuperar senha</h2>
          <p style="color: #555; line-height: 1.6;">
            Recebemos uma solicitação para redefinir a senha da sua conta FoodPoint.
            Clique no botão abaixo para criar uma nova senha. O link expira em <strong>1 hora</strong>.
          </p>
          <a href="${resetUrl}"
             style="display: inline-block; margin: 24px 0; background: #111; color: #fff;
                    padding: 14px 28px; border-radius: 8px; text-decoration: none;
                    font-weight: 700; font-size: 15px;">
            Redefinir senha
          </a>
          <p style="color: #999; font-size: 13px;">
            Se você não solicitou isso, ignore este e-mail. Sua senha permanece a mesma.
          </p>
        </div>
      `,
    });

    res.json({ message: 'Se esse e-mail estiver cadastrado, você receberá um link em breve.' });
  } catch (err) {
    console.error('Erro ao enviar e-mail de reset:', err);
    res.status(500).json({ message: 'Erro ao enviar e-mail. Tente novamente.' });
  }
});

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
// Body: { token, tipo, novaSenha }
router.post('/reset-password', async (req, res) => {
  const { token, tipo, novaSenha } = req.body;
  if (!token || !tipo || !novaSenha) {
    return res.status(400).json({ message: 'Dados incompletos.' });
  }
  if (novaSenha.length < 6) {
    return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  const tabela = tipo === 'seller' ? 'vendedores' : 'clientes';

  try {
    const [resets] = await db.query(
      `SELECT * FROM password_resets WHERE token = ? AND tipo = ? AND expira_em > NOW()`,
      [token, tipo]
    );

    if (!resets.length) {
      return res.status(400).json({ message: 'Link inválido ou expirado. Solicite um novo.' });
    }

    const { usuario_id } = resets[0];
    const hash = await bcrypt.hash(novaSenha, 10);

    await db.query(`UPDATE ${tabela} SET senha = ? WHERE id = ?`, [hash, usuario_id]);
    await db.query(`DELETE FROM password_resets WHERE token = ?`, [token]);

    res.json({ message: 'Senha redefinida com sucesso! Faça login.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── DELETE /api/auth/account ─────────────────────────────────────────────────
// Body: { id, tipo: 'client' | 'seller' }
router.delete('/account', async (req, res) => {
  const { id, tipo } = req.body;
  if (!id || !tipo) return res.status(400).json({ message: 'id e tipo são obrigatórios.' });

  const tabela = tipo === 'seller' ? 'vendedores' : 'clientes';
  const fkCol  = tipo === 'seller' ? 'vendedor_id' : 'cliente_id';

  try {
    // Apaga registros dependentes para evitar erro de foreign key
    // 1. Mensagens das conversas do usuário
    const [conversas] = await db.query(
      `SELECT id FROM conversas WHERE ${fkCol} = ?`, [id]
    );
    if (conversas.length) {
      const ids = conversas.map(c => c.id);
      await db.query(`DELETE FROM mensagens WHERE conversa_id IN (?)`, [ids]);
    }
    // 2. Conversas
    await db.query(`DELETE FROM conversas WHERE ${fkCol} = ?`, [id]);

    // 3. Itens de pedidos → pedidos (só para cliente/vendedor)
    const [pedidos] = await db.query(
      `SELECT id FROM pedidos WHERE ${fkCol} = ?`, [id]
    );
    if (pedidos.length) {
      const pids = pedidos.map(p => p.id);
      await db.query(`DELETE FROM pedido_itens WHERE pedido_id IN (?)`, [pids]);
      await db.query(`DELETE FROM pagamentos   WHERE pedido_id IN (?)`, [pids]);
      await db.query(`DELETE FROM avaliacoes   WHERE pedido_id IN (?)`, [pids]);
    }
    await db.query(`DELETE FROM pedidos WHERE ${fkCol} = ?`, [id]);

    // 4. Avaliações restantes (como cliente ou vendedor)
    await db.query(`DELETE FROM avaliacoes WHERE ${fkCol} = ?`, [id]);

    // 5. Se for vendedor: produtos
    if (tipo === 'seller') {
      await db.query(`DELETE FROM produtos WHERE vendedor_id = ?`, [id]);
    }

    // 6. Finalmente, apaga o usuário
    await db.query(`DELETE FROM ${tabela} WHERE id = ?`, [id]);

    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao excluir conta:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
