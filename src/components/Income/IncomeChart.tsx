import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import { LevelIncomeDetailModal } from './LevelIncomeDetailModal';
import { OrbitIncomeRecord } from '../../types';

interface IncomeChartProps {
  getLevelIncomes: () => Promise<{ level: number; amount: string; ramaAmount: string }[]>;
  getIncomeHistory: (orbitId: number) => Promise<OrbitIncomeRecord[]>;
}

export const IncomeChart: React.FC<IncomeChartProps> = ({ getLevelIncomes, getIncomeHistory }) => {
  const [levelIncomes, setLevelIncomes] = useState<{ level: number; amount: string; ramaAmount: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalIncomeUSD, setTotalIncomeUSD] = useState(0);
  const [totalIncomeRAMA, setTotalIncomeRAMA] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  useEffect(() => {
    const loadIncomes = async () => {
      try {
        const incomes = await getLevelIncomes();
        setLevelIncomes(incomes);
        const totalUSD = incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
        const totalRAMA = incomes.reduce((sum, income) => sum + parseFloat(income.ramaAmount), 0);
        setTotalIncomeUSD(totalUSD);
        setTotalIncomeRAMA(totalRAMA);
      } catch (error) {
        console.error('Failed to load incomes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIncomes();
  }, [getLevelIncomes]);

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 glow-blue">
        <div className="animate-pulse">
          <div className="h-5 sm:h-6 bg-gray-700 rounded w-1/3 mb-3 sm:mb-4" />
          <div className="space-y-2 sm:space-y-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-4">
                <div className="w-16 sm:w-20 h-3 sm:h-4 bg-gray-700 rounded flex-shrink-0" />
                <div className="flex-1 h-4 sm:h-6 bg-gray-700 rounded" />
                <div className="w-12 sm:w-16 h-3 sm:h-4 bg-gray-700 rounded flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const maxAmount = Math.max(...levelIncomes.map(income => parseFloat(income.amount)));

  return (
    <div className="glass-card rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 glow-blue">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-100">Level Income Breakdown</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-950/50 border border-emerald-500/50 rounded-lg glow-green">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            <span className="text-sm sm:text-base font-bold text-emerald-300">${totalIncomeUSD.toFixed(2)} USD</span>
          </div>
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-950/50 border border-cyan-500/50 rounded-lg glow-blue">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <span className="text-sm sm:text-base font-bold text-cyan-300">{totalIncomeRAMA.toFixed(2)} RAMA</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {levelIncomes.map((income) => {
          const percentage = maxAmount > 0 ? (parseFloat(income.amount) / maxAmount) * 100 : 0;
          const levelPercentage = income.level === 1 ? 50 : 5;
          
          return (
            <div 
              key={income.level} 
              className="flex items-center gap-2 sm:gap-4 cursor-pointer hover:bg-gray-800/30 p-2 sm:p-3 rounded-lg transition-colors border border-transparent hover:border-gray-600/50"
              onClick={() => setSelectedLevel(income.level)}
            >
              <div className="w-16 sm:w-20 text-xs sm:text-sm font-medium text-gray-400 flex-shrink-0">
                Level {income.level}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">{levelPercentage}%</span>
                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-medium text-gray-100">${income.amount} USD</div>
                    <div className="text-xs text-gray-400">{income.ramaAmount} RAMA</div>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 sm:h-3 border border-gray-700">
                  <div 
                    className={`h-2 sm:h-3 rounded-full transition-all duration-500 ${
                      income.level === 1 
                        ? 'bg-gradient-to-r from-emerald-400 to-green-600 glow-green'
                        : 'bg-gradient-to-r from-cyan-400 to-blue-600 glow-blue'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-700/50">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>Level 1 pays 50%, Levels 2-9 pay 5% each • Click levels for details</span>
        </div>
      </div>

      <LevelIncomeDetailModal
        level={selectedLevel || 1}
        isOpen={selectedLevel !== null}
        onClose={() => setSelectedLevel(null)}
        getIncomeHistory={getIncomeHistory}
      />
    </div>
  );
};