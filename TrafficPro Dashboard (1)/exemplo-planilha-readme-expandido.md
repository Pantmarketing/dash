# Planilhas de Exemplo para Diferentes Tipos de Funis

## Estrutura Completa da Planilha

A planilha deve ter exatamente as seguintes colunas na ordem especificada:

| Coluna | Descrição | Exemplo |
|--------|-----------|---------|
| **Data** | Data da campanha no formato DD/MM/AAAA | 01/01/2025 |
| **Investimento** | Valor investido em reais | 500 |
| **Cliques** | Número total de cliques nos anúncios | 1250 |
| **Visualizações** | Visualizações de página/produto | 850 |
| **Leads** | Número de leads gerados | 85 |
| **Conversas** | Número de leads que iniciaram conversa | 42 |
| **Reuniões** | Número de reuniões agendadas | 15 |
| **Checkouts** | Número de checkouts iniciados | 35 |
| **Vendas** | Número de vendas realizadas | 8 |
| **Receita** | Receita total gerada em reais | 4800 |
| **Ticket Médio** | Valor médio por venda | 600 |
| **Perfil Cliques** | Cliques no perfil (Instagram) | 1250 |
| **Seguidores** | Novos seguidores ganhos | 85 |
| **Mensagens** | Mensagens enviadas/recebidas | 850 |

## Tipos de Funis e Métricas Específicas

### 1. Geração de Lead para Vendedor
- **Fluxo:** Cliques → Leads → Conversas → Vendas
- **Métricas principais:** CPL, Taxa de conversão lead-conversa, Taxa de fechamento
- **Colunas relevantes:** Data, Investimento, Cliques, Leads, Conversas, Vendas, Receita
- **Arquivo de exemplo:** exemplo-planilha-dashboards.csv

### 2. Produto de Venda Direta / E-commerce
- **Fluxo:** Cliques → Visualizações → Checkouts → Vendas
- **Métricas principais:** CPA, ROAS, Taxa de conversão checkout, Ticket médio
- **Colunas relevantes:** Data, Investimento, Cliques, Visualizações, Checkouts, Vendas, Receita, Ticket Médio
- **Arquivo de exemplo:** exemplo-planilha-venda-direta.csv

### 3. Geração de Lead no Instagram
- **Fluxo:** Perfil Cliques → Seguidores → Mensagens → Vendas
- **Métricas principais:** CPL, Engajamento, Taxa de conversão seguidores, Taxa de mensagens
- **Colunas relevantes:** Data, Investimento, Perfil Cliques, Seguidores, Mensagens, Vendas, Receita
- **Arquivo de exemplo:** exemplo-planilha-instagram.csv

### 4. Geração de Lead para Mensagens / WhatsApp
- **Fluxo:** Cliques → Leads → Mensagens → Vendas
- **Métricas principais:** CPL, Taxa de resposta, Taxa de conversão mensagens
- **Colunas relevantes:** Data, Investimento, Cliques, Leads, Mensagens, Vendas, Receita
- **Arquivo de exemplo:** exemplo-planilha-mensagens.csv

## Arquivos de Exemplo Inclusos

### 1. exemplo-planilha-dashboards.csv (Lead para Vendedor)
- **Período:** 01/01/2025 a 30/01/2025
- **Investimento total:** R$ 18.070
- **Receita total:** R$ 180.600
- **ROAS médio:** 10x
- **Funil:** Cliques → Leads → Conversas → Vendas

### 2. exemplo-planilha-venda-direta.csv (E-commerce)
- **Período:** 01/01/2025 a 30/01/2025
- **Investimento total:** R$ 18.070
- **Receita total:** R$ 180.600
- **Funil:** Cliques → Visualizações → Checkouts → Vendas
- **Taxa de checkout:** ~27% das visualizações
- **Taxa de conversão:** ~23% dos checkouts

### 3. exemplo-planilha-instagram.csv (Instagram)
- **Período:** 01/01/2025 a 30/01/2025
- **Investimento total:** R$ 18.070
- **Receita total:** R$ 180.600
- **Funil:** Perfil Cliques → Seguidores → Mensagens → Vendas
- **Taxa de seguimento:** ~6% dos cliques no perfil
- **Taxa de mensagem:** ~67% dos seguidores

### 4. exemplo-planilha-mensagens.csv (WhatsApp/Telegram)
- **Período:** 01/01/2025 a 30/01/2025
- **Investimento total:** R$ 18.070
- **Receita total:** R$ 180.600
- **Funil:** Cliques → Leads → Mensagens → Vendas
- **Taxa de mensagem:** ~67% dos leads
- **Taxa de conversão:** ~1% das mensagens

## Como Usar

1. **Escolha o arquivo** correspondente ao seu tipo de funil
2. **Copie os dados** do arquivo CSV escolhido
3. **Cole em uma nova planilha** do Google Sheets
4. **Configure o link** da planilha no dashboard
5. **Importe os dados** usando o botão "Importar Dados"

## Personalização dos Dados

Você pode personalizar os dados conforme seu negócio:

### Para E-commerce / Venda Direta:
- Ajuste a taxa de visualização (quantos veem o produto por clique)
- Modifique a taxa de checkout (quantos iniciam compra)
- Altere o ticket médio conforme seu produto

### Para Instagram:
- Ajuste quantos cliques no perfil geram seguidores
- Modifique quantos seguidores enviam mensagens
- Adapte a taxa de conversão de mensagens para vendas

### Para WhatsApp/Mensagens:
- Altere a taxa de resposta aos leads
- Modifique a taxa de conversão de mensagens
- Ajuste o volume de mensagens por lead

## Estrutura Flexível

O sistema detecta automaticamente quais colunas têm dados e adapta o funil:
- **Colunas com dados = 0 ou vazias** são ignoradas no funil
- **Colunas com dados > 0** são incluídas no fluxo
- O funil se adapta automaticamente baseado no tipo de negócio selecionado

## Exemplo de URLs das Planilhas

Você pode acessar versões online destas planilhas em:
- Lead para Vendedor: `https://docs.google.com/spreadsheets/d/[ID_PLANILHA_LEAD_VENDEDOR]`
- Venda Direta: `https://docs.google.com/spreadsheets/d/[ID_PLANILHA_VENDA_DIRETA]`
- Instagram: `https://docs.google.com/spreadsheets/d/[ID_PLANILHA_INSTAGRAM]`
- Mensagens: `https://docs.google.com/spreadsheets/d/[ID_PLANILHA_MENSAGENS]`

Substitua `[ID_PLANILHA_XXX]` pelo ID da sua planilha no Google Sheets correspondente.
