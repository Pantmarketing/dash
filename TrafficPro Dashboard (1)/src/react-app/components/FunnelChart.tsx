import { ArrowRight } from 'lucide-react';
import { FUNNEL_CONFIGS } from '@/shared/types';

interface FunnelData {
  clicks: number;
  leads: number;
  conversations: number;
  sales: number;
  page_views: number;
  checkouts: number;
  meetings: number;
  profile_clicks: number;
  followers: number;
  messages: number;
}

interface FunnelChartProps {
  data: FunnelData;
  businessModel: keyof typeof FUNNEL_CONFIGS;
}

export default function FunnelChart({ data, businessModel }: FunnelChartProps) {
  const config = FUNNEL_CONFIGS[businessModel];
  
  const stages = config.stages.map((stage, index) => {
    const value = data[stage as keyof FunnelData] as number;
    const colorClass = config.colors[index];
    const bgColorClass = colorClass.replace('bg-', 'bg-').replace('-500', '-50');
    const textColorClass = colorClass.replace('bg-', 'text-').replace('-500', '-700');
    
    return {
      name: config.labels[index],
      value: value,
      color: colorClass,
      bgColor: bgColorClass,
      textColor: textColorClass
    };
  });
  
  const maxValue = Math.max(...stages.map(stage => stage.value));

  const getConversionRate = (from: number, to: number): string => {
    if (from === 0) return '0%';
    return ((to / from) * 100).toFixed(1) + '%';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Funil de Conversão</h3>
      
      <div className="space-y-4">
        {stages.map((stage, index) => {
          const widthPercentage = maxValue > 0 ? (stage.value / maxValue) * 100 : 0;
          const nextStage = stages[index + 1];
          const conversionRate = nextStage ? getConversionRate(stage.value, nextStage.value) : null;
          
          return (
            <div key={stage.name}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-4 h-4 ${stage.color} rounded-full mr-3`}></div>
                  <span className="font-medium text-slate-700">{stage.name}</span>
                </div>
                <span className="text-2xl font-bold text-slate-800">
                  {stage.value.toLocaleString('pt-BR')}
                </span>
              </div>
              
              <div className="relative">
                <div className={`w-full h-12 ${stage.bgColor} rounded-xl`}>
                  <div
                    className={`h-full ${stage.color} rounded-xl flex items-center justify-center transition-all duration-300`}
                    style={{ width: `${Math.max(widthPercentage, 10)}%` }}
                  >
                    <span className="text-white font-semibold text-sm">
                      {stage.value.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
              
              {conversionRate && index < stages.length - 1 && (
                <div className="flex items-center justify-center mt-2 mb-2">
                  <div className="flex items-center text-slate-600 text-sm font-medium">
                    <ArrowRight className="w-4 h-4 mr-1" />
                    <span className="bg-slate-100 px-2 py-1 rounded-lg">{conversionRate}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
