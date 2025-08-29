import React, { useState, useEffect } from 'react';
import { X, Loader, Check } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (sponsor: string) => Promise<boolean>;
  joinAmountRAMA: string;
  joinAmountUSD: string;
  defaultSponsor?: string | null;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegister,
  joinAmountRAMA,
  joinAmountUSD,
  defaultSponsor
}) => {
  const [sponsor, setSponsor] = useState(defaultSponsor || '');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Update sponsor when defaultSponsor changes
  useEffect(() => {
    if (defaultSponsor) {
      setSponsor(defaultSponsor);
    }
  }, [defaultSponsor]);

  if (!isOpen) return null;

  const handleRegister = async () => {
    if (!sponsor.trim()) return;
    
    setLoading(true);
    try {
      const success = await onRegister(sponsor);
      if (success) {
        setStep(3);
        setTimeout(() => {
          onClose();
          setStep(1);
          setSponsor('');
        }, 2000);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 sm:mb-6 pr-8">Join BigBang</h2>
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sponsor Address or ID
                </label>
                <input
                  type="text"
                  value={sponsor}
                  onChange={(e) => setSponsor(e.target.value)}
                  placeholder="0x... or User ID (e.g., 1234)"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm sm:text-base text-gray-100 placeholder-gray-400"
                />
                {defaultSponsor && (
                  <p className="mt-1 text-xs text-cyan-400">
                    Pre-filled from referral link
                  </p>
                )}
              </div>
              
              <div className="bg-blue-950/30 border border-blue-500/30 rounded-lg p-3 sm:p-4 glow-blue">
                <h3 className="font-medium text-cyan-300 mb-2">Registration Fee</h3>
                <div className="text-sm text-blue-200">
                  <div className="flex justify-between">
                    <span>Amount (RAMA):</span>
                    <span className="font-medium">{joinAmountRAMA}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>USD Value:</span>
                    <span className="font-medium">${joinAmountUSD}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-600 rounded-lg hover:bg-gray-800/50 transition-colors text-sm sm:text-base text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!sponsor.trim()}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base glow-blue"
              >
                Continue
              </button>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 sm:mb-6 pr-8">Confirm Registration</h2>
            <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Sponsor:</span>
                  <span className="font-medium text-gray-100 break-all text-right ml-2">
                    {sponsor.length > 10 ? `${sponsor.slice(0, 6)}...${sponsor.slice(-4)}` : sponsor}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment:</span>
                  <span className="font-medium text-gray-100">{joinAmountRAMA} RAMA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">USD Value:</span>
                  <span className="font-medium text-gray-100">${joinAmountUSD}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-600 rounded-lg hover:bg-gray-800/50 transition-colors disabled:opacity-50 text-sm sm:text-base text-gray-300"
              >
                Back
              </button>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base glow-blue"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register & Pay'
                )}
              </button>
            </div>
          </>
        );

      case 3:
        return (
          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-950/50 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 glow-green">
              <Check className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-2">Registration Successful!</h2>
            <p className="text-sm sm:text-base text-gray-300 mb-4">
              Welcome to BigBang! Your orbit journey begins now.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-xl max-w-md w-full p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto glow-blue">
        {step < 3 && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
        
        {renderStep()}
      </div>
    </div>
  );
};