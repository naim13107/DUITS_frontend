// src/pages/ForgotPassword.jsx - Light Futuristic Design
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { KeyRound, Mail, Shield, Terminal } from 'lucide-react';
import { authAPI } from '../api/auth';
import { useState } from 'react';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (data) => {
    try {
      await authAPI.resetPassword(data.email);
      setEmailSent(true);
      toast.success('Override link transmitted!');
    } catch (err) {
      toast.error('Transmission failed. Verify vector and retry.');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[85vh] px-4 bg-slate-50">
      {/* Animated Light Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-200/40 rounded-full blur-[100px] animate-pulse-slow"></div>
      </div>

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl border border-slate-200 rounded-3xl overflow-hidden z-10 hover:shadow-amber-500/10 transition-shadow">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 to-orange-500"></div>
        
        <div className="p-10 relative z-10">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-amber-50 opacity-100"></div>
                <KeyRound className="w-10 h-10 text-amber-500 relative z-10" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Access Override
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Initialize password reset protocol via registered comms link.
            </p>
          </div>

          {emailSent ? (
            <div className="text-center space-y-6">
              <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl flex flex-col items-center gap-3 shadow-sm">
                <Mail className="w-8 h-8" />
                <span className="font-bold text-sm tracking-wide">Transmission Successful!</span>
                <span className="text-xs font-mono opacity-80 uppercase tracking-widest">Check comms channel</span>
              </div>
              <Link to="/login" className="btn bg-slate-900 hover:bg-slate-800 text-white w-full h-12 font-mono text-xs uppercase tracking-widest border-none">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="form-control relative group">
                <label className="label pb-1">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-amber-600 font-bold">Comms Link (Email)</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                  <input
                    type="email"
                    placeholder="example@du.ac.bd"
                    className={`input input-bordered w-full pl-12 bg-slate-50 border-slate-200 text-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all shadow-inner font-mono text-sm ${errors.email ? 'input-error border-red-500' : ''}`}
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid format' }
                    })}
                  />
                </div>
                {errors.email && (
                  <label className="label pt-1 pb-0">
                    <span className="font-mono text-[10px] uppercase text-red-500 tracking-wider">{errors.email.message}</span>
                  </label>
                )}
              </div>

              <button 
                type="submit" 
                className="group relative flex items-center justify-center gap-2 bg-slate-900 hover:bg-amber-500 text-white font-bold h-14 w-full rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    <span className="font-mono text-xs uppercase tracking-widest">Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Terminal className="w-4 h-4" />
                    <span className="font-mono text-xs uppercase tracking-widest">Request Override</span>
                  </>
                )}
              </button>
            </form>
          )}

          {!emailSent && (
            <div className="text-center mt-8">
              <Link to="/login" className="font-mono text-[10px] text-slate-500 uppercase tracking-widest hover:text-amber-600 transition-colors font-bold flex items-center justify-center gap-2">
                <Shield className="w-3 h-3" /> Abort Override
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;