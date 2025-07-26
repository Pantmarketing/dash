import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: Env }>();

app.use("/*", cors());

// Simple password authentication
const PASSWORD = "agencia123";

// Login endpoint
app.post("/api/login", 
  zValidator("json", z.object({ password: z.string() })),
  async (c) => {
    const { password } = c.req.valid("json");
    
    if (password === PASSWORD) {
      return c.json({ success: true });
    }
    
    return c.json({ error: "Invalid password" }, 401);
  }
);

// Dashboard schemas
const DashboardSchema = z.object({
  name: z.string(),
  business_model: z.enum([
    "lead_para_vendedor",
    "venda_direta", 
    "lead_instagram",
    "lead_mensagens"
  ]),
  sheets_url: z.string().optional()
});

const DashboardDataSchema = z.object({
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
  messages: z.number().default(0)
});

// Create dashboard
app.post("/api/dashboards",
  zValidator("json", DashboardSchema),
  async (c) => {
    const data = c.req.valid("json");
    
    const result = await c.env.DB.prepare(
      "INSERT INTO dashboards (name, business_model, sheets_url) VALUES (?, ?, ?)"
    ).bind(data.name, data.business_model, data.sheets_url || null).run();
    
    return c.json({ id: result.meta.last_row_id, ...data });
  }
);

// Get all dashboards
app.get("/api/dashboards", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM dashboards ORDER BY created_at DESC"
  ).all();
  
  return c.json(results);
});

// Get dashboard by ID
app.get("/api/dashboards/:id", async (c) => {
  const id = c.req.param("id");
  
  const dashboard = await c.env.DB.prepare(
    "SELECT * FROM dashboards WHERE id = ?"
  ).bind(id).first();
  
  if (!dashboard) {
    return c.json({ error: "Dashboard not found" }, 404);
  }
  
  const { results: data } = await c.env.DB.prepare(
    "SELECT * FROM dashboard_data WHERE dashboard_id = ? ORDER BY date ASC"
  ).bind(id).all();
  
  return c.json({ ...dashboard, data });
});

// Add data to dashboard
app.post("/api/dashboards/:id/data",
  zValidator("json", z.array(DashboardDataSchema)),
  async (c) => {
    const id = c.req.param("id");
    const dataArray = c.req.valid("json");
    
    // Clear existing data
    await c.env.DB.prepare(
      "DELETE FROM dashboard_data WHERE dashboard_id = ?"
    ).bind(id).run();
    
    // Insert new data
    for (const data of dataArray) {
      await c.env.DB.prepare(
        `INSERT INTO dashboard_data 
         (dashboard_id, date, investment, clicks, leads, conversations, sales, revenue, page_views, checkouts, meetings, average_ticket, profile_clicks, followers, messages)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        id, data.date, data.investment, data.clicks, 
        data.leads, data.conversations, data.sales, data.revenue,
        data.page_views || 0, data.checkouts || 0, data.meetings || 0,
        data.average_ticket || 0, data.profile_clicks || 0, data.followers || 0, data.messages || 0
      ).run();
    }
    
    return c.json({ success: true });
  }
);

// Helper function to parse CSV properly handling quotes and commas
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current.trim());
  return result;
}

// Helper function to parse Brazilian number format
function parseNumber(str: string): number {
  if (!str) return 0;
  
  // Remove any non-numeric characters except comma and dot
  let cleaned = str.replace(/[^\d.,\-]/g, '');
  
  // Handle Brazilian format (use comma as decimal separator)
  // If there's both comma and dot, assume dot is thousands separator
  if (cleaned.includes(',') && cleaned.includes('.')) {
    // Format like 1.234,56 -> remove dots, replace comma with dot
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes(',')) {
    // Format like 1234,56 -> replace comma with dot
    cleaned = cleaned.replace(',', '.');
  }
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// Helper function to parse Google Sheets data
async function fetchGoogleSheetsData(sheetsUrl: string): Promise<any[]> {
  try {
    // Extract spreadsheet ID from URL
    const match = sheetsUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      throw new Error('Invalid Google Sheets URL');
    }
    
    const spreadsheetId = match[1];
    
    // Use the public CSV export endpoint
    const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=0`;
    
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
    }
    
    const csvText = await response.text();
    console.log('CSV Response length:', csvText.length);
    console.log('First 500 chars:', csvText.substring(0, 500));
    
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('Sheet appears to be empty or has no data rows');
    }
    
    // Parse header to understand column structure
    const headerValues = parseCSVLine(lines[0]);
    console.log('Headers found:', headerValues);
    
    // Skip header row
    const dataLines = lines.slice(1);
    const parsedData = [];
    
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      if (!line.trim()) continue;
      
      const values = parseCSVLine(line);
      console.log(`Row ${i + 1} values:`, values);
      
      if (values.length < 7) {
        console.log(`Skipping row ${i + 1}: insufficient columns (${values.length})`);
        continue;
      }
      
      // Map columns based on expected format
      // Expected: Data, Investimento, Cliques, [Visualizações], Leads, Conversas, [Reuniões], [Checkouts], Vendas, Receita, [Ticket Médio], [Perfil Cliques], [Seguidores], [Mensagens]
      let dateStr = values[0];
      let investmentStr = values[1];
      let clicksStr = values[2];
      let leadsStr, conversationsStr, salesStr, revenueStr;
      let pageViewsStr = '0', meetingsStr = '0', checkoutsStr = '0';
      let ticketMedioStr = '0', perfilCliquesStr = '0', seguidoresStr = '0', mensagensStr = '0';
      
      if (values.length === 7) {
        // Basic format: Data, Investimento, Cliques, Leads, Conversas, Vendas, Receita
        [, , , leadsStr, conversationsStr, salesStr, revenueStr] = values;
      } else if (values.length >= 10) {
        // Extended format with more columns
        if (values.length === 14) {
          // Full format: Data, Investimento, Cliques, Visualizações, Leads, Conversas, Reuniões, Checkouts, Vendas, Receita, Ticket Médio, Perfil Cliques, Seguidores, Mensagens
          [, , , pageViewsStr, leadsStr, conversationsStr, meetingsStr, checkoutsStr, salesStr, revenueStr, ticketMedioStr, perfilCliquesStr, seguidoresStr, mensagensStr] = values;
        } else {
          // Partial extended format, try to map correctly
          pageViewsStr = values[3] || '0';
          leadsStr = values[4] || values[3]; // Fallback if no page views
          conversationsStr = values[5] || values[4];
          salesStr = values[values.length - 2]; // Second to last should be sales
          revenueStr = values[values.length - 1]; // Last should be revenue
        }
      } else {
        // Try to map remaining columns
        leadsStr = values[3];
        conversationsStr = values[4];
        salesStr = values[5];
        revenueStr = values[6];
      }
      
      // Parse date (try different formats)
      let date: Date;
      if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else if (dateStr.includes('-')) {
        date = new Date(dateStr);
      } else {
        console.log(`Skipping row ${i + 1}: invalid date format ${dateStr}`);
        continue;
      }
      
      if (isNaN(date.getTime())) {
        console.log(`Skipping row ${i + 1}: invalid date ${dateStr}`);
        continue;
      }
      
      const investment = parseNumber(investmentStr);
      const clicks = parseInt(clicksStr) || 0;
      const page_views = parseInt(pageViewsStr) || 0;
      const leads = parseInt(leadsStr) || 0;
      const conversations = parseInt(conversationsStr) || 0;
      const meetings = parseInt(meetingsStr) || 0;
      const checkouts = parseInt(checkoutsStr) || 0;
      const sales = parseInt(salesStr) || 0;
      const revenue = parseNumber(revenueStr);
      // Calculate average ticket dynamically from revenue and sales
      const average_ticket = sales > 0 ? revenue / sales : parseNumber(ticketMedioStr);
      const profile_clicks = parseInt(perfilCliquesStr) || 0;
      const followers = parseInt(seguidoresStr) || 0;
      const messages = parseInt(mensagensStr) || 0;
      
      const rowData = {
        date: date.toISOString().split('T')[0],
        investment,
        clicks,
        page_views,
        leads,
        conversations,
        meetings,
        checkouts,
        sales,
        revenue,
        average_ticket,
        profile_clicks,
        followers,
        messages
      };
      
      console.log(`Parsed row ${i + 1}:`, rowData);
      parsedData.push(rowData);
    }
    
    console.log(`Successfully parsed ${parsedData.length} rows`);
    return parsedData;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw error;
  }
}

// Update dashboard sheets URL
app.put("/api/dashboards/:id/sheets-url",
  zValidator("json", z.object({ sheets_url: z.string() })),
  async (c) => {
    const id = c.req.param("id");
    const { sheets_url } = c.req.valid("json");
    
    await c.env.DB.prepare(
      "UPDATE dashboards SET sheets_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(sheets_url, id).run();
    
    return c.json({ success: true });
  }
);

// Public dashboard authentication
app.post("/api/dashboards/:id/public-auth",
  zValidator("json", z.object({ password: z.string() })),
  async (c) => {
    const { password } = c.req.valid("json");
    
    // Simple password for public dashboard access
    // In production, each dashboard could have its own password
    if (password === "cliente123") {
      return c.json({ success: true });
    }
    
    return c.json({ error: "Invalid password" }, 401);
  }
);

// Import data from Google Sheets
app.post("/api/dashboards/:id/import-sheets", async (c) => {
  const id = c.req.param("id");
  
  try {
    // Get dashboard to check if it has a sheets URL
    const dashboard = await c.env.DB.prepare(
      "SELECT * FROM dashboards WHERE id = ?"
    ).bind(id).first();
    
    if (!dashboard) {
      return c.json({ error: "Dashboard not found" }, 404);
    }
    
    let sheetsUrl = dashboard.sheets_url as string;
    
    // If no URL configured, use the default one provided by the customer
    if (!sheetsUrl) {
      sheetsUrl = "https://docs.google.com/spreadsheets/d/14P8cdVGmCdx-rxbYtcc9IGmw7WPruxUQuijIgGDHb-0";
    }
    
    console.log(`Importing data from: ${sheetsUrl}`);
    
    // Fetch data from Google Sheets
    const sheetData = await fetchGoogleSheetsData(sheetsUrl);
    
    if (sheetData.length === 0) {
      return c.json({ 
        error: "No data found in the spreadsheet", 
        details: "Verifique se a planilha tem dados e está pública ou configurada para 'Anyone with the link can view'"
      }, 400);
    }
    
    console.log(`Importing ${sheetData.length} rows to dashboard ${id}`);
    
    // Clear existing data
    await c.env.DB.prepare(
      "DELETE FROM dashboard_data WHERE dashboard_id = ?"
    ).bind(id).run();
    
    // Insert new data
    for (const data of sheetData) {
      await c.env.DB.prepare(
        `INSERT INTO dashboard_data 
         (dashboard_id, date, investment, clicks, leads, conversations, sales, revenue, page_views, checkouts, meetings, average_ticket, profile_clicks, followers, messages)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        id, data.date, data.investment, data.clicks, 
        data.leads, data.conversations, data.sales, data.revenue,
        data.page_views || 0, data.checkouts || 0, data.meetings || 0,
        data.average_ticket || 0, data.profile_clicks || 0, data.followers || 0, data.messages || 0
      ).run();
    }
    
    console.log(`Successfully imported ${sheetData.length} rows`);
    return c.json({ 
      success: true, 
      imported: sheetData.length,
      message: `Importados ${sheetData.length} registros com sucesso`
    });
    
  } catch (error) {
    console.error('Import error:', error);
    
    let errorMessage = "Erro ao importar dados do Google Sheets";
    let details = error instanceof Error ? error.message : "Erro desconhecido";
    
    // Provide more specific error messages
    if (details.includes("403") || details.includes("Forbidden")) {
      errorMessage = "Acesso negado à planilha";
      details = "Verifique se a planilha está configurada como pública ou se o link está correto";
    } else if (details.includes("404") || details.includes("Not Found")) {
      errorMessage = "Planilha não encontrada";
      details = "Verifique se o link da planilha está correto";
    } else if (details.includes("Invalid Google Sheets URL")) {
      errorMessage = "URL inválida";
      details = "O link fornecido não é um link válido do Google Sheets";
    }
    
    return c.json({ 
      error: errorMessage,
      details: details
    }, 500);
  }
});

export default app;
