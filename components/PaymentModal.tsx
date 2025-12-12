import React, { useState, useRef } from 'react';
import { Plan, PaymentMethod, VerificationStatus } from '../types';
import { verifyPaymentScreenshot } from '../services/geminiService';
import { Loader2, Upload, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { SUPPORT_NAME_EASYPAISA, SUPPORT_NAME_JAZZCASH, SUPPORT_PHONE_EASYPAISA, SUPPORT_PHONE_JAZZCASH } from '../constants';

interface PaymentModalProps {
  plan: Plan;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ plan, onClose, onSuccess }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [status, setStatus] = useState<VerificationStatus>(VerificationStatus.IDLE);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus(VerificationStatus.PROCESSING);
    setErrorMessage("");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        // Remove data URL prefix for API
        const base64Data = base64String.split(',')[1];
        
        const result = await verifyPaymentScreenshot(base64Data, plan.price);
        
        if (result.success) {
          setStatus(VerificationStatus.VERIFIED);
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          setStatus(VerificationStatus.FAILED);
          setErrorMessage(result.message);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      setStatus(VerificationStatus.FAILED);
      setErrorMessage("Error processing file.");
    }
  };

  const getAccountInfo = () => {
    if (selectedMethod === PaymentMethod.JAZZCASH) {
      return { name: SUPPORT_NAME_JAZZCASH, number: SUPPORT_PHONE_JAZZCASH, color: 'bg-red-600' };
    }
    return { name: SUPPORT_NAME_EASYPAISA, number: SUPPORT_PHONE_EASYPAISA, color: 'bg-green-600' };
  };

  if (status === VerificationStatus.VERIFIED) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-slate-900 border border-green-500/50 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(34,197,94,0.3)]">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-white mb-2">Verified!</h2>
          <p className="text-gray-400">Premium features unlocked.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Unlock {plan.name}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full">
              <XCircle className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {!selectedMethod ? (
            <div className="space-y-4">
              <p className="text-gray-400 mb-4">Select Payment Method (Auto Verified)</p>
              <button
                onClick={() => setSelectedMethod(PaymentMethod.JAZZCASH)}
                className="w-full p-4 glass-panel rounded-xl flex items-center justify-between hover:border-red-500 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs">JC</div>
                  <span className="font-semibold">JazzCash</span>
                </div>
                <span className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">Select &rarr;</span>
              </button>
              <button
                onClick={() => setSelectedMethod(PaymentMethod.EASYPAISA)}
                className="w-full p-4 glass-panel rounded-xl flex items-center justify-between hover:border-green-500 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center font-bold text-xs">EP</div>
                  <span className="font-semibold">Easypaisa</span>
                </div>
                <span className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">Select &rarr;</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Send PKR {plan.price} to</p>
                <div className="flex items-center gap-3 mb-2">
                   <div className={`w-8 h-8 rounded-full ${getAccountInfo().color} flex items-center justify-center text-[10px]`}>
                     {selectedMethod === PaymentMethod.JAZZCASH ? 'JC' : 'EP'}
                   </div>
                   <div>
                     <p className="font-bold text-lg">{getAccountInfo().number}</p>
                     <p className="text-sm text-gray-400">{getAccountInfo().name}</p>
                   </div>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-sm text-gray-300">Upload screenshot for <span className="text-yellow-400 font-semibold">Auto Verification</span></p>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />

                {status === VerificationStatus.PROCESSING ? (
                  <div className="p-8 border-2 border-dashed border-blue-500/50 rounded-xl bg-blue-500/10 flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    <p className="text-blue-300 font-medium">Analyzing receipt...</p>
                  </div>
                ) : status === VerificationStatus.FAILED ? (
                  <div className="p-4 border border-red-500/50 rounded-xl bg-red-500/10">
                    <p className="text-red-300 text-sm mb-2">{errorMessage}</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-red-600 rounded-lg text-sm font-semibold hover:bg-red-700"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-slate-600 rounded-xl hover:border-yellow-500 hover:bg-yellow-500/5 transition-all flex flex-col items-center gap-2 group"
                  >
                    <Upload className="w-8 h-8 text-slate-400 group-hover:text-yellow-400" />
                    <span className="text-slate-400 group-hover:text-white font-medium">Tap to upload Screenshot</span>
                  </button>
                )}
              </div>
              
              <button onClick={() => setSelectedMethod(null)} className="text-sm text-slate-500 hover:text-white w-full">
                Change Method
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
