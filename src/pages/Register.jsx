// src/pages/Register.jsx - Light Futuristic Design
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Terminal, Mail, Lock, User, Phone, BookOpen, 
  MapPin, Hash, Calendar, ArrowRight, ShieldAlert 
} from 'lucide-react';
import { authAPI } from '../api/auth';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const payload = {
        username: data.email.split('@') + Math.floor(Math.random() * 10000),
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        re_password: data.confirmPassword,
        phone: data.phone,
        department: data.department,
        hall: data.hall,
        session: data.session,
        student_id: data.student_id,
      };

      await authAPI.register(payload);
      toast.success("Identity registered!");
      navigate('/verify-email', { state: { email: data.email } });
      
    } catch (err) {
      const errorMessage = err.response?.data?.email?.[0] 
        || err.response?.data?.password?.[0]
        || err.response?.data?.username?.[0]  
        || err.response?.data?.detail
        || "Registration aborted. Verify payload inputs.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-[90vh] px-4 py-16 bg-slate-50">
      {/* Light Tech Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative w-full max-w-3xl bg-white/90 backdrop-blur-xl shadow-2xl border border-slate-200 rounded-3xl overflow-hidden z-10">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500"></div>
        
        <div className="p-10 md:p-14">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-50 opacity-100"></div>
                <Terminal className="w-10 h-10 text-blue-600 relative z-10" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              Entity Registration
            </h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mt-2 font-bold">Construct profile to access internal network</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="form-control relative group">
                <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Designation *</span></label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className={`input input-bordered w-full pl-12 bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm ${errors.full_name ? 'input-error border-red-500' : ''}`}
                    {...register('full_name', { required: 'Required' })}
                  />
                </div>
                {errors.full_name && <span className="font-mono text-[10px] uppercase text-red-500 tracking-wider mt-1">{errors.full_name.message}</span>}
              </div>

              <div className="form-control relative group">
                <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Terminal ID (Email) *</span></label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    placeholder="example@du.ac.bd"
                    className={`input input-bordered w-full pl-12 bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm ${errors.email ? 'input-error border-red-500' : ''}`}
                    {...register('email', { 
                      required: 'Required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid format' }
                    })}
                  />
                </div>
                {errors.email && <span className="font-mono text-[10px] uppercase text-red-500 tracking-wider mt-1">{errors.email.message}</span>}
              </div>

              <div className="form-control relative group">
                <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Passkey *</span></label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`input input-bordered w-full pl-12 bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono tracking-widest text-lg ${errors.password ? 'input-error border-red-500' : ''}`}
                    {...register('password', { 
                      required: 'Required',
                      minLength: { value: 8, message: 'Min 8 chars' }
                    })}
                  />
                </div>
                {errors.password && <span className="font-mono text-[10px] uppercase text-red-500 tracking-wider mt-1">{errors.password.message}</span>}
              </div>

              <div className="form-control relative group">
                <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Verify Passkey *</span></label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`input input-bordered w-full pl-12 bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono tracking-widest text-lg ${errors.confirmPassword ? 'input-error border-red-500' : ''}`}
                    {...register('confirmPassword', { 
                      required: 'Required',
                      validate: value => value === password || 'Mismatch'
                    })}
                  />
                </div>
                {errors.confirmPassword && <span className="font-mono text-[10px] uppercase text-red-500 tracking-wider mt-1">{errors.confirmPassword.message}</span>}
              </div>

              {/* Other Fields with similar structure */}
              <div className="form-control relative group">
                <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Voice Comms *</span></label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="017xxxxxxxx"
                    className={`input input-bordered w-full pl-12 bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm ${errors.phone ? 'input-error border-red-500' : ''}`}
                    {...register('phone', { required: 'Required' })}
                  />
                </div>
                {errors.phone && <span className="font-mono text-[10px] uppercase text-red-500 tracking-wider mt-1">{errors.phone.message}</span>}
              </div>

              <div className="form-control relative group">
                <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Sector Vector *</span></label>
                <div className="relative">
                  <BookOpen className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Department"
                    className={`input input-bordered w-full pl-12 bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm ${errors.department ? 'input-error border-red-500' : ''}`}
                    {...register('department', { required: 'Required' })}
                  />
                </div>
                {errors.department && <span className="font-mono text-[10px] uppercase text-red-500 tracking-wider mt-1">{errors.department.message}</span>}
              </div>

              <div className="form-control relative group">
                <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Hab Block *</span></label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Hall Name"
                    className={`input input-bordered w-full pl-12 bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm ${errors.hall ? 'input-error border-red-500' : ''}`}
                    {...register('hall', { required: 'Required' })}
                  />
                </div>
                {errors.hall && <span className="font-mono text-[10px] uppercase text-red-500 tracking-wider mt-1">{errors.hall.message}</span>}
              </div>

              <div className="form-control relative group">
                <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Sync Cycle *</span></label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Session (e.g. 2021-22)"
                    className={`input input-bordered w-full pl-12 bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm ${errors.session ? 'input-error border-red-500' : ''}`}
                    {...register('session', { required: 'Required' })}
                  />
                </div>
                {errors.session && <span className="font-mono text-[10px] uppercase text-red-500 tracking-wider mt-1">{errors.session.message}</span>}
              </div>

              <div className="form-control relative group md:col-span-2">
                <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Registry Hash *</span></label>
                <div className="relative">
                  <Hash className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Student ID"
                    className={`input input-bordered w-full pl-12 bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm ${errors.student_id ? 'input-error border-red-500' : ''}`}
                    {...register('student_id', { required: 'Required' })}
                  />
                </div>
                {errors.student_id && <span className="font-mono text-[10px] uppercase text-red-500 tracking-wider mt-1">{errors.student_id.message}</span>}
              </div>
            </div>

            <button 
              type="submit" 
              className="group relative flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 text-white font-bold h-14 w-full rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden mt-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="font-mono text-xs uppercase tracking-widest">Constructing Profile...</span>
                </>
              ) : (
                <>
                  <span className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay pointer-events-none"></span>
                  <span className="font-mono text-xs uppercase tracking-widest relative z-10">Compile Request</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">
              Entity already exists?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 ml-1">
                Authenticate
              </Link>
            </p>
            
            <div className="flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">
              <ShieldAlert className="w-3 h-3 text-blue-400" />
              <span>Data encrypted prior to transmission</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;