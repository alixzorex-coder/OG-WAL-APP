import React, { useState, useRef } from 'react';
import { Plan, PaymentMethod, VerificationStatus } from '../types';
import { verifyPaymentScreenshot } from '../services/geminiService';
import { Loader2, Upload, CheckCircle, XCircle, CreditCard, ShieldCheck } from 'lucide-react';
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

  // Success State
  if (status === VerificationStatus.VERIFIED) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
        <div className="bg-slate-900 border border-green-500/50 rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_0_100px_rgba(34,197,94,0.4)] transform scale-100">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
             <CheckCircle className="w-12 h-12 text-green-500 animate-bounce" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Payment Verified!</h2>
          <p className="text-gray-400">You are now a Premium Member.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-slate-900 to-black border border-slate-700/50 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-2xl shadow-black">
        <div className="p-6 relative">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    Unlock Premium
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                </h2>
                <p className="text-sm text-gray-400">{plan.name} • <span className="text-yellow-400 font-bold">₨ {plan.price}</span></p>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-full transition-colors">
              <XCircle className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {!selectedMethod ? (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mb-6">
                <p className="text-xs text-yellow-200 text-center">
                    ⚡️ Instant Auto-Verification Active
                </p>
              </div>

              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Select Payment Method</p>
              
              <button
                onClick={() => setSelectedMethod(PaymentMethod.JAZZCASH)}
                className="w-full p-4 bg-slate-800/40 border border-white/5 rounded-2xl flex items-center justify-between hover:border-red-500/50 hover:bg-slate-800/60 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-red-900/20">JC</div>
                  <div className="text-left">
                      <span className="block font-bold text-lg">JazzCash</span>
                      <span className="text-xs text-gray-500">Auto-Verify Supported</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-red-500 group-hover:border-red-500 transition-colors">
                    <span className="text-white opacity-0 group-hover:opacity-100">➜</span>
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod(PaymentMethod.EASYPAISA)}
                className="w-full p-4 bg-slate-800/40 border border-white/5 rounded-2xl flex items-center justify-between hover:border-green-500/50 hover:bg-slate-800/60 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-green-900/20">EP</div>
                   <div className="text-left">
                      <span className="block font-bold text-lg">Easypaisa</span>
                      <span className="text-xs text-gray-500">Auto-Verify Supported</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-green-500 group-hover:border-green-500 transition-colors">
                    <span className="text-white opacity-0 group-hover:opacity-100">➜</span>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-20 h-20 ${getAccountInfo().color} opacity-10 blur-2xl rounded-full translate-x-1/3 -translate-y-1/3`}></div>
                
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Send <span className="text-white font-bold">PKR {plan.price}</span> to</p>
                <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-full ${getAccountInfo().color} flex items-center justify-center text-xs font-bold shadow-lg`}>
                     {selectedMethod === PaymentMethod.JAZZCASH ? 'JC' : 'EP'}
                   </div>
                   <div>
                     <p className="font-mono text-xl font-bold tracking-wide">{getAccountInfo().number}</p>
                     <p className="text-sm text-gray-400">{getAccountInfo().name}</p>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-300 font-medium">Upload Screenshot</p>
                    <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full border border-yellow-500/20">Required for Verification</span>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />

                {status === VerificationStatus.PROCESSING ? (
                  <div className="h-40 border-2 border-dashed border-blue-500/50 rounded-2xl bg-blue-500/5 flex flex-col items-center justify-center gap-4 animate-pulse">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 animate-ping"></div>
                        <Loader2 className="w-10 h-10 text-blue-400 animate-spin relative z-10" />
                    </div>
                    <p className="text-blue-300 font-medium text-sm">AI is verifying your receipt...</p>
                  </div>
                ) : status === VerificationStatus.FAILED ? (
                  <div className="p-4 border border-red-500/50 rounded-2xl bg-red-500/10 text-center">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <XCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-red-200 text-sm mb-3">{errorMessage}</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-red-600 rounded-full text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 border-2 border-dashed border-slate-600 rounded-2xl hover:border-yellow-500 hover:bg-yellow-500/5 transition-all flex flex-col items-center justify-center gap-3 group cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-yellow-400" />
                    </div>
                    <span className="text-slate-400 group-hover:text-white font-medium text-sm">Tap here to upload</span>
                  </button>
                )}
              </div>
              
              <button onClick={() => setSelectedMethod(null)} className="text-xs text-slate-500 hover:text-white w-full py-2">
                Change Payment Method
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};