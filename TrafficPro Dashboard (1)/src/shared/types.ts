import z from "zod";

export const DashboardSchema = z.object({
  id: z.number(),
  name: z.string(),
  business_model: z.enum([
    "lead_para_vendedor",
    "venda_direta", 
    "lead_instagram",
    "lead_mensagens"
  ]),
  sheets_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string()
});

export const DashboardDataSchema = z.object({
  id: z.number(),
  dashboard_id: z.number(),
  date: z.string(),
  investment: z.number(),
  clicks: z.number(),
  leads: z.number(),
  conversations: z.number(),
  sales: z.number(),
  revenue: z.number(),
  page_views: z.number().default(0),
  checkouts: z.number().default(0),
  meetings: z.number().default(0),
  average_ticket: z.number().default(0),
  profile_clicks: z.number().default(0),
  followers: z.number().default(0),
  messages: z.number().default(0),
  created_at: z.string(),
  updated_at: z.string()
});

export type Dashboard = z.infer<typeof DashboardSchema>;
export type DashboardData = z.infer<typeof DashboardDataSchema>;

export const BUSINESS_MODEL_LABELS = {
  lead_para_vendedor: "Geração de lead para vendedor",
  venda_direta: "Produto de venda direta",
  lead_instagram: "Geração de lead no Instagram", 
  lead_mensagens: "Geração de lead para mensagens"
} as const;

// Funnel configurations for different business models
export const FUNNEL_CONFIGS = {
  lead_para_vendedor: {
    stages: ['clicks', 'leads', 'conversations', 'sales'],
    labels: ['Cliques', 'Leads', 'Conversas', 'Vendas'],
    colors: ['bg-blue-500', 'bg-orange-500', 'bg-purple-500', 'bg-green-500']
  },
  venda_direta: {
    stages: ['clicks', 'page_views', 'checkouts', 'sales'],
    labels: ['Cliques', 'Visualizações', 'Checkouts', 'Vendas'],
    colors: ['bg-blue-500', 'bg-indigo-500', 'bg-orange-500', 'bg-green-500']
  },
  lead_instagram: {
    stages: ['profile_clicks', 'followers', 'messages', 'sales'],
    labels: ['Perfil Cliques', 'Seguidores', 'Mensagens', 'Vendas'],
    colors: ['bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-green-500']
  },
  lead_mensagens: {
    stages: ['clicks', 'leads', 'messages', 'sales'],
    labels: ['Cliques', 'Leads', 'Mensagens', 'Vendas'],
    colors: ['bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-emerald-500']
  }
} as const;
