import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, TrendingUp, DollarSign, Target, Users, MousePointer, ShoppingCart, Download, RefreshCw, Edit3, ExternalLink } from 'lucide-react';
import type { Dashboard as DashboardType, DashboardData } from '@/shared/types';
import { BUSINESS_MODEL_LABELS } from '@/shared/types';
import MetricCard from '@/react-app/components/MetricCard';
import FunnelChart from '@/react-app/components/FunnelChart';
import TimelineChart from '@/react-app/components/TimelineChart';
import InvestmentSummary from '@/react-app/components/InvestmentSummary';

export default function Dashboard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<DashboardType | null>(null);
  const [data, setData] = useState<DashboardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [newSheetsUrl, setNewSheetsUrl] = useState('');

  useEffect(() => {
    if (id) {
      fetchDashboard();
    }
  }, [id]);

  const fetchDashboard = async () => {
    try {
      const response = await fetch(`/api/dashboards/${id}`);
      const dashboardData = await response.json();
      setDashboard(dashboardData);
      setData(dashboardData.data || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportData = async () => {
    setIsImporting(true);
    try {
      const response = await fetch(`/api/dashboards/${id}/import-sheets`, {
        method: 'POST'
      });
      
      if (response.ok) {
        await fetchDashboard();
      }
    } catch (error) {
      console.error('Error importing data:', error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleUpdateSheetsUrl = async () => {
    try {
      const response = await fetch(`/api/dashboards/${id}/sheets-url`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sheets_url: newSheetsUrl })
      });
      
      if (response.ok) {
        setDashboard(prev => prev ? { ...prev, sheets_url: newSheetsUrl } : null);
        setIsEditingUrl(false);
        setNewSheetsUrl('');
      }
    } catch (error) {
      console.error('Error updating sheets URL:', error);
    }
  };

  const startEditingUrl = () => {
    setNewSheetsUrl(dashboard?.sheets_url || '');
    setIsEditingUrl(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Dashboard não encontrado</h2>
          <button
            onClick={() => navigate('/dashboards')}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Voltar para dashboards
          </button>
        </div>
      </div>
    );
  }

  // Calculations
  const totals = data.reduce((acc, item) => ({
    investment: acc.investment + item.investment,
    revenue: acc.revenue + item.revenue,
    clicks: acc.clicks + item.clicks,
    leads: acc.leads + item.leads,
    conversations: acc.conversations + item.conversations,
    sales: acc.sales + item.sales,
    page_views: acc.page_views + (item.page_views || 0),
    checkouts: acc.checkouts + (item.checkouts || 0),
    meetings: acc.meetings + (item.meetings || 0),
    profile_clicks: acc.profile_clicks + (item.profile_clicks || 0),
    followers: acc.followers + (item.followers || 0),
    messages: acc.messages + (item.messages || 0)
  }), { 
    investment: 0, revenue: 0, clicks: 0, leads: 0, conversations: 0, sales: 0,
    page_views: 0, checkouts: 0, meetings: 0, profile_clicks: 0, followers: 0, messages: 0
  });

  const profit = totals.revenue - totals.investment;
  const roas = totals.investment > 0 ? totals.revenue / totals.investment : 0;
  const cpa = totals.sales > 0 ? totals.investment / totals.sales : 0;
  const cpl = totals.leads > 0 ? totals.investment / totals.leads : 0;
  const averageTicket = totals.sales > 0 ? totals.revenue / totals.sales : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboards')}
                className="mr-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="inline-flex items-center justify-center w-10 h-10 mr-3">
                <img src="/logo.svg" alt="Pant Marketing" className="w-full h-full" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{dashboard.name}</h1>
                <p className="text-sm text-slate-600">{BUSINESS_MODEL_LABELS[dashboard.business_model]}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  const publicUrl = `${window.location.origin}/public/dashboard/${id}`;
                  navigator.clipboard.writeText(publicUrl);
                  alert('Link copiado! Compartilhe com seu cliente.\nSenha: cliente123');
                }}
                className="flex items-center px-4 py-2 text-green-600 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Compartilhar
              </button>
              <button
                onClick={startEditingUrl}
                className="flex items-center px-4 py-2 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Editar Planilha
              </button>
              <button
                onClick={handleImportData}
                disabled={isImporting}
                className="flex items-center px-4 py-2 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImporting ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {isImporting ? 'Importando...' : 'Importar Dados'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modal for editing sheets URL */}
        {isEditingUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Editar Link da Planilha</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    URL do Google Sheets
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={newSheetsUrl}
                      onChange={(e) => setNewSheetsUrl(e.target.value)}
                      className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                    />
                    <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-700">
                    <strong>Importante:</strong> Após alterar o link, clique em "Importar Dados" para carregar os novos dados da planilha.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsEditingUrl(false);
                    setNewSheetsUrl('');
                  }}
                  className="px-4 py-2 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateSheetsUrl}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
        {data.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-4">
              <TrendingUp className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-2">Nenhum dado encontrado</h3>
            <p className="text-slate-600 mb-6">Importe dados da planilha do Google Sheets configurada</p>
            <button
              onClick={handleImportData}
              disabled={isImporting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? (
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Download className="w-5 h-5 mr-2" />
              )}
              {isImporting ? 'Importando...' : 'Importar Dados da Planilha'}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Main Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <MetricCard
                title="Investimento Total"
                value={formatCurrency(totals.investment)}
                icon={<DollarSign className="w-6 h-6" />}
                color="red"
              />
              <MetricCard
                title="Receita Total"
                value={formatCurrency(totals.revenue)}
                icon={<TrendingUp className="w-6 h-6" />}
                color="blue"
              />
              <MetricCard
                title="Lucro Líquido"
                value={formatCurrency(profit)}
                icon={<Target className="w-6 h-6" />}
                color="green"
              />
              <MetricCard
                title="ROAS"
                value={`${roas.toFixed(2)}x`}
                subtitle="Return on Ad Spend"
                icon={<TrendingUp className="w-6 h-6" />}
                color="purple"
              />
              <MetricCard
                title="CPL"
                value={formatCurrency(cpl)}
                subtitle="Custo por Lead"
                icon={<Users className="w-6 h-6" />}
                color="orange"
              />
              <MetricCard
                title="Ticket Médio"
                value={formatCurrency(averageTicket)}
                icon={<ShoppingCart className="w-6 h-6" />}
                color="blue"
              />
            </div>

            {/* Investment Summary */}
            <InvestmentSummary
              totalInvestment={totals.investment}
              totalRevenue={totals.revenue}
              totalProfit={profit}
              roas={roas}
            />

            {/* Funnel and Additional Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FunnelChart data={totals} businessModel={dashboard.business_model} />
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard
                    title="CPA"
                    value={formatCurrency(cpa)}
                    subtitle="Custo por Aquisição"
                    icon={<Target className="w-5 h-5" />}
                    color="red"
                  />
                  <MetricCard
                    title="Total de Cliques"
                    value={totals.clicks}
                    icon={<MousePointer className="w-5 h-5" />}
                    color="blue"
                  />
                </div>
                
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Taxas de Conversão</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Cliques → Leads</span>
                      <span className="font-bold text-slate-800">
                        {totals.clicks > 0 ? ((totals.leads / totals.clicks) * 100).toFixed(1) : '0.0'}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Leads → Conversas</span>
                      <span className="font-bold text-slate-800">
                        {totals.leads > 0 ? ((totals.conversations / totals.leads) * 100).toFixed(1) : '0.0'}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Conversas → Vendas</span>
                      <span className="font-bold text-slate-800">
                        {totals.conversations > 0 ? ((totals.sales / totals.conversations) * 100).toFixed(1) : '0.0'}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Chart */}
            <TimelineChart data={data} />
          </div>
        )}
      </main>
    </div>
  );
}
