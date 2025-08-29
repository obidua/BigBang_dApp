import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Calendar } from 'lucide-react';
import { TeamMember } from '../../types';

interface TeamTreeProps {
  getTeamAtLevel: (level: number) => Promise<TeamMember[]>;
}

export const TeamTree: React.FC<TeamTreeProps> = ({ getTeamAtLevel }) => {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTeam = async () => {
      setLoading(true);
      try {
        const members = await getTeamAtLevel(selectedLevel);
        setTeamMembers(members);
      } catch (error) {
        console.error('Failed to load team:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, [selectedLevel, getTeamAtLevel]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="glass-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 glow-blue">
      <div className="p-4 sm:p-6 border-b border-gray-700/50">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mb-3 sm:mb-4">Team Structure</h2>
        
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                selectedLevel === level
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white glow-blue'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600'
              }`}
            >
              Level {level}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 text-gray-400">
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">
              {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">
              ${teamMembers.reduce((sum, member) => sum + parseFloat(member.incomeEarned), 0).toFixed(2)} USD • {teamMembers.reduce((sum, member) => sum + parseFloat(member.incomeEarnedRAMA), 0).toFixed(2)} RAMA
            </span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3 sm:space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-700 rounded-lg">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-700 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-3 sm:h-4 bg-gray-700 rounded w-1/3 mb-1.5 sm:mb-2" />
                  <div className="h-2.5 sm:h-3 bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-400">
            <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
            <p>No team members at this level yet</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-700 rounded-lg hover:bg-gray-800/30 transition-colors hover:border-gray-600">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs sm:text-sm flex-shrink-0 glow-blue">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-medium text-gray-100">{formatAddress(member.wallet)}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Joined {formatDate(member.registrationTime)}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      ${member.incomeEarned} USD
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {member.incomeEarnedRAMA} RAMA
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-xs sm:text-sm font-medium text-gray-100">${member.incomeEarned} USD</div>
                  <div className="text-xs text-gray-400">{member.incomeEarnedRAMA} RAMA</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};