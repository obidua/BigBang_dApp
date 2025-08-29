import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { StatsCards } from './components/Dashboard/StatsCards';
import { OrbitProgress } from './components/Dashboard/OrbitProgress';
import { RecentActivity } from './components/Dashboard/RecentActivity';
import { OrbitsList } from './components/Orbits/OrbitsList';
import { TeamTree } from './components/Team/TeamTree';
import { IncomeChart } from './components/Income/IncomeChart';
import { RegistrationModal } from './components/Registration/RegistrationModal';
import { WalletButton } from './components/WalletConnection/WalletButton';
import { ViewedUserProfile } from './components/ViewedUserProfile';
import { useWallet } from './hooks/useWallet';
import { useContract } from './hooks/useContract';
import { Circle, Search, Copy, ExternalLink, User, MapPin, Link, Code } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRegistration, setShowRegistration] = useState(false);
  const [viewedUserId, setViewedUserId] = useState<number | null>(null);
  const [userIdInput, setUserIdInput] = useState('');
  const [showRegistrationDemo, setShowRegistrationDemo] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [referralSponsor, setReferralSponsor] = useState<string | null>(null);
  
  const wallet = useWallet();
  const contract = useContract(wallet.address);

  // Check for referral parameters in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref');
    if (refParam) {
      setReferralSponsor(refParam);
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You can add a toast notification here
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleViewUserById = () => {
    const id = parseInt(userIdInput);
    if (!isNaN(id) && id > 0) {
      setViewedUserId(id);
    }
  };

  const handleBackFromViewedProfile = () => {
    setViewedUserId(null);
    setUserIdInput('');
  };
  const handleRegistration = () => {
    if (!wallet.isConnected) {
      wallet.connectWallet();
      return;
    }
    setShowRegistration(true);
  };

  // If viewing a user profile by ID
  if (viewedUserId !== null) {
    return (
      <ViewedUserProfile 
        userId={viewedUserId} 
        onBack={handleBackFromViewedProfile}
      />
    );
  }

  // If showing registration demo
  if (showRegistrationDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&#39;60&#39; height=&#39;60&#39; viewBox=&#39;0 0 60 60&#39; xmlns=&#39;http://www.w3.org/2000/svg&#39;%3E%3Cg fill=&#39;none&#39; fill-rule=&#39;evenodd&#39;%3E%3Cg fill=&#39;%23ffffff&#39; fill-opacity=&#39;0.02&#39;%3E%3Ccircle cx=&#39;30&#39; cy=&#39;30&#39; r=&#39;1&#39;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md w-full relative z-10 glow-blue">
          <button
            onClick={() => setShowRegistrationDemo(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 glow-blue animate-pulse">
              <Circle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 neon-text">Welcome to BigBang</h1>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
              Join the orbit ecosystem and start earning through our multi-level system
            </p>
            
            <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-left glow-blue">
              <h3 className="font-medium text-cyan-300 mb-2">Registration Details</h3>
              <div className="text-sm text-blue-200 space-y-1">
                <div className="flex justify-between">
                  <span>Sponsor:</span>
                  <span className="font-medium">Address or ID</span>
                </div>
                <div className="flex justify-between">
                  <span>Join Amount:</span>
                  <span className="font-medium">2.45 RAMA</span>
                </div>
                <div className="flex justify-between">
                  <span>USD Value:</span>
                  <span className="font-medium">$5.00</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 font-medium mb-3 sm:mb-4 text-sm sm:text-base glow-blue">
              Register Now (Demo)
            </button>

            <button
              onClick={() => setShowRegistrationDemo(false)}
              className="w-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors font-medium text-sm sm:text-base border border-gray-600"
            >
              Back to Main
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (!wallet.isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&#39;60&#39; height=&#39;60&#39; viewBox=&#39;0 0 60 60&#39; xmlns=&#39;http://www.w3.org/2000/svg&#39;%3E%3Cg fill=&#39;none&#39; fill-rule=&#39;evenodd&#39;%3E%3Cg fill=&#39;%23ffffff&#39; fill-opacity=&#39;0.02&#39;%3E%3Ccircle cx=&#39;30&#39; cy=&#39;30&#39; r=&#39;1&#39;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md w-full glow-blue relative z-10">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 glow-blue animate-pulse">
              <Circle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 neon-text">BigBang</h1>
            <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8">
              Connect your wallet to access the decentralized orbit ecosystem
            </p>
            <WalletButton
              isConnected={wallet.isConnected}
              isConnecting={wallet.isConnecting}
              onConnect={wallet.connectWallet}
              address={wallet.address}
            />
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <button
                onClick={() => setShowRegistrationDemo(true)}
                className="w-full mb-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 font-medium text-sm sm:text-base glow-green"
              >
                View Registration Page
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-3 sm:mb-4">View User Profile</h3>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                Enter a user ID to view their public profile and orbit progress
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="number"
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  placeholder="Enter User ID"
                  className="flex-1 px-3 sm:px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base text-gray-100 placeholder-gray-400"
                  min="1"
                />
                <button
                  onClick={handleViewUserById}
                  disabled={!userIdInput.trim() || isNaN(parseInt(userIdInput)) || parseInt(userIdInput) <= 0}
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base glow-blue"
                >
                  <Search className="w-4 h-4" />
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!contract.user?.isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&#39;60&#39; height=&#39;60&#39; viewBox=&#39;0 0 60 60&#39; xmlns=&#39;http://www.w3.org/2000/svg&#39;%3E%3Cg fill=&#39;none&#39; fill-rule=&#39;evenodd&#39;%3E%3Cg fill=&#39;%23ffffff&#39; fill-opacity=&#39;0.02&#39;%3E%3Ccircle cx=&#39;30&#39; cy=&#39;30&#39; r=&#39;1&#39;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md w-full glow-blue relative z-10">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6 glow-blue animate-pulse">
              <Circle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2 neon-text">Welcome to BigBang</h1>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
              Join the orbit ecosystem and start earning through our multi-level system
            </p>
            
            <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-left glow-blue">
              <h3 className="font-medium text-cyan-300 mb-2">Registration Details</h3>
              <div className="text-sm text-blue-200 space-y-1">
                <div className="flex justify-between">
                  <span>Sponsor:</span>
                  <span className="font-medium">Address or ID</span>
                </div>
                <div className="flex justify-between">
                  <span>Join Amount:</span>
                  <span className="font-medium">{contract.contractState.joinAmountRAMA} RAMA</span>
                </div>
                <div className="flex justify-between">
                  <span>USD Value:</span>
                  <span className="font-medium">${contract.contractState.joinAmountUSD}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleRegistration}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-all duration-300 font-medium text-sm sm:text-base glow-blue"
            >
              Register Now
            </button>

            <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-700">
              <WalletButton
                isConnected={wallet.isConnected}
                isConnecting={wallet.isConnecting}
                onConnect={wallet.connectWallet}
                address={wallet.address}
              />
            </div>
          </div>
        </div>

        <RegistrationModal
          isOpen={showRegistration}
          onClose={() => setShowRegistration(false)}
          onRegister={contract.registerAndActivate}
          joinAmountRAMA={contract.contractState.joinAmountRAMA}
          joinAmountUSD={contract.contractState.joinAmountUSD}
          defaultSponsor={referralSponsor}
        />
      </div>
    );
  }

  const renderContent = () => {
    if (!contract.user) return null;

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <StatsCards user={contract.user} contractState={contract.contractState} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <OrbitProgress currentX={contract.user.currentOrbitX} />
              <RecentActivity getIncomeHistory={contract.getIncomeHistory} />
            </div>
          </div>
        );

      case 'orbits':
        return <OrbitsList getOrbits={contract.getOrbits} />;

      case 'team':
        return <TeamTree getTeamAtLevel={contract.getTeamAtLevel} />;

      case 'income':
        return <IncomeChart getLevelIncomes={contract.getLevelIncomes} getIncomeHistory={contract.getIncomeHistory} />;

      case 'profile':
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* User Information Card */}
            <div className="glass-card rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow glow-blue">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center glow-blue">
                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-100">User Profile</h2>
                  <p className="text-sm sm:text-base text-gray-400">ID: #{contract.user.userId}</p>
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
                      <code className="text-xs sm:text-sm text-gray-100 flex-1 break-all">{contract.user.address}</code>
                      <button
                        onClick={() => copyToClipboard(contract.user.address)}
                        className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Sponsor Address
                    </label>
                    <div className="flex items-center gap-2 p-2 sm:p-3 bg-gray-800/50 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors">
                      <code className="text-xs sm:text-sm text-gray-100 flex-1 break-all">{contract.user.sponsor}</code>
                      <button
                        onClick={() => copyToClipboard(contract.user.sponsor)}
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
                        https://bigbang.app/ref/{contract.user.address}
                      </code>
                      <button
                        onClick={() => copyToClipboard(`https://bigbang.app/ref/${contract.user.address}`)}
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
                          {new Date(contract.user.registrationTime).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Total Earnings:</span>
                        <span className="font-medium text-blue-200">${contract.user.totalEarningsUSD.toFixed(2)} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Total Earnings (RAMA):</span>
                        <span className="font-medium text-blue-200">{contract.user.totalEarningsRAMA.toFixed(2)} RAMA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Repurchases:</span>
                        <span className="font-medium text-blue-200">{contract.user.repurchaseCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">Current Orbit:</span>
                        <span className="font-medium text-blue-200">{contract.user.orbitCount}</span>
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
      case 'settings':

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onDisconnect={wallet.disconnectWallet}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header 
          activeTab={activeTab}
          address={wallet.address!} 
          balance={wallet.balance}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-transparent to-slate-950/20">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;