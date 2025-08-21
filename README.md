# Sistema ERP - Arquitetura SPA

## Visão Geral

Este projeto foi transformado em uma **Single-Page Application (SPA)** completa utilizando Next.js 15 com App Router. A aplicação oferece uma experiência de usuário fluida e reativa, mantendo estado global e navegação sem recarregamento de página.

## Arquitetura SPA Implementada

### 🔧 Componentes Principais

#### 1. **Layout Centralizado**
- **`components/dashboard-layout.tsx`**: Shell principal da aplicação
- Mantém elementos persistentes (sidebar, topbar, notificações)
- Gerencia estado de navegação mobile
- Inclui sistema de loading global

#### 2. **Gerenciamento de Estado Global**
- **`app/context/AppContext.tsx`**: Contexto React para estado da aplicação
- Funcionalidades incluídas:
  - Informações do usuário
  - Sistema de notificações
  - Estado de loading global
  - Controle da sidebar mobile

#### 3. **Sistema de Navegação SPA**
- **`hooks/use-spa-navigation.tsx`**: Hook personalizado para navegação
- Navegação com loading states
- Notificações de transição
- Integração com router do Next.js

#### 4. **Sistema de Notificações**
- **`components/notification-system.tsx`**: Notificações toast persistentes
- Suporte a múltiplos tipos (success, error, warning, info)
- Auto-dismiss configurável
- Posicionamento fixo e responsivo

#### 5. **Loading Global**
- **`components/global-loader.tsx`**: Indicador de carregamento
- Overlay com backdrop blur
- Integrado com estado global

### 🚀 Funcionalidades SPA

#### ✅ Navegação Fluida
- Transições entre páginas sem reload
- Manutenção do estado da aplicação
- Breadcrumbs dinâmicos
- Indicadores visuais de navegação ativa

#### ✅ Estado Persistente
- Dados do usuário mantidos entre páginas
- Notificações que persistem durante navegação
- Configurações de UI preservadas
- Cache de dados do lado do cliente

#### ✅ Performance Otimizada
- Componentes lazy-loaded quando necessário
- Roteamento do lado do cliente
- Prefetch automático de rotas
- Otimização de bundle com Next.js

#### ✅ UX Responsiva
- Loading states durante transições
- Feedback visual para ações do usuário
- Sidebar responsiva para mobile
- Notificações não intrusivas

### 📁 Estrutura de Arquivos

```
app/
├── context/
│   └── AppContext.tsx          # Estado global da aplicação
├── layout.tsx                  # Layout raiz com providers
├── page.tsx                    # Dashboard principal
├── estoque/
│   └── page.tsx               # Página de estoque
├── reembolsos/
│   ├── page.tsx               # Lista de reembolsos
│   └── novo/
│       └── page.tsx           # Nova solicitação
└── vendas/
    └── page.tsx               # Página de vendas

components/
├── dashboard-layout.tsx        # Layout principal da SPA
├── notification-system.tsx    # Sistema de notificações
├── global-loader.tsx          # Loading global
├── app-sidebar.tsx            # Sidebar com navegação
├── app-topbar.tsx             # Barra superior
└── ui/                        # Componentes de interface

hooks/
└── use-spa-navigation.tsx     # Hook de navegação SPA
```

### 🛠️ Como Usar

#### 1. **Navegação Entre Páginas**
```tsx
import Link from "next/link"

// Navegação simples
<Link href="/estoque">Ir para Estoque</Link>

// Navegação com hook personalizado
const { navigate } = useSPANavigation()
navigate("/vendas", true) // true = mostrar notificação
```

#### 2. **Gerenciar Estado Global**
```tsx
import { useAppContext } from "@/app/context/AppContext"

const { userInfo, addNotification, setIsLoading } = useAppContext()

// Adicionar notificação
addNotification({
  type: "success",
  message: "Operação realizada com sucesso!"
})

// Controlar loading
setIsLoading(true)
```

#### 3. **Criar Nova Página**
```tsx
"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAppContext } from "@/app/context/AppContext"

export default function MinhaNovaPage() {
  const { addNotification } = useAppContext()

  return (
    <DashboardLayout>
      {/* Conteúdo da página */}
    </DashboardLayout>
  )
}
```

### 🎯 Benefícios da Arquitetura SPA

1. **Performance Superior**
   - Carregamento inicial mais rápido após primeira visita
   - Transições instantâneas entre páginas
   - Cache eficiente de recursos

2. **Experiência do Usuário**
   - Interface mais responsiva
   - Estados preservados durante navegação
   - Feedback visual consistente

3. **Desenvolvimento**
   - Estado centralizado e previsível
   - Componentes reutilizáveis
   - Debugging facilitado

4. **SEO e Acessibilidade**
   - URLs preservadas para cada rota
   - Histórico de navegação funcional
   - Suporte a deep linking

### 🚀 Executando o Projeto

1. **Instalar dependências:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Executar em desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acessar aplicação:**
   ```
   http://localhost:3000
   ```

### 🧪 Testando a Arquitetura SPA

1. **Navegue entre as páginas** usando os links da sidebar
2. **Teste as notificações** clicando nos botões de demonstração
3. **Observe o estado persistente** - informações ficam mantidas
4. **Verifique os loading states** durante transições
5. **Use o histórico do navegador** - funciona normalmente

### 📈 Próximos Passos

- [ ] Implementar cache de dados com React Query
- [ ] Adicionar autenticação com estado persistente
- [ ] Implementar offline-first com Service Workers
- [ ] Adicionar animações de transição entre páginas
- [ ] Implementar lazy loading para rotas

---

**Desenvolvido com Next.js 15, TypeScript e Tailwind CSS**
