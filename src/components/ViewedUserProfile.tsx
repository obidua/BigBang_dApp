import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Circle, 
  TrendingUp, 
  Users, 
  Repeat, 
  DollarSign, 
  CheckCircle, 
  Clock,
  Home,
  Settings,
  LogOut,
  User as UserIcon,
  MapPin,
  Link,
  Code,
  Copy,
  ExternalLink
} from 'lucide-react';
import { User, ContractState, Orbit } from '../types';
import { StatsCards } from './Dashboard/StatsCards';
import { OrbitProgress } from './Dashboard/OrbitProgress';
import { RecentActivity } from './Dashboard/RecentActivity';
import { OrbitsList } from './Orbits/OrbitsList';
import { TeamTree } from './Team/TeamTree';
import { IncomeChart } from './Income/IncomeChart';

interface ViewedUserProfileProps {
  userId: number;
  onBack: () => void;
}

export const ViewedUserProfile: React.FC<ViewedUserProfileProps> = ({ userId, onBack }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Generate mock user data based on userId
  const generateMockUser = (id: number): User => {
    const baseAddress = `0x${id.toString(16).padStart(40, '0')}`;
    const registrationDays = Math.floor(Math.random() * 365) + 1;
    const earnings = Math.random() * 500 + 50;
    const earningsRAMA = earnings * 0.49; // Approximate RAMA equivalent
    const repurchases = Math.floor(Math.random() * 5);
    const currentX = Math.floor(Math.random() * 11);
    const orbits = Math.floor(Math.random() * 3) + 1;
    const sponsorId = Math.max(1, id - 1); // Ensure sponsor ID is at least 1

    return {
      address: baseAddress,
      userId: id,
      isRegistered: true,
      registrationTime: Date.now() - (registrationDays * 86400000),
      sponsor: `0x${sponsorId.toString(16).padStart(40, '0')}`,
      totalEarningsUSD: earnings,
      totalEarningsRAMA: earningsRAMA,
      repurchaseCount: repurchases,
      currentOrbitX: currentX,
      orbitCount: orbits
    };
  };

  const generateMockContractState = (): ContractState => ({
    totalUsers: 1247 + userId,
    totalRepurchases: 89 + Math.floor(userId / 10),
    totalVolumeUSD: (45780 + userId * 10).toLocaleString(),
    joinAmountRAMA: '2.45',
    joinAmountUSD: '5.00'
  });

  const mockUser = generateMockUser(userId);
  const mockContractState = generateMockContractState();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
  };
  // Mock functions for the viewed user
  const mockGetOrbits = async (): Promise<Orbit[]> => {
    const orbits: Orbit[] = [];
    
    for (let i = 0; i < mockUser.orbitCount; i++) {
      const completedX = i < mockUser.orbitCount - 1 ? 10 : mockUser.currentOrbitX;
      
      orbits.push({
        orbitId: i,
        completedX,
        xSlots: Array(completedX).fill(null).map((_, j) => ({
          totalUSD: '5000000',
          parts: [{
            usdValue: '5000000',
            ramaAmount: '2450000000000000000',
            from: `0x${(userId + j).toString(16).padStart(40, '0')}`,
            donorId: `user${userId + j}`,
            level: Math.floor(Math.random() * 9) + 1
          }]
        }))
      });
    }
    
    return orbits;
  };

  const mockGetTeamAtLevel = async (level: number) => {
    return Array(Math.floor(Math.random() * 15) + 3).fill(null).map((_, i) => ({
      wallet: `0x${Math.random().toString(16).substr(2, 40)}`,
      incomeEarned: (Math.random() * 30).toFixed(2),
      incomeEarnedRAMA: (Math.random() * 15).toFixed(2),
      registrationTime: Date.now() - Math.random() * 86400000 * 20,
      sponsor: mockUser.address
    }));
  };

  const mockGetIncomeHistory = async (orbitId: number) => {
    return Array(Math.floor(Math.random() * 15) + 8).fill(null).map((_, i) => ({
      coin: 'RAMA',
      amount: (Math.random() * 4).toString(),
      usd: (Math.random() * 8).toString(),
      timestamp: Date.now() - Math.random() * 86400000 * 5,
      donorId: `user${Math.floor(Math.random() * 500)}`,
      level: Math.floor(Math.random() * 9) + 1
    }));
  };

  const mockGetLevelIncomes = async () => {
    return Array(9).fill(null).map((_, i) => ({
      level: i + 1,
      amount: (Math.random() * 20).toFixed(2),
      ramaAmount: (Math.random() * 10).toFixed(2)
    }));
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'orbits', label: 'Orbits', icon: Circle },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'income', label: 'Income', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <StatsCards user={mockUser} contractState={mockContractState} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <OrbitProgress currentX={mockUser.currentOrbitX} />
              <RecentActivity getIncomeHistory={mockGetIncomeHistory} />
            </div>
          </div>
        );

      case 'orbits':
        return <OrbitsList getOrbits={mockGetOrbits} />;

      case 'team':
        return <TeamTree getTeamAtLevel={mockGetTeamAtLevel} />;

      case 'income':
        return <IncomeChart getLevelIncomes={mockGetLevelIncomes} getIncomeHistory={mockGetIncomeHistory} />;

      case 'profile':
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* User Information Card */}
            <div className="glass-card rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow glow-blue">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center glow-blue">
                  <UserIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-100">User Profile</h2>
                  <p className="text-sm sm:text-base text-gray-400">ID: #{mockUser.userId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Wallet Address
                    </label>
                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <code className="text-xs sm:text-sm text-gray-100 flex-1 break-all">{mockUser.address}</code>
                      <button
                        onClick={() => copyToClipboard(mockUser.address)}
                        className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <UserIcon className="w-4 h-4 inline mr-2" />
                      Sponsor Address
                    </label>
                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <code className="text-xs sm:text-sm text-gray-100 flex-1 break-all">{mockUser.sponsor}</code>
                      <button
                        onClick={() => copyToClipboard(mockUser.sponsor)}
                        className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Link className="w-4 h-4 inline mr-2" />
                      Referral Link
                    </label>
                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <code className="text-xs sm:text-sm text-gray-100 flex-1 break-all">
                        https://bigbang.app/ref/{mockUser.address}
                      </code>
                      <button
                        onClick={() => copyToClipboard(`https://bigbang.app/ref/${mockUser.address}`)}
                        className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-3 sm:p-4 hover:bg-blue-950/40 transition-colors glow-blue">
                    <h3 className="font-medium text-cyan-300 mb-3">Account Statistics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-300">Registration Date:</span>
                        <span className="font-medium text-blue-200">
                          {new Date(mockUser.registrationTime).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Total Earnings:</span>
                       <span className="font-medium text-blue-200">${mockUser.totalEarningsUSD.toFixed(2)} USD</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-blue-300">Total Earnings (RAMA):</span>
                       <span className="font-medium text-blue-200">{mockUser.totalEarningsRAMA.toFixed(2)} RAMA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Repurchases:</span>
                        <span className="font-medium text-blue-200">{mockUser.repurchaseCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Current Orbit:</span>
                        <span className="font-medium text-blue-200">{mockUser.orbitCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Contract Addresses */}
            <div className="glass-card rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow glow-blue">
              <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Smart Contract Information
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">BigBang Contract</label>
                  <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <code className="text-xs sm:text-sm text-gray-100 flex-1 break-all">0x1234567890123456789012345678901234567890</code>
                    <button
                      onClick={() => copyToClipboard('0x1234567890123456789012345678901234567890')}
                      className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">RAMA Token Contract</label>
                  <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <code className="text-xs sm:text-sm text-gray-100 flex-1 break-all">0x0987654321098765432109876543210987654321</code>
                    <button
                      onClick={() => copyToClipboard('0x0987654321098765432109876543210987654321')}
                      className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Price Feed Contract</label>
                  <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <code className="text-xs sm:text-sm text-gray-100 flex-1 break-all">0xabcdefabcdefabcdefabcdefabcdefabcdefabcd</code>
                    <button
                      onClick={() => copyToClipboard('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd')}
                      className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Dev Fund Address</label>
                  <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <code className="text-xs sm:text-sm text-gray-100 flex-1 break-all">0xfedcbafedcbafedcbafedcbafedcbafedcbafed</code>
                    <button
                      onClick={() => copyToClipboard('0xfedcbafedcbafedcbafedcbafedcbafedcbafed')}
                      className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-yellow-950/30 border border-yellow-500/50 rounded-lg">
                <p className="text-xs sm:text-sm text-yellow-300">
                  <strong>Note:</strong> These are placeholder addresses for demonstration. 
                  Replace with actual deployed contract addresses.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative">
      {/* Sidebar */}
      <div className="hidden lg:flex w-64 bg-gradient-to-b from-gray-950 via-blue-950 to-purple-950 text-white h-screen flex-col border-r border-gray-700/50">
        <div className="p-4 sm:p-6 border-b border-gray-700/50 bg-gradient-to-r from-transparent to-blue-950/20">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-lg flex items-center justify-center glow-blue animate-pulse">
              <Circle className="w-3 h-3 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent neon-text">BigBang</h1>
              <p className="text-xs text-gray-400">User #{userId}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <ul className="space-y-1 sm:space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg glow-blue'
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white hover:glow-blue'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 sm:p-4 border-t border-gray-700/50 space-y-2">
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-200 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-medium">Back</span>
          </button>
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-gray-300 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:text-white transition-all duration-200 text-sm sm:text-base hover:glow-red"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-medium">Exit View</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={onBack}
                className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <div className="px-2.5 sm:px-3 py-1 bg-blue-950/50 text-cyan-300 border border-cyan-500/50 rounded-full text-xs sm:text-sm font-medium glow-blue">
                Viewing Mode
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 glow-blue">
                <span className="text-xs sm:text-sm font-medium text-gray-100">12.456 RAMA</span>
              </div>
              
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-950/50 to-purple-950/50 border border-blue-500/30 rounded-lg px-2 sm:px-4 py-2 glow-blue">
                <span className="text-xs sm:text-sm font-medium text-gray-100">{formatAddress(mockUser.address)}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-transparent to-slate-950/20">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};