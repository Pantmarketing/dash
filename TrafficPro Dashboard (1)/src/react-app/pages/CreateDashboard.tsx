import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { BUSINESS_MODEL_LABELS } from '@/shared/types';

export default function CreateDashboard() {
  const [name, setName] = useState('');
  const [businessModel, setBusinessModel] = useState<keyof typeof BUSINESS_MODEL_LABELS>('lead_para_vendedor');
  const [sheetsUrl, setSheetsUrl] = useState('https://docs.google.com/spreadsheets/d/14P8cdVGmCdx-rxbYtcc9IGmw7WPruxUQuijIgGDHb-0');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/dashboards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          business_model: businessModel,
          sheets_url: sheetsUrl || undefined
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        navigate(`/dashboard/${data.id}`);
      }
    } catch (error) {
      console.error('Error creating dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/dashboards')}
              className="mr-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="inline-flex items-center justify-center w-10 h-10 mr-3">
              <img src="/logo.svg" alt="Pant Marketing" className="w-full h-full" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Novo Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Configurar Dashboard</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Nome do Dashboard
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Ex: Campanha Facebook Ads - Janeiro 2025"
                required
              />
            </div>

            <div>
              <label htmlFor="businessModel" className="block text-sm font-medium text-slate-700 mb-2">
                Modelo de Negócio
              </label>
              <select
                id="businessModel"
                value={businessModel}
                onChange={(e) => setBusinessModel(e.target.value as keyof typeof BUSINESS_MODEL_LABELS)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                required
              >
                {Object.entries(BUSINESS_MODEL_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sheetsUrl" className="block text-sm font-medium text-slate-700 mb-2">
                Link do Google Sheets (Opcional)
              </label>
              <div className="relative">
                <input
                  id="sheetsUrl"
                  type="url"
                  value={sheetsUrl}
                  onChange={(e) => setSheetsUrl(e.target.value)}
                  className="w-full px-4 py-3 pr-10 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="https://docs.google.com/spreadsheets/d/14P8cdVGmCdx-rxbYtcc9IGmw7WPruxUQuijIgGDHb-0"
                />
                <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Link da planilha já configurado com os dados das campanhas. Você pode alterar se necessário.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Estrutura esperada da planilha:</h3>
              <p className="text-sm text-blue-700">
                Data | Investimento | Cliques | Leads | Conversas | Vendas | Receita
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboards')}
                className="px-6 py-3 text-slate-600 bg-slate-100 rounded-xl font-medium hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? 'Criando...' : 'Criar Dashboard'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
