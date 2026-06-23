// src/pages/Login.jsx - Light Futuristic Design
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LogIn, Mail, Lock, ArrowRight, Shield, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password);
      toast.success('Authentication verified. Welcome back.');
      
      if (user.role === 'admin' || user.role === 'executive') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail 
        || err.response?.data?.message 
        || "Invalid credentials detected.";
      
      toast.error(errorMessage);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[85vh] px-4 bg-slate-50">
      {/* Animated Light Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[100px] animate-pulse-slow"></div>
      </div>

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl border border-slate-200 rounded-3xl overflow-hidden z-10 hover:shadow-blue-500/10 transition-shadow">
        {/* Top Tech Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400"></div>
        
        <div className="p-10 relative z-10 flex flex-col">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <LogIn className="w-10 h-10 text-blue-600 relative z-10" />
              </div>
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              System Access
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mt-2 font-bold">Authenticate to proceed</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-control relative group">
              <label className="label pb-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Terminal ID (Email)</span>
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  placeholder="example@du.ac.bd"
                  className={`input input-bordered w-full pl-12 bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm ${errors.email ? 'input-error border-red-500' : ''}`}
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

            <div className="form-control relative group">
              <label className="label pb-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Passkey</span>
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`input input-bordered w-full pl-12 bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono tracking-widest text-lg ${errors.password ? 'input-error border-red-500' : ''}`}
                  {...register('password', { 
                    required: 'Password is required' 
                  })}
                />
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-mono text-[10px] uppercase text-red-500 tracking-wider">
                  {errors.password?.message || ""}
                </span>
                <Link to="/forgot-password" className="font-mono text-[10px] uppercase tracking-widest text-blue-600 hover:text-blue-800 font-bold transition-colors">
                  Reset Passkey
                </Link>
              </div>
            </div>

            <button 
              type="submit" 
              className="group relative flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 text-white font-bold h-14 w-full rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="font-mono text-xs uppercase tracking-widest">Authenticating...</span>
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                  <Terminal className="w-4 h-4 relative z-10" />
                  <span className="font-mono text-xs uppercase tracking-widest relative z-10">Execute Login</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Unregistered Entity?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 ml-1">
                Initialize Profile
              </Link>
            </p>
            
            <div className="flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">
              <Shield className="w-3 h-3 text-blue-400" />
              <span>Encrypted by Core Logic</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;