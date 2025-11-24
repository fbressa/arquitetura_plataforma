# Fluxo de Navegação - Frontend Autenticação

## ✅ Navegação Implementada

### 1. **Login → Signup**
- Link "Não tem conta? Cadastre-se" na página de login
- Caminho: `/login` → `/signup`

### 2. **Signup → Login**
- Link "Já tem uma conta? Faça login" na página de signup
- Caminho: `/signup` → `/login`

### 3. **Login Bem-sucedido**
- Após autenticação, redireciona para `/` (Dashboard)
- Token e user salvos em localStorage
- Usuário vê seu nome na topbar

### 4. **Dashboard → Logout**
- Botão "Sair" na topbar (menu dropdown)
- Clique em "Sair" → logout() → localStorage limpo → `/login`

### 5. **Proteção de Rotas**
- Sem token → Tenta acessar rota protegida → Redireciona para `/login`
- Com token → Acesso permitido

## 📊 Diagrama de Fluxo

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  SEM AUTENTICAÇÃO                               │
│                                                 │
│  /login  ←→  /signup                           │
│    ↓           ↓                                │
│    └─→ LOGIN BEM-SUCEDIDO                      │
│         (token + user salvo)                   │
│              ↓                                  │
│    ┌─────────────────────┐                     │
│    │ COM AUTENTICAÇÃO    │                     │
│    │                     │                     │
│    │ /  (Dashboard)      │                     │
│    │ /clientes           │                     │
│    │ /reembolsos         │                     │
│    │ /relatorios         │                     │
│    │                     │                     │
│    │ Topbar com:         │                     │
│    │ - Nome do usuário   │                     │
│    │ - Email             │                     │
│    │ - Botão SAIR ────────┐                    │
│    └─────────────────────┘                     │
│                            ↓                    │
│                    logout() + localStorage     │
│                    limpo                        │
│                            ↓                    │
└─→ /login ──────────────────────────────────────┘
```

## 🔄 Fluxos Detalhados

### Fluxo 1: Novo Usuário
```
/signup
  ↓
Preenche: nome, email, senha
  ↓
POST /users (backend)
  ↓
Sucesso: Redireciona para /login
Erro: Mostra notificação + permanece em /signup
```

### Fluxo 2: Login Existente
```
/login
  ↓
Preenche: email, senha
  ↓
POST /auth/login (backend)
  ↓
Sucesso:
  - Token salvo em localStorage
  - User salvo em localStorage
  - Redireciona para /
  - Topbar mostra nome do usuário

Erro (email/senha incorretos):
  - Mostra box de erro em vermelho
  - Notificação toast
  - Permanece em /login
```

### Fluxo 3: Acesso Protegido
```
URL: /clientes (ou /reembolsos, /relatorios)
  ↓
Tem token em localStorage?
  ↓
SIM → Renderiza a página
  ↓
NÃO → Redireciona para /login
```

### Fluxo 4: Logout
```
Clique em "Sair" (topbar)
  ↓
Chama logout():
  - localStorage limpo
  - AppContext resetado
  - Redireciona para /login
  ↓
Próximas rotas protegidas → redireciona para /login
```

## 🧭 Rotas Disponíveis

### Públicas (Sem autenticação necessária)
- ✅ `/login` - Página de login
- ✅ `/signup` - Página de cadastro

### Protegidas (Requer autenticação)
- ✅ `/` - Dashboard
- ⏳ `/clientes` - (precisa mover para `(protected)/clientes`)
- ⏳ `/reembolsos` - (precisa mover para `(protected)/reembolsos`)
- ⏳ `/relatorios` - (precisa mover para `(protected)/relatorios`)

## 📝 Checklist: Próximas Ações

Para ativar a proteção nas rotas, faça:

1. **Mover páginas para (protected):**
   ```
   app/
   ├── (protected)/
   │   ├── clientes/
   │   │   └── page.tsx  (mover de app/clientes)
   │   ├── reembolsos/
   │   │   └── page.tsx  (mover de app/reembolsos)
   │   └── relatorios/
   │       └── page.tsx  (mover de app/relatorios)
   └── layout.tsx (já tem PrivateRoute)
   ```

2. **Ou envolver cada página:**
   ```tsx
   import PrivateRoute from "@/app/components/PrivateRoute";

   export default function ClientesPage() {
     return (
       <PrivateRoute>
         {/* conteúdo */}
       </PrivateRoute>
     );
   }
   ```

## 🧪 Como Testar

### 1. Teste de Cadastro (Novo Usuário)
```
1. Acesse http://localhost:3000/signup
2. Preencha: nome, email, senha (6+ chars)
3. Clique "Criar Conta"
4. Se sucesso: Redireciona para /login com mensagem
5. Se erro: Mostra erro em vermelho
```

### 2. Teste de Login
```
1. Acesse http://localhost:3000/login
2. Digite email e senha criados
3. Clique "Entrar"
4. Sucesso: Vai para / e mostra nome na topbar
5. Erro: Mostra "Email ou senha incorretos"
```

### 3. Teste de Proteção
```
1. Abra DevTools → Application → localStorage
2. Limpe tudo (delete auth_token e auth_user)
3. Acesse http://localhost:3000/clientes
4. Deve redirecionar para /login
```

### 4. Teste de Logout
```
1. Faça login com sucesso
2. Clique no menu (topbar)
3. Clique "Sair"
4. localStorage deve estar vazio
5. Deve redirecionar para /login
```

## 🔗 Links no Código

- `app/login/page.tsx` - Link para `/signup`
- `app/signup/page.tsx` - Link para `/login`
- `components/app-topbar.tsx` - Botão "Sair" com logout
- `app/context/AppContext.tsx` - `isAuthenticated` usado por PrivateRoute
- `app/components/PrivateRoute.tsx` - Verifica autenticação

## 📱 Estados da Topbar

### Sem Login
```
Página não renderiza (redireciona para /login)
```

### Com Login
```
┌─────────────────────────────────────┐
│ 🔍 Search | 🔔 | 👤 João Silva ↓  │
│                    └─ Minha Conta   │
│                    └─ Perfil        │
│                    └─ Configurações │
│                    └─ Sair          │
└─────────────────────────────────────┘
```

## ✨ Features Implementadas

✅ Cadastro com validação
✅ Login com tratamento de erros
✅ Logout automático
✅ Persistência de autenticação (localStorage)
✅ Recuperação de autenticação ao recarregar
✅ Topbar dinâmica com dados do usuário
✅ Proteção de rotas
✅ Redireciono automático para login
✅ Notificações de sucesso/erro
✅ Links entre páginas de autenticação

## ⏳ Próximas Melhorias (Opcional)

- [ ] Refresh token automático
- [ ] Redirect para última página antes do logout
- [ ] Confirmação de logout
- [ ] "Lembrar de mim" (30 dias)
- [ ] Recuperação de senha
- [ ] Google/GitHub OAuth
