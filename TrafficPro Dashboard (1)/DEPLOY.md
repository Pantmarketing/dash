# 🚀 Deploy do Pant Marketing Dashboard

## Cloudflare Pages (GRATUITO - RECOMENDADO)

### Passo 1: Preparar o Projeto
```bash
npm run build
```

### Passo 2: Configurar Cloudflare Pages
1. Acesse: https://pages.cloudflare.com
2. Clique em "Create a project"
3. Conecte com GitHub
4. Selecione o repositório: `Pantmarketing/dash`

### Passo 3: Configurações de Build
- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Root directory:** `TrafficPro Dashboard (1)`

### Passo 4: Configurar Domínio Personalizado
1. No painel do Cloudflare Pages
2. Vá em "Custom domains"
3. Adicione seu domínio do Hostinger
4. Configure os DNS no Hostinger:
   - Tipo: CNAME
   - Nome: @ (ou www)
   - Valor: [seu-projeto].pages.dev

### Passo 5: Configurar Banco de Dados (D1)
```bash
# No terminal do projeto
npx wrangler d1 create pant-marketing-db
```

Adicione no `wrangler.jsonc`:
```json
{
  "database": {
    "binding": "DB",
    "database_name": "pant-marketing-db",
    "database_id": "SEU_DATABASE_ID"
  }
}
```

## Alternativas

### Vercel
1. Acesse: https://vercel.com
2. Conecte GitHub
3. Deploy automático

### Netlify
1. Acesse: https://netlify.com
2. Conecte GitHub
3. Deploy automático

## Configuração de Domínio no Hostinger

Para qualquer opção, configure no painel do Hostinger:

1. Vá em "DNS Zone"
2. Adicione registro CNAME:
   - **Nome:** @ ou www
   - **Valor:** [endereço-fornecido-pela-plataforma]

## Variáveis de Ambiente

Certifique-se de configurar:
- `NODE_ENV=production`
- Senha de admin (se necessário)

## 🎉 Pronto!

Seu dashboard estará disponível em:
- Cloudflare: `https://seu-dominio.com`
- Deploy automático a cada push no GitHub!