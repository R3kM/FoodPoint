# FoodPoint — Frontend

Plataforma que conecta clientes e vendedores de alimentos locais.  
Stack: **React 19 + Vite**, sem dependências de UI externas.

---

## Pré-requisitos

- Node.js ≥ 18
- npm ≥ 9

---

## Instalação

```bash
npm install
```

---

## Rodar em desenvolvimento (modo mock — sem backend)

```bash
cp .env.example .env
npm run dev
```

Com `VITE_USE_MOCK=true` (padrão), o app usa dados locais de `src/data/mock*.js`.  
Nenhum banco de dados é necessário para testar o frontend.

---

## Conectar ao backend MySQL

### 1. Configure o `.env`

```env
VITE_API_URL=http://localhost:3001/api   # URL do seu servidor Express
VITE_USE_MOCK=false                       # Desativa os dados mock
```

### 2. Suba o banco de dados

Execute o script `BD Final.txt` no seu MySQL:

```bash
mysql -u root -p < "BD Final.txt"
```

Isso cria o banco `foodpoint` com todas as tabelas e a view `vw_estoque`.

### 3. Crie o servidor Express (Node.js)

O frontend espera uma API REST em `VITE_API_URL` com as rotas listadas em `.env.example`.  
Exemplo mínimo de servidor com Express + mysql2:

```js
// server.js
import express from 'express';
import cors    from 'cors';
import mysql   from 'mysql2/promise';

const app = express();
app.use(cors());
app.use(express.json());

const db = await mysql.createPool({
  host: 'localhost', user: 'root', password: 'sua_senha', database: 'foodpoint'
});

// Exemplo de rota
app.get('/api/vendedores', async (req, res) => {
  const { tipo_negocio, search } = req.query;
  let sql = 'SELECT * FROM vendedores WHERE ativo = 1';
  const params = [];
  if (tipo_negocio) { sql += ' AND tipo_negocio = ?'; params.push(tipo_negocio); }
  if (search)        { sql += ' AND (nome_empresa LIKE ? OR bairro LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  const [rows] = await db.execute(sql, params);
  res.json(rows);
});

app.listen(3001, () => console.log('API rodando em http://localhost:3001'));
```

### 4. Rode o frontend

```bash
npm run dev
```

---

## Estrutura do projeto

```
src/
├── components/
│   ├── auth/            # Tela de login e cadastro
│   ├── cart/            # Sidebar do carrinho
│   ├── chat/            # Chat cliente-vendedor
│   ├── client/          # Perfil e pedidos do cliente
│   ├── common/          # Componentes reutilizáveis (Topbar, Toast, etc.)
│   ├── home/            # Landing page e listagem de vendedores
│   ├── payment/         # Tela de pagamento
│   ├── seller/          # Página pública do vendedor
│   └── seller-dashboard/ # Painel do vendedor
├── data/                # Dados mock (só usados com VITE_USE_MOCK=true)
├── hooks/               # useAuth, useCart, useOrders, useProducts, useSellers, useChat
├── services/
│   └── api.js           # Todas as chamadas HTTP centralizadas
├── styles/              # Variáveis CSS globais e reset
└── utils/               # Validadores, formatadores e helpers
```

---

## Scripts disponíveis

| Comando         | Descrição                        |
|-----------------|----------------------------------|
| `npm run dev`   | Inicia o servidor de dev (Vite)  |
| `npm run build` | Gera build de produção em `dist/`|
| `npm run preview` | Pré-visualiza o build          |

---

## Banco de dados

O arquivo `BD Final.txt` contém o schema MySQL completo:

- `clientes` — usuários compradores
- `vendedores` — empreendedores com loja
- `produtos` — catálogo com controle de estoque
- `pedidos` + `pedido_itens` — fluxo de compra
- `pagamentos` — registro de forma e status de pagamento
- `conversas` + `mensagens` — chat interno
- `avaliacoes` — estrelas e comentários por pedido
- `estoque_resets` — log de resets de estoque diários
- `vw_estoque` — view calculada de quantidade disponível por produto
