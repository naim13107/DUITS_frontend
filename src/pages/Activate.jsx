// src/pages/Activate.jsx - Light Futuristic Design
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UserCheck, Rocket, Shield, Terminal } from 'lucide-react';
import { authAPI } from '../api/auth';

const Activate = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const { uid, token } = useParams();

  const handleActivation = async () => {
    setIsVerifying(true);
    try {
      await authAPI.activateAccount({ uid, token });
      toast.success("Account successfully verified! You can now log in.");
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.detail 
        || err.response?.data?.token?.[0]
        || "Activation failed. The link might be expired or already used.";
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[85vh] px-4 my-10 bg-slate-50">
      {/* Animated Light Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/50 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-200/40 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl border border-slate-200 rounded-3xl text-center overflow-hidden z-10 hover:shadow-blue-500/10 transition-shadow">
        {/* Tech Header Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400"></div>
        
        <div className="p-10 relative z-10 flex flex-col items-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <UserCheck className="w-12 h-12 text-blue-600 relative z-10 animate-float" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
               <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
          
          <h2 className="text-3xl font-black mb-3 text-slate-800 tracking-tight">
            Verify Your Identity
          </h2>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
            Authorization sequence pending. Initialize the activation protocol below to sync your profile with the DUITS mainframe.
          </p>
          
          <div className="w-full space-y-4">
            <button 
              onClick={handleActivation} 
              className="group relative flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-bold h-14 w-full rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden hover:scale-[1.02]"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="font-mono text-xs uppercase tracking-widest">Processing...</span>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                  <Terminal className="w-4 h-4 relative z-10" />
                  <span className="font-mono text-xs uppercase tracking-widest relative z-10">Execute Activation</span>
                </>
              )}
            </button>
            
            <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-400">
              <Shield className="w-3 h-3 text-green-500" />
              <span>Secured Environment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activate;