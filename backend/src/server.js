import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes       from './routes/auth.js';
import vendedoresRoutes from './routes/vendedores.js';
import produtosRoutes   from './routes/produtos.js';
import pedidosRoutes    from './routes/pedidos.js';
import conversasRoutes  from './routes/conversas.js';
import mensagensRoutes  from './routes/mensagens.js';
import avaliacoesRoutes from './routes/avaliacoes.js';
import pagamentosRoutes from './routes/pagamentos.js';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));

// Servir imagens de produtos — mesmo diretório onde produtos.js salva os arquivos
// backend/src/server.js → __dirname = backend/src/ → ../uploads = backend/uploads/
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  next();
}, express.static(path.join(__dirname, '../uploads')));

// Webhook do Stripe precisa do body RAW (antes do express.json)
app.use('/api/pagamentos/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '2mb' }));

// Rotas
app.use('/api/auth',        authRoutes);
app.use('/api/vendedores',  vendedoresRoutes);
app.use('/api/produtos',    produtosRoutes);
app.use('/api/pedidos',     pedidosRoutes);
app.use('/api/conversas',   conversasRoutes);
app.use('/api/mensagens',   mensagensRoutes);
app.use('/api/avaliacoes',  avaliacoesRoutes);
app.use('/api/pagamentos',  pagamentosRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}/api`);
});
