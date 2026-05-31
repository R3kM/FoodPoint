# FoodPoint

Plataforma que conecta clientes e vendedores de alimentos locais. Clientes descobrem vendedores por categoria, fazem pedidos, acompanham o status em tempo real e conversam diretamente com o vendedor via chat. Vendedores gerenciam catálogo, estoque, pedidos e mensagens por um painel dedicado.

---

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Frontend | React 19, Vite, CSS puro (sem biblioteca de UI) |
| Backend | Node.js, Express, JWT, bcryptjs, multer, nodemailer |
| Banco de dados | MySQL 8+ |
| Pagamentos | Stripe |

---

## Pré-requisitos

- Node.js ≥ 18
- npm ≥ 9
- MySQL 8+
- Conta no [Stripe](https://stripe.com) (opcional para testar pagamentos)
- Conta no Gmail com [Senha de App](https://myaccount.google.com/apppasswords) (opcional para recuperação de senha)

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/foodpoint.git
cd foodpoint
```

### 2. Instale as dependências

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 3. Configure as variáveis de ambiente

```bash
# Frontend (raiz do projeto)
cp .env.example .env

# Backend
cp backend/.env.example backend/.env
```

Edite os dois arquivos `.env` com seus valores. Veja a seção [Variáveis de ambiente](#variáveis-de-ambiente) para detalhes.

### 4. Crie o banco de dados

```bash
mysql -u root -p < "BD.txt"
```

Isso cria o banco `foodpoint` com todas as tabelas, constraints e a view `vw_estoque`.

### 5. Rode o projeto

Em dois terminais separados:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
npm run dev
```

Acesse em: [http://localhost:5173](http://localhost:5173)

---

## Modo mock (sem backend)

Para rodar só o frontend sem configurar banco ou backend, defina no `.env`:

```env
VITE_USE_MOCK=true
```

O app usará os dados locais de `src/data/mock*.js`. Útil para desenvolvimento de UI.

---

## Variáveis de ambiente

### Frontend (`.env`)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_API_URL` | URL base da API backend | `http://localhost:3001/api` |
| `VITE_USE_MOCK` | `true` = dados mock, `false` = API real | `false` |
| `VITE_STRIPE_PUBLIC_KEY` | Chave pública do Stripe | `pk_test_...` |

### Backend (`backend/.env`)

| Variável | Descrição |
|----------|-----------|
| `DB_HOST` | Host do MySQL |
| `DB_PORT` | Porta do MySQL (padrão: `3306`) |
| `DB_USER` | Usuário do MySQL |
| `DB_PASSWORD` | Senha do MySQL |
| `DB_NAME` | Nome do banco (`foodpoint`) |
| `JWT_SECRET` | Chave secreta para assinar tokens JWT — gere com `openssl rand -hex 32` |
| `PORT` | Porta do servidor Express (padrão: `3001`) |
| `FRONTEND_URL` | URL do frontend para CORS (padrão: `http://localhost:5173`) |
| `GMAIL_USER` | E-mail Gmail para envio de recuperação de senha |
| `GMAIL_APP_PASSWORD` | Senha de App do Gmail |
| `STRIPE_SECRET_KEY` | Chave secreta do Stripe |
| `STRIPE_WEBHOOK_SECRET` | Webhook secret gerado no Stripe Dashboard |

---

## Estrutura do projeto

```
FoodPoint/
├── src/                          # Frontend (React + Vite)
│   ├── components/
│   │   ├── auth/                 # Login e cadastro (cliente e vendedor)
│   │   ├── cart/                 # Sidebar do carrinho
│   │   ├── chat/                 # Chat cliente-vendedor
│   │   ├── client/               # Perfil e pedidos do cliente
│   │   ├── common/               # Topbar, Toast, Skeleton, etc.
│   │   ├── home/                 # Landing page e listagem de vendedores
│   │   ├── payment/              # Tela de pagamento (PIX, cartão, dinheiro)
│   │   ├── seller/               # Página pública do vendedor
│   │   └── seller-dashboard/     # Painel do vendedor
│   ├── data/                     # Dados mock (usados com VITE_USE_MOCK=true)
│   ├── hooks/                    # useAuth, useCart, useOrders, useProducts, useSellers, useChat
│   ├── services/
│   │   └── api.js                # Todas as chamadas HTTP centralizadas
│   ├── utils/                    # Validadores, formatadores e helpers
│   └── main.jsx
│
├── backend/                      # Backend (Node.js + Express)
│   └── src/
│       ├── routes/
│       │   ├── auth.js           # Login, cadastro, recuperação de senha, exclusão de conta
│       │   ├── vendedores.js     # CRUD de vendedores
│       │   ├── produtos.js       # CRUD de produtos + upload de imagem
│       │   ├── pedidos.js        # Pedidos e limpeza de concluídos
│       │   ├── conversas.js      # Conversas do chat
│       │   ├── mensagens.js      # Mensagens do chat
│       │   ├── avaliacoes.js     # Avaliações de vendedores
│       │   └── pagamentos.js     # Integração Stripe
│       ├── db.js                 # Pool de conexão MySQL
│       └── server.js             # Entry point do Express
│
└── BD.txt                  # Schema SQL completo
```

---

## Banco de dados

O `BD.txt` contém o schema completo. Tabelas principais:

| Tabela | Descrição |
|--------|-----------|
| `clientes` | Usuários compradores |
| `vendedores` | Empreendedores com loja |
| `categorias` | Categorias de produtos |
| `produtos` | Catálogo com controle de estoque |
| `pedidos` | Cabeçalho dos pedidos |
| `pedido_itens` | Itens de cada pedido |
| `pagamentos` | Método e status de pagamento |
| `conversas` | Sessões de chat cliente-vendedor |
| `mensagens` | Mensagens individuais do chat |
| `avaliacoes` | Estrelas e comentários por pedido |
| `password_resets` | Tokens de recuperação de senha |
| `estoque_resets` | Log de resets de estoque |
| `vw_estoque` | View com quantidade disponível e status de estoque por produto |

---

## Scripts disponíveis

### Frontend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build de produção em `dist/` |
| `npm run preview` | Pré-visualiza o build de produção |

### Backend

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor com hot-reload |
| `npm start` | Inicia o servidor em produção |
