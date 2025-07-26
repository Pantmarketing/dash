import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/react-app/hooks/useAuth';
import { Plus, TrendingUp, Calendar, ExternalLink, LogOut } from 'lucide-react';
import type { Dashboard } from '@/shared/types';
import { BUSINESS_MODEL_LABELS } from '@/shared/types';

export default function Dashboards() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboards();
  }, []);

  const fetchDashboards = async () => {
    try {
      const response = await fetch('/api/dashboards');
      const data = await response.json();
      setDashboards(data);
    } catch (error) {
      console.error('Error fetching dashboards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="inline-flex items-center justify-center w-10 h-10 mr-3">
                <img src="/logo.svg" alt="Pant Marketing" className="w-full h-full" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Pant Marketing</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-slate-600 hover:text-slate-800 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Meus Dashboards</h2>
            <p className="text-slate-600 mt-2">Gerencie suas campanhas de tráfego pago</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/new')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Dashboard
          </button>
        </div>

        {dashboards.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-4">
              <TrendingUp className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-2">Nenhum dashboard criado</h3>
            <p className="text-slate-600 mb-6">Crie seu primeiro dashboard para começar a monitorar suas campanhas</p>
            <button
              onClick={() => navigate('/dashboard/new')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboards.map((dashboard) => (
              <div
                key={dashboard.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => navigate(`/dashboard/${dashboard.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {dashboard.name}
                    </h3>
                    <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-slate-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      {BUSINESS_MODEL_LABELS[dashboard.business_model]}
                    </div>
                    
                    <div className="flex items-center text-sm text-slate-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      Criado em {new Date(dashboard.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    
                    {dashboard.sheets_url && (
                      <div className="flex items-center text-sm text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Google Sheets conectado
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
