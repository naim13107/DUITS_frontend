// src/pages/Recruitment.jsx - Light Futuristic Design
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { recruitmentAPI } from '../api/recruitment';
import { paymentAPI } from '../api/payment';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Lock, CreditCard, ArrowRight, ShieldAlert, Terminal, Cpu } from 'lucide-react';

const Recruitment = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit } = useForm();
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await recruitmentAPI.getSettings();
        const sessions = res.data.results || res.data;
        const active = sessions.find(s => s.is_open);
        setSettings(active || { is_open: false }); 
      } catch (err) {
        toast.error("Failed to sync matrix status.");
        setSettings({ is_open: false });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const onSubmit = async (data) => {
    if (!user) {
      toast.error("Unregistered entity. Authentication required.");
      navigate('/login');
      return;
    }

    setSubmitting(true);
    const payload = { ...data, session: settings.session_name };

    try {
      const appRes = await recruitmentAPI.submitApplication(payload);
      const newApplicationId = appRes.data.id; 
      
      localStorage.setItem("pending_app_id", newApplicationId);

      const paymentRes = await paymentAPI.initiatePayment({ 
        application_id: newApplicationId 
      });
      
      const paymentUrl = paymentRes.data.payment_url || paymentRes.data.url;

      if (!paymentUrl) {
        throw new Error("Missing secure transfer node.");
      }

      toast.loading("Establishing secure transfer link...", { duration: 1500 });
      
      setTimeout(() => {
        window.location.href = paymentUrl;
      }, 1500);

    } catch (err) {
      toast.error("Process aborted. Check parameters.");
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center mt-32"><div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div></div>;

  if (!settings.is_open) {
    return (
      <div className="flex justify-center items-center mt-20 px-4 min-h-[60vh] bg-slate-50">
        <div className="bg-white/80 backdrop-blur-xl shadow-xl border border-slate-200 max-w-lg w-full text-center py-16 px-10 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-amber-500"></div>
          <div className="mx-auto bg-slate-50 p-6 rounded-2xl inline-block mb-8 border border-slate-100 shadow-inner">
            <Lock className="w-12 h-12 text-amber-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-4">Gate Closed</h2>
          <p className="text-slate-500 mb-8 font-medium">Registration protocols are currently offline. Monitor external channels for activation signals.</p>
          <div className="font-mono text-xs uppercase tracking-widest text-amber-600 bg-amber-50 py-3 px-4 rounded-xl border border-amber-100 font-bold">
            No active nodes found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 bg-slate-50 min-h-screen">
      
      {/* Dynamic Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-10 mb-10 shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/20 border border-blue-400/30 mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-mono text-[10px] font-bold text-blue-300 uppercase tracking-widest">Protocol_Active</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">{settings.session_name} Intake</h1>
          <p className="text-slate-400 font-medium">Execute command to merge with the core collective.</p>
        </div>
        
        <div className="relative z-10 bg-white/5 backdrop-blur-md px-8 py-6 rounded-2xl border border-white/10 text-center shrink-0">
          <p className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">Required Credits</p>
          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">৳{settings.application_fee}</p>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl shadow-2xl border border-slate-200 rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        <div className="p-8 md:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            
            {/* Section A */}
            <section>
              <h3 className="font-mono text-sm font-bold text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Block A: Primary Data
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Alias Config *</span></label>
                  <input type="text" className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" required {...register('full_name')} />
                </div>
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Comms Link (Email) *</span></label>
                  <input type="email" className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" required {...register('email')} />
                </div>
                <div className="form-control md:col-span-2 relative group">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Voice Comms *</span></label>
                  <input type="tel" className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" required {...register('phone')} />
                </div>
              </div>
            </section>

            {/* Section B */}
            <section>
              <h3 className="font-mono text-sm font-bold text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Block B: Origin Parameters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Sector Vector *</span></label>
                  <input type="text" className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" placeholder="e.g., SE" required {...register('department')} />
                </div>
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Sync Cycle *</span></label>
                  <input type="text" className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" placeholder="e.g., 2023-24" required {...register('session')} />
                </div>
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Registry Hash *</span></label>
                  <input type="text" className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" required {...register('student_id')} />
                </div>
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Hab Block *</span></label>
                  <input type="text" className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" placeholder="e.g., FH Hall" required {...register('hall')} />
                </div>
              </div>
            </section>

            {/* Section C */}
            <section>
              <h3 className="font-mono text-sm font-bold text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Block C: Ext Interfaces
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control md:col-span-2 relative group">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Core Competencies *</span></label>
                  <input type="text" className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" placeholder="e.g., Python, UI/UX" required {...register('skills')} />
                </div>
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">GitHub Node</span></label>
                  <input type="url" className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" {...register('github')} />
                </div>
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">LinkedIn Node</span></label>
                  <input type="url" className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" {...register('linkedin')} />
                </div>
                <div className="form-control md:col-span-2 relative group">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Portfolio Link</span></label>
                  <input type="url" className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" {...register('portfolio')} />
                </div>
              </div>
            </section>

            {/* Section D */}
            <section>
              <h3 className="font-mono text-sm font-bold text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Block D: Directive Justification
              </h3>
              <div className="form-control relative group">
                <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Why execute merge? *</span></label>
                <textarea className="textarea textarea-bordered h-32 w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm resize-none" required {...register('motivation')}></textarea>
              </div>
            </section>

            {/* Final Execution */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden mt-12 shadow-sm">
              <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Transfer Requirement</div>
                  <div className="text-4xl font-black text-slate-900 mb-2">৳{settings.application_fee}</div>
                  <div className="flex items-center gap-2 font-mono text-xs text-blue-600 font-bold uppercase tracking-widest">
                    <CreditCard className="w-4 h-4"/> AamarPay Secure Node
                  </div>
                  <p className="font-mono text-[9px] text-slate-400 mt-4 max-w-sm uppercase tracking-wider">
                    * Payload is compiled upon successful credit transfer.
                  </p>
                </div>
                
                <button type="submit" disabled={submitting} className="group relative flex items-center justify-center gap-3 bg-slate-900 hover:bg-blue-600 text-white font-bold h-16 w-full md:w-64 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden shrink-0">
                  {submitting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                      <span className="font-mono text-xs uppercase tracking-widest relative z-10">Compile & Transfer</span>
                      <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Recruitment;