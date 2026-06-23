// src/pages/Profile.jsx - Light Futuristic Design
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  Mail, Phone, BookOpen, MapPin, Hash, Edit2, Save, X, Camera, 
  ShieldAlert, Sparkles, User, Award, Calendar, Fingerprint, Terminal 
} from 'lucide-react';
import { authAPI } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.getMe();
        setUser(response.data); 
        reset(response.data);   
        if (response.data.profile_image) {
           setPreviewUrl(response.data.profile_image);
        }
      } catch (error) {
        toast.error("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [reset, setUser]);

  const handleImageChange = (e) => {
    const file = e.target.files;
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('full_name', data.full_name);
      formData.append('phone', data.phone || '');
      formData.append('department', data.department || '');
      formData.append('session', data.session || '');
      formData.append('hall', data.hall || '');
      
      if (selectedImage) {
        formData.append('profile_image', selectedImage);
      }

      const response = await authAPI.updateMe(formData);
      setUser(response.data);
      
      if (response.data.profile_image) {
        setPreviewUrl(response.data.profile_image);
      }
      
      toast.success("Profile sync complete.");
      setIsEditing(false);
      setSelectedImage(null); 
    } catch (err) {
      toast.error("Sync failed. Check data parameters.");
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    setIsResetting(true);
    try {
      await authAPI.resetPassword(user.email);
      toast.success("Override link transmitted to comms channel.", { duration: 5000 });
    } catch (error) {
      toast.error(error.response?.data?.email?.[0]|| "Transmission failed. Retry protocol.");
    } finally {
      setIsResetting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-16 bg-slate-50 min-h-screen">
      {/* Light Tech Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 shadow-sm gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-100 mb-4">
              <Terminal className="w-4 h-4 text-blue-600" />
              <span className="font-mono text-[10px] font-bold text-blue-700 uppercase tracking-widest">Active_Profile</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Entity Matrix
            </h1>
            <p className="text-slate-500 font-medium mt-1">Manage configuration for {user?.email}</p>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)} 
              className="btn bg-slate-900 hover:bg-blue-600 text-white border-none shadow-md transition-all duration-300 flex items-center gap-2 px-6 rounded-xl font-mono text-xs uppercase tracking-widest"
            >
              <Edit2 className="w-4 h-4" /> Rewrite Config
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Avatar Card */}
          <div className="md:col-span-4 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 h-fit overflow-hidden relative group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="p-8 flex flex-col items-center text-center relative">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-2xl ring-2 ring-slate-100 group-hover:ring-blue-300 transition-all duration-500 overflow-hidden bg-slate-50 flex items-center justify-center shadow-inner p-1">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile" className="object-cover w-full h-full rounded-xl" />
                  ) : (
                    <span className="text-6xl font-black text-slate-300">
                      {user?.full_name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                
                {isEditing && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-colors border-2 border-white z-10"
                    type="button"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">{user?.full_name}</h2>
              <div className="inline-flex items-center px-4 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-md font-mono text-[10px] font-bold uppercase tracking-widest shadow-sm">
                {user?.is_superuser ? 'SYSTEM_ADMIN' : (user?.role || 'BASE_USER')}
              </div>
              
              <div className="w-full border-t border-slate-100 mt-8 pt-6 space-y-3">
                <div className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Mail className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-mono text-xs font-bold text-slate-600 truncate">{user?.email}</span>
                </div>
                <div className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Hash className="w-4 h-4 mr-3 text-blue-500" />
                  <span className="font-mono text-xs font-bold text-slate-600">{user?.student_id || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details/Edit Form */}
          <div className="md:col-span-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
            
            <div className="p-8 md:p-10">
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="font-mono text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-3 mb-6">Modify Parameters</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control relative group">
                      <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Alias Config</span></label>
                      <input type="text" className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" {...register('full_name', { required: true })} />
                    </div>

                    <div className="form-control relative group">
                      <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Comms Channel</span></label>
                      <input type="text" className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" {...register('phone')} />
                    </div>

                    <div className="form-control relative group">
                      <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Sector Vector</span></label>
                      <input type="text" className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" {...register('department')} />
                    </div>

                    <div className="form-control relative group">
                      <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Sync Cycle</span></label>
                      <input type="text" className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" {...register('session')} />
                    </div>

                    <div className="form-control md:col-span-2 relative group">
                      <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-blue-600 font-bold">Hab Block</span></label>
                      <input type="text" className="input input-bordered w-full bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner font-mono text-sm" {...register('hall')} />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mt-10 pt-6 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => {
                        reset(user); 
                        setIsEditing(false);
                        setPreviewUrl(user?.profile_image || null); 
                        setSelectedImage(null);
                      }} 
                      className="btn bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 shadow-sm w-full sm:w-auto font-mono text-xs uppercase tracking-widest"
                    >
                      <X className="w-4 h-4 mr-2" /> Abort
                    </button>
                    
                    <button 
                      type="submit" 
                      className="btn bg-slate-900 hover:bg-blue-600 text-white border-none shadow-md w-full sm:w-auto font-mono text-xs uppercase tracking-widest" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )} 
                      Compile & Save
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-10">
                  {/* Academic Info */}
                  <div>
                    <div className="font-mono text-xs font-bold text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Config File
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { icon: BookOpen, label: "Sector Vector", val: user?.department },
                        { icon: MapPin, label: "Hab Block", val: user?.hall },
                        { icon: Calendar, label: "Sync Cycle", val: user?.session },
                        { icon: Phone, label: "Voice Comms", val: user?.phone }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 mr-4">
                            <item.icon className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="font-bold text-slate-800 text-sm">{item.val || 'NULL'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Section */}
                  <div>
                    <div className="font-mono text-xs font-bold text-amber-500 uppercase tracking-widest border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> Protocols
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-amber-100">
                          <Fingerprint className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 tracking-tight">Access Key Management</h4>
                          <p className="text-sm text-slate-500 font-medium mt-1">Initiate override protocol to reset authorization key.</p>
                        </div>
                      </div>
                      <button 
                        onClick={handlePasswordReset} 
                        disabled={isResetting}
                        className="btn bg-white hover:bg-amber-50 text-amber-600 border border-slate-200 hover:border-amber-200 shadow-sm w-full sm:w-auto font-mono text-xs uppercase tracking-widest"
                      >
                        {isResetting ? <span className="loading loading-spinner loading-sm"></span> : 'Send Override'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;