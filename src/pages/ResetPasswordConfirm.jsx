// src/pages/ResetPasswordConfirm.jsx - Light Futuristic Design
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LockKeyhole, ShieldAlert, ArrowRight, Terminal } from 'lucide-react';
import { authAPI } from '../api/auth';

const ResetPasswordConfirm = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const { uid, token } = useParams();
  const new_password = watch('new_password');

  const onSubmit = async (data) => {
    try {
      const payload = {
        uid,
        token,
        new_password: data.new_password,
        re_new_password: data.re_new_password,
      };

      await authAPI.resetPasswordConfirm(payload);
      toast.success("Security key updated. Proceed to authentication.");
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.new_password?.[0] 
        || err.response?.data?.token?.[0]
        || err.response?.data?.detail
        || "Override failed. Vector may be expired.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[85vh] px-4 bg-slate-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[100px] animate-pulse-slow"></div>
      </div>

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl border border-slate-200 rounded-3xl overflow-hidden z-10 hover:shadow-indigo-500/10 transition-shadow">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
        
        <div className="p-10 relative z-10">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-50 opacity-100"></div>
                <LockKeyhole className="w-10 h-10 text-indigo-500 relative z-10" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Inject New Key
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Establish new authentication credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-control relative group">
              <label className="label pb-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-indigo-600 font-bold">New Passkey</span>
              </label>
              <div className="relative">
                <LockKeyhole className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`input input-bordered w-full pl-12 bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all shadow-inner font-mono tracking-widest text-lg ${errors.new_password ? 'input-error border-red-500' : ''}`}
                  {...register('new_password', { 
                    required: 'Required',
                    minLength: { value: 8, message: 'Min 8 chars' }
                  })}
                />
              </div>
              {errors.new_password && (
                <label className="label pt-1 pb-0">
                  <span className="font-mono text-[10px] uppercase text-red-500 tracking-wider">{errors.new_password.message}</span>
                </label>
              )}
            </div>

            <div className="form-control relative group">
              <label className="label pb-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-indigo-600 font-bold">Verify Passkey</span>
              </label>
              <div className="relative">
                <LockKeyhole className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`input input-bordered w-full pl-12 bg-slate-50 border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all shadow-inner font-mono tracking-widest text-lg ${errors.re_new_password ? 'input-error border-red-500' : ''}`}
                  {...register('re_new_password', { 
                    required: 'Required',
                    validate: value => value === new_password || 'Mismatch'
                  })}
                />
              </div>
              {errors.re_new_password && (
                <label className="label pt-1 pb-0">
                  <span className="font-mono text-[10px] uppercase text-red-500 tracking-wider">{errors.re_new_password.message}</span>
                </label>
              )}
            </div>

            <button 
              type="submit" 
              className="group relative flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white font-bold h-14 w-full rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden mt-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="font-mono text-xs uppercase tracking-widest">Writing to Core...</span>
                </>
              ) : (
                <>
                  <Terminal className="w-4 h-4" />
                  <span className="font-mono text-xs uppercase tracking-widest">Execute Override</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <div className="flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">
              <ShieldAlert className="w-3 h-3 text-indigo-400" />
              <span>Link secured via end-to-end encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;