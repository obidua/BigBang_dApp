import React, { useState, useEffect } from 'react';
import { Circle, CheckCircle, Clock, Filter } from 'lucide-react';
import { Orbit } from '../../types';

interface OrbitsListProps {
  getOrbits: () => Promise<Orbit[]>;
}

export const OrbitsList: React.FC<OrbitsListProps> = ({ getOrbits }) => {
  const [orbits, setOrbits] = useState<Orbit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOrbit, setFilterOrbit] = useState<number | null>(null);

  useEffect(() => {
    const loadOrbits = async () => {
      try {
        const orbitData = await getOrbits();
        setOrbits(orbitData);
      } catch (error) {
        console.error('Failed to load orbits:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrbits();
  }, [getOrbits]);

  const filteredOrbits = filterOrbit !== null 
    ? orbits.filter(orbit => orbit.orbitId === filterOrbit)
    : orbits;

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse glass-card rounded-xl p-6 shadow-lg">
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-4" />
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-4" />
            <div className="grid grid-cols-5 gap-2">
              {[...Array(10)].map((_, j) => (
                <div key={j} className="h-12 bg-gray-700 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="glass-card rounded-xl p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 glow-blue">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <span className="text-xs sm:text-sm font-medium text-gray-300">Filter by Orbit:</span>
          </div>
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={() => setFilterOrbit(null)}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filterOrbit === null
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white glow-blue'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600'
              }`}
            >
              All Orbits
            </button>
            {orbits.map((orbit) => (
              <button
                key={orbit.orbitId}
                onClick={() => setFilterOrbit(orbit.orbitId)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  filterOrbit === orbit.orbitId
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white glow-blue'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600'
                }`}
              >
                Orbit #{orbit.orbitId + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredOrbits.length === 0 ? (
        <div className="glass-card rounded-xl p-6 sm:p-8 shadow-lg text-center hover:shadow-xl transition-all duration-300 glow-blue">
          <Circle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-500" />
          <p className="text-gray-400">No orbits found for the selected filter.</p>
        </div>
      ) : (
        filteredOrbits.map((orbit) => {
        const progress = (orbit.completedX / 10) * 100;
        const isComplete = orbit.completedX >= 10;
        
        return (
          <div key={orbit.orbitId} className="glass-card rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 glow-blue">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-100">
                Orbit #{orbit.orbitId + 1}
              </h3>
              <div className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium ${
                isComplete ? 'bg-green-950/50 text-emerald-300 border border-emerald-500/50' : 'bg-blue-950/50 text-cyan-300 border border-cyan-500/50'
              }`}>
                {isComplete ? 'Complete' : 'Active'}
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-400">Progress</span>
                <span className="text-xs sm:text-sm font-bold text-gray-100">{orbit.completedX}/10</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 sm:h-3 border border-gray-600">
                <div 
                  className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                    isComplete
                      ? 'bg-green-950/50 border-emerald-400 text-emerald-400 glow-green'
                      : progress > 0
                      ? 'bg-blue-950/50 border-cyan-400 text-cyan-400 animate-pulse glow-blue'
                      : 'bg-gray-800/50 border-gray-600 text-gray-500'
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {Array.from({ length: 10 }, (_, i) => {
                const isCompleted = i < orbit.completedX;
                const isCurrent = i === orbit.completedX && !isComplete;
                
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-md sm:rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-50 border-green-500 text-green-600'
                        : isCurrent
                        ? 'bg-blue-50 border-blue-500 text-blue-600 animate-pulse'
                        : 'bg-gray-50 border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    ) : isCurrent ? (
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    ) : (
                      <Circle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    )}
                  </div>
                );
              })}
            </div>

            {orbit.completedX < 10 && orbit.xSlots[orbit.completedX] && (
              <div className="bg-blue-950/30 border border-blue-500/50 rounded-lg p-2.5 sm:p-3 glow-blue">
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-cyan-300 font-medium">Current X-Slot</span>
                  <span className="text-blue-200 font-bold">
                    ${(parseFloat(orbit.xSlots[orbit.completedX].totalUSD) / 1000000).toFixed(2)} USD / $5.00 USD
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-blue-300 mt-1">
                  <span>RAMA Progress:</span>
                  <span className="font-medium">
                    {(parseFloat(orbit.xSlots[orbit.completedX].parts[0].ramaAmount) / 1e18).toFixed(2)} / 2.45 RAMA
                  </span>
                </div>
                <div className="w-full bg-blue-900 rounded-full h-1.5 sm:h-2 mt-2 border border-blue-700">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 sm:h-2 rounded-full transition-all duration-300 glow-blue"
                    style={{ width: `${(parseFloat(orbit.xSlots[orbit.completedX].totalUSD) / 5000000) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })
      )}
    </div>
  );
};