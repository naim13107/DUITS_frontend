// src/pages/PaymentFail.jsx - Light Futuristic Design
import { Link } from 'react-router-dom';
import { XCircle, RefreshCcw, Terminal, ShieldAlert } from 'lucide-react';

const PaymentFail = () => {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 bg-slate-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-200/50 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl border border-slate-200 rounded-3xl text-center overflow-hidden z-10 hover:shadow-red-500/10 transition-shadow">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-rose-600"></div>
        
        <div className="p-10 relative z-10 flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-red-50 opacity-100"></div>
              <XCircle className="w-12 h-12 text-red-600 relative z-10 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-3xl font-black mb-3 text-slate-800 tracking-tight">Ledger Sync Failed</h1>
          <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
            Financial node rejected the transfer protocol. Zero credits were deducted from origin source.
          </p>

          <div className="w-full space-y-3">
            <Link to="/recruitment" className="group relative flex items-center justify-center gap-2 bg-slate-900 hover:bg-red-600 text-white font-bold h-14 w-full rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden hover:scale-[1.02]">
               <RefreshCcw className="w-4 h-4 relative z-10 group-hover:-rotate-180 transition-transform duration-500" /> 
               <span className="font-mono text-xs uppercase tracking-widest relative z-10">Re-initiate Transfer</span>
            </Link>
            <Link to="/" className="btn bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 w-full h-14 rounded-xl font-mono text-xs uppercase tracking-widest transition-all shadow-sm">
              <Terminal className="w-4 h-4 mr-2" /> Main Console
            </Link>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-8 text-[10px] font-mono uppercase tracking-widest text-slate-400">
            <ShieldAlert className="w-3 h-3 text-red-500" />
            <span>Funds verified secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;