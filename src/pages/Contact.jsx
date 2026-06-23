// src/pages/Contact.jsx - Light Futuristic Design
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { contactAPI } from '../api/contact';
import { MapPin, Phone, Mail, Send, Terminal, MessageSquare, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Contact = () => {
  const { register, handleSubmit, reset } = useForm();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await contactAPI.sendMessage(data);
      toast.success("Transmission successful. We will respond shortly.");
      reset();
    } catch (err) {
      toast.error("Transmission failed. Please verify connection and retry.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-20 min-h-screen bg-slate-50">
      {/* Animated Light Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-200/50 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-[80px] animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">Comms_Link_Active</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 bg-clip-text text-transparent tracking-tight">
            Establish <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Contact</span>
          </h1>
          <p className="text-lg text-slate-500 mt-4 font-medium max-w-xl mx-auto">Open a secure channel to the DUITS administrative node.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Info Side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 p-8 md:p-10 relative overflow-hidden h-full group">
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
              
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-800 tracking-tight uppercase">
                <Globe className="w-6 h-6 text-blue-500" />
                Network Coords
              </h2>
              
              <div className="space-y-6">
                {[
                  { icon: MapPin, title: "Physical Node", desc: "Ground Floor, Teacher-Student Centre (TSC)\nUniversity of Dhaka\nDhaka-1000, Bangladesh" },
                  { icon: Phone, title: "Voice Channel", desc: "+880 1234 567890" },
                  { icon: Mail, title: "Data Channel", desc: "info@duits.org.bd" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300">
                    <div className={`p-3 rounded-xl bg-white border border-slate-200 text-blue-600 shadow-sm`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 uppercase tracking-wider text-sm font-mono">{item.title}</h3>
                      <p className="text-slate-600 font-medium mt-2 whitespace-pre-line text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 p-8 md:p-10 relative">
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-800 tracking-tight uppercase">
                <Terminal className="w-6 h-6 text-indigo-500" />
                Transmit Signal
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control relative group">
                    <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Designation *</span></label>
                    <input 
                      type="text" 
                      className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" 
                      placeholder="Your Name"
                      required 
                      {...register('name')} 
                    />
                  </div>
                  <div className="form-control relative group">
                    <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Return Address *</span></label>
                    <input 
                      type="email" 
                      className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" 
                      placeholder="Email"
                      required 
                      {...register('email')} 
                    />
                  </div>
                </div>
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Subject Vector *</span></label>
                  <input 
                    type="text" 
                    className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" 
                    placeholder="Topic"
                    required 
                    {...register('subject')} 
                  />
                </div>
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Payload *</span></label>
                  <textarea 
                    className="textarea textarea-bordered h-40 w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm resize-none" 
                    placeholder="Enter your message here..."
                    required 
                    {...register('message')}
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="w-full h-14 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-mono text-xs uppercase tracking-widest font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group/btn"
                >
                  {submitting ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      Transmit
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;