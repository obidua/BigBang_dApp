import { useState, useEffect, useCallback } from 'react';
import { User, Orbit, TeamMember, OrbitIncomeRecord, ContractState } from '../types';

export const useContract = (address: string | null) => {
  const [contractState, setContractState] = useState<ContractState>({
    totalUsers: 1247,
    totalRepurchases: 89,
    totalVolumeUSD: '45,780',
    joinAmountRAMA: '2.45',
    joinAmountUSD: '5.00'
  });

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock user data for demo
  const mockUser: User = {
    address: address || '',
    userId: 1248,
    isRegistered: true,
    registrationTime: Date.now() - 86400000 * 15, // 15 days ago
    sponsor: '0x742d35Cc6124C4532C5bF29F90Dd98f8C38EC8e6',
    totalEarningsUSD: 127.50,
    totalEarningsRAMA: 62.35,
    repurchaseCount: 2,
    currentOrbitX: 7,
    orbitCount: 3
  };

  useEffect(() => {
    if (address) {
      setUser(mockUser);
    } else {
      setUser(null);
    }
  }, [address]);

  const registerAndActivate = useCallback(async (sponsorAddress: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock registration process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle sponsor ID or address
      let resolvedSponsor = sponsorAddress;
      
      // Check if it's a numeric ID (not starting with 0x and is a valid number)
      if (!sponsorAddress.startsWith('0x') && !isNaN(Number(sponsorAddress))) {
        const sponsorId = parseInt(sponsorAddress);
        // Convert ID to mock address format
        resolvedSponsor = `0x${sponsorId.toString(16).padStart(40, '0')}`;
      }
      
      setUser({ 
        ...mockUser, 
        isRegistered: true,
        sponsor: resolvedSponsor
      });
      return true;
    } catch (err) {
      setError('Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrbits = useCallback(async (): Promise<Orbit[]> => {
    // Mock orbit data
    return [
      {
        orbitId: 0,
        completedX: 10,
        xSlots: Array(10).fill(null).map((_, i) => ({
          totalUSD: '5000000',
          parts: [{
            usdValue: '5000000',
            ramaAmount: '2450000000000000000',
            from: '0x123...',
            donorId: 'user123',
            level: 1
          }]
        }))
      },
      {
        orbitId: 1,
        completedX: 10,
        xSlots: Array(10).fill(null).map((_, i) => ({
          totalUSD: '5000000',
          parts: [{
            usdValue: '5000000',
            ramaAmount: '2450000000000000000',
            from: '0x456...',
            donorId: 'user456',
            level: 2
          }]
        }))
      },
      {
        orbitId: 2,
        completedX: 7,
        xSlots: Array(7).fill(null).map((_, i) => ({
          totalUSD: '5000000',
          parts: [{
            usdValue: '5000000',
            ramaAmount: '2450000000000000000',
            from: '0x789...',
            donorId: 'user789',
            level: 1
          }]
        })).concat([{
          totalUSD: '3200000',
          parts: [{
            usdValue: '3200000',
            ramaAmount: '1568000000000000000',
            from: '0xabc...',
            donorId: 'user999',
            level: 3
          }]
        }])
      }
    ];
  }, []);

  const getTeamAtLevel = useCallback(async (level: number): Promise<TeamMember[]> => {
    // Mock team data
    return Array(Math.floor(Math.random() * 20) + 5).fill(null).map((_, i) => ({
      wallet: `0x${Math.random().toString(16).substr(2, 40)}`,
      incomeEarned: (Math.random() * 50).toFixed(2),
      incomeEarnedRAMA: (Math.random() * 25).toFixed(2),
      registrationTime: Date.now() - Math.random() * 86400000 * 30,
      sponsor: address || ''
    }));
  }, [address]);

  const getIncomeHistory = useCallback(async (orbitId: number): Promise<OrbitIncomeRecord[]> => {
    // Mock income history
    return Array(Math.floor(Math.random() * 20) + 10).fill(null).map((_, i) => ({
      coin: 'RAMA',
      amount: (Math.random() * 5).toString(),
      usd: (Math.random() * 10).toString(),
      timestamp: Date.now() - Math.random() * 86400000 * 7,
      donorId: `user${Math.floor(Math.random() * 1000)}`,
      level: Math.floor(Math.random() * 9) + 1
    }));
  }, []);

  const getLevelIncomes = useCallback(async (): Promise<{ level: number; amount: string }[]> => {
    // Mock level income data
    return Array(9).fill(null).map((_, i) => ({
      level: i + 1,
      amount: (Math.random() * 25).toFixed(2),
      ramaAmount: (Math.random() * 12).toFixed(2)
    }));
  }, []);

  return {
    contractState,
    user,
    loading,
    error,
    registerAndActivate,
    getOrbits,
    getTeamAtLevel,
    getIncomeHistory,
    getLevelIncomes
  };
};