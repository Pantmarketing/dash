import { TrendingUp, DollarSign, Target, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface InvestmentSummaryProps {
  totalInvestment: number;
  totalRevenue: number;
  totalProfit: number;
  roas: number;
}

export default function InvestmentSummary({ 
  totalInvestment, 
  totalRevenue, 
  totalProfit, 
  roas 
}: InvestmentSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const marginPercentage = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100) : 0;
  const isPositive = totalProfit > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center">
          <TrendingUp className="w-6 h-6 mr-3 text-blue-600" />
          Resumo Financeiro da Campanha
        </h3>
        <div className={`flex items-center px-4 py-2 rounded-xl ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {isPositive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
          <span className="font-semibold">{marginPercentage.toFixed(1)}% de margem</span>
        </div>
      </div>
      
      {/* Fluxo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Investimento */}
        <div className="text-center">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-2xl mb-4">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-medium text-red-600 mb-2">INVESTIMENTO</p>
            <p className="text-3xl font-bold text-red-700 mb-2">{formatCurrency(totalInvestment)}</p>
            <p className="text-xs text-red-500">Valor aplicado em tráfego</p>
          </div>
        </div>

        {/* Seta */}
        <div className="flex items-center justify-center">
          <div className="hidden lg:flex items-center">
            <div className="w-16 h-1 bg-gradient-to-r from-red-300 to-blue-300 rounded-full"></div>
            <ArrowRight className="w-6 h-6 text-slate-400 mx-2" />
            <div className="w-16 h-1 bg-gradient-to-r from-blue-300 to-green-300 rounded-full"></div>
          </div>
        </div>

        {/* Receita */}
        <div className="text-center">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-medium text-blue-600 mb-2">RECEITA TOTAL</p>
            <p className="text-3xl font-bold text-blue-700 mb-2">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-blue-500">Valor faturado total</p>
          </div>
        </div>
      </div>

      {/* Resultado Final */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${isPositive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-2 rounded-2xl p-6 text-center`}>
          <div className={`inline-flex items-center justify-center w-16 h-16 ${isPositive ? 'bg-green-500' : 'bg-red-500'} rounded-2xl mb-4`}>
            <Target className="w-8 h-8 text-white" />
          </div>
          <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'} mb-2`}>
            {isPositive ? 'LUCRO LÍQUIDO' : 'PREJUÍZO'}
          </p>
          <p className={`text-4xl font-bold ${isPositive ? 'text-green-700' : 'text-red-700'} mb-2`}>
            {formatCurrency(Math.abs(totalProfit))}
          </p>
          <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? 'Resultado positivo' : 'Resultado negativo'}
          </p>
        </div>

        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500 rounded-2xl mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm font-medium text-purple-600 mb-2">ROAS</p>
          <p className="text-4xl font-bold text-purple-700 mb-2">{roas.toFixed(2)}x</p>
          <p className="text-sm text-purple-600">
            Para cada R$ 1 investido, retornou R$ {roas.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Indicadores Adicionais */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-slate-500 mb-1">Status da Campanha</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isPositive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isPositive ? '✓ Lucrativa' : '✗ Com Prejuízo'}
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Eficiência do ROAS</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              roas >= 2 
                ? 'bg-green-100 text-green-800' 
                : roas >= 1 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {roas >= 2 ? 'Excelente' : roas >= 1 ? 'Regular' : 'Baixo'}
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Meta Recomendada</p>
            <span className="text-sm font-medium text-slate-700">
              ROAS ≥ 2.0x
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
