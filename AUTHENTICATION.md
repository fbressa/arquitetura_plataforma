# Autenticação Frontend - Documentação de Implementação

## ✅ O que foi implementado

### 1. **API Client Atualizada** (`lib/api.ts`)
- ✅ `loginRequest()` - Conecta com `POST /auth/login` do backend
- ✅ `authenticatedRequest()` - Helper para requisições autenticadas com Bearer token
- ✅ `getMeRequest()` - Exemplo de requisição protegida
- ✅ URL dinâmica via `NEXT_PUBLIC_API_URL` (`.env.local`)

**Response esperada do backend:**
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "admin"
  }
}
```

### 2. **AppContext Melhorado** (`app/context/AppContext.tsx`)
- ✅ Persistência de token em `localStorage`
- ✅ Persistência de usuário em `localStorage`
- ✅ Recovery automático ao carregar página (hydration)
- ✅ Função `logout()` que limpa tudo
- ✅ Propriedade `isAuthenticated` para verificar login
- ✅ Novo handler `setToken()` que salva em localStorage automaticamente
- ✅ Novo handler `setUserInfo()` que salva em localStorage automaticamente

**Uso:**
```tsx
const { token, userInfo, isAuthenticated, logout } = useAppContext();
```

### 3. **PrivateRoute Component** (`app/components/PrivateRoute.tsx`)
- ✅ Verifica se usuário está autenticado
- ✅ Redireciona para `/login` se não autenticado
- ✅ Mostra "Redirecionando..." enquanto verifica

**Uso em layout:**
```tsx
// app/(protected)/layout.tsx
<PrivateRoute>
  {children}
</PrivateRoute>
```

### 4. **Página de Login Atualizada** (`app/login/page.tsx`)
- ✅ Extrai `access_token` da resposta do backend
- ✅ Extrai `user` com dados reais (id, name, email, role)
- ✅ Salva token e user via `setToken()` e `setUserInfo()`
- ✅ Estado de loading durante requisição
- ✅ Validação de resposta (lança erro se token ou user ausentes)
- ✅ Log de debug para facilitar troubleshooting
- ✅ Redireciona para `/` ao login bem-sucedido

### 5. **Variáveis de Ambiente** (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🔄 Fluxo de Autenticação

```
1. Usuário acessa /login
   ↓
2. Preenche email/password e clica "Entrar"
   ↓
3. POST http://localhost:3000/auth/login
   ↓
4. Backend retorna { access_token, user }
   ↓
5. Frontend salva token + user em localStorage via AppContext
   ↓
6. Redireciona para /
   ↓
7. PrivateRoute verifica isAuthenticated = true
   ↓
8. Renderiza componente protegido
```

## 🛡️ Protegendo Rotas

### Opção 1: Layout Group com PrivateRoute
Crie layout em `app/(protected)/layout.tsx`:

```tsx
"use client";
import PrivateRoute from "@/app/components/PrivateRoute";

export default function ProtectedLayout({ children }) {
  return <PrivateRoute>{children}</PrivateRoute>;
}
```

Então coloque rotas dentro de `app/(protected)/`:
- `app/(protected)/clientes/page.tsx`
- `app/(protected)/reembolsos/page.tsx`
- `app/(protected)/relatorios/page.tsx`

### Opção 2: PrivateRoute Manual
Coloque diretamente no componente:

```tsx
import PrivateRoute from "@/app/components/PrivateRoute";

export default function ClientesPage() {
  return (
    <PrivateRoute>
      {/* seu conteúdo */}
    </PrivateRoute>
  );
}
```

## 📡 Usando Requisições Autenticadas

```tsx
import { authenticatedRequest } from "@/lib/api";
import { useAppContext } from "@/app/context/AppContext";

export default function MyComponent() {
  const { token } = useAppContext();

  async function fetchData() {
    const data = await authenticatedRequest("/clients", token);
    console.log(data);
  }

  return <button onClick={fetchData}>Carregar Clientes</button>;
}
```

## 🧪 Testando a Autenticação

### 1. Iniciar Backend
```bash
cd engnet-api
npm run start:dev
```
Backend rodando em `http://localhost:3000`

### 2. Iniciar Frontend
```bash
npm run dev
```
Frontend rodando em `http://localhost:3000` (próxima porta disponível)

### 3. Testar Login
- Acesse `http://localhost:3000/login` (ou porta do Next)
- Use credenciais de teste do seu backend
- Verifique `DevTools → Application → localStorage`:
  - `auth_token` (JWT)
  - `auth_user` (JSON com dados do usuário)

### 4. Testar Proteção
- Abra DevTools e limpe localStorage
- Tente acessar `/clientes` ou `/reembolsos`
- Deve redirecionar para `/login`

## 🔧 Adicionando Mais Requisições Autenticadas

```tsx
// lib/api.ts - adicione novas funções

export async function getClientsRequest(token: string) {
  return authenticatedRequest("/clients", token);
}

export async function createClientRequest(token: string, data: any) {
  return authenticatedRequest("/clients", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getRefundsRequest(token: string) {
  return authenticatedRequest("/refunds", token);
}
```

## ⚠️ Tratamento de Token Expirado

Quando backend retorna `401 Unauthorized`, significa token expirou. Você pode adicionar interceptor:

```tsx
// lib/api.ts - mecanismo de retry

export async function authenticatedRequest(
  endpoint: string,
  token: string,
  options: RequestInit = {}
) {
  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { "Authorization": `Bearer ${token}`, ... },
  });

  // Se token expirou, faz logout
  if (response.status === 401) {
    // Aqui você poderia tentar refresh token
    // Por enquanto, apenas redireciona para login
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
  }

  return response.json();
}
```

## 📋 Checklist Final

- ✅ API Client configurada
- ✅ AppContext com localStorage
- ✅ PrivateRoute component criado
- ✅ Login page funcional
- ✅ `.env.local` configurado
- ⏳ Rotas protegidas (você deve mover páginas para `(protected)`)
- ⏳ Logout button (adicionar no seu layout)
- ⏳ Refresh token (opcional, para segurança extra)

## 🚀 Próximas Etapas

1. Mova `/clientes`, `/reembolsos`, `/relatorios` para `(protected)/`
2. Adicione logout button no layout (chamando `logout()` do context)
3. Teste com seu backend
4. Implemente refresh token se necessário
5. Adicione mais requisições autenticadas conforme precisar
