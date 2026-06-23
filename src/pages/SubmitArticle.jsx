// src/pages/SubmitArticle.jsx - Light Futuristic Design
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { articlesAPI } from '../api/articles';
import { toast } from 'react-hot-toast';
import { 
  FileText, Send, X, Terminal, 
  Tag, BookOpen, Hash, Upload, Database 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SubmitArticle = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const { user, isAdmin } = useAuth();
  const canAddCategory = isAdmin() || user?.role === 'Executive';
  const selectedCategory = watch('category');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await articlesAPI.getCategories();
        setCategories(res.data.results || res.data);
      } catch (err) {
        toast.error("Network error: Category fetch failed.");
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = (e) => {
    e.preventDefault(); 
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    let finalCategoryId = data.category;

    try {
      if (finalCategoryId === 'other' && canAddCategory) {
        if (!data.new_category_name) {
          toast.error("Missing parameter: new_category_name");
          setSubmitting(false);
          return;
        }

        try {
          const catRes = await articlesAPI.createCategory({ name: data.new_category_name });
          finalCategoryId = catRes.data.id; 
        } catch (catErr) {
          if (catErr.response?.status === 403) {
            toast.error("Auth Failure: Lacking admin privileges.");
          } else {
            const errMsg = catErr.response?.data?.detail || catErr.response?.data?.name?.[0] || "Compile failed.";
            toast.error(`Sys_Error: ${errMsg}`);
          }
          setSubmitting(false);
          return; 
        }
      }

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('category', finalCategoryId); 
      formData.append('content', data.content);
      
      if (data.tags) {
        formData.append('tags', data.tags);
      }
      if (selectedImage) {
        formData.append('cover_image', selectedImage);
      }

      await articlesAPI.submitArticle(formData);
      
      toast.success("Payload accepted. Awaiting admin decrypt.");
      navigate('/my-articles');
      
    } catch (err) {
      if (err.response && err.response.data) {
        const backendErrors = err.response.data;
        Object.keys(backendErrors).forEach((field) => {
          const messages = backendErrors[field];
          const errorMsg = Array.isArray(messages) ? messages[0] : messages;
          toast.error(`${field}: ${errorMsg}`, { duration: 6000 });
        });
      } else {
        toast.error("Transmission failed. Recheck connection.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 py-20 min-h-screen bg-slate-50">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 shadow-sm gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-50 border border-purple-100 mb-4">
              <Database className="w-4 h-4 text-purple-600" />
              <span className="font-mono text-[10px] font-bold text-purple-700 uppercase tracking-widest">Node_Creation</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Compile Data Node
            </h1>
            <p className="text-slate-500 font-medium mt-1">Construct payload for network distribution.</p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="font-mono text-xs font-bold text-purple-600 uppercase tracking-widest border-b border-slate-100 pb-3 mb-6">Metadata Parameters</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-purple-600 font-bold">Node Designation *</span></label>
                  <div className="relative">
                    <BookOpen className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                    <input 
                      type="text" 
                      className="input input-bordered w-full pl-12 bg-slate-50 border-slate-200 text-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-inner font-mono text-sm" 
                      placeholder="e.g., Intro to Machine Learning" 
                      {...register('title', { required: true })} 
                    />
                  </div>
                </div>

                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-purple-600 font-bold">Classification *</span></label>
                  <div className="relative">
                    <Hash className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors z-10" />
                    <select className="select select-bordered w-full pl-12 bg-slate-50 border-slate-200 text-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-inner font-mono text-sm appearance-none" {...register('category', { required: true })}>
                      <option value="" disabled>Select Class</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name || cat.title || `Class_${cat.id}`}
                        </option>
                      ))}
                      {canAddCategory && (
                        <option value="other" className="font-bold text-purple-600">+ Inject New Class</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {selectedCategory === 'other' && canAddCategory && (
                <div className="form-control relative group p-6 bg-purple-50 border border-purple-200 rounded-2xl">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-purple-600 font-bold">New Class Name *</span></label>
                  <input 
                    type="text" 
                    className="input input-bordered w-full bg-white border-purple-200 text-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm font-mono text-sm" 
                    placeholder="e.g., Cyber_Security" 
                    {...register('new_category_name')} 
                  />
                  <label className="label pt-2 pb-0"><span className="font-mono text-[9px] uppercase text-purple-500 tracking-wider">Warning: Modifies global schema.</span></label>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-purple-600 font-bold">Visual Asset</span></label>
                  <div className="flex flex-col items-start w-full h-full">
                    <div 
                      className={`relative w-full h-32 border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
                        previewUrl ? 'border-purple-500 bg-purple-50' : 'border-slate-300 bg-slate-50 hover:border-purple-400 hover:bg-purple-50/50'
                      }`}
                      onClick={() => !previewUrl && fileInputRef.current?.click()}
                    >
                      {previewUrl ? (
                        <>
                          <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button onClick={removeImage} className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none font-mono text-[10px] uppercase tracking-widest">
                              <X className="w-3 h-3 mr-1"/> Purge
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4 flex flex-col items-center text-slate-400">
                          <Upload className="w-6 h-6 mb-2 text-slate-400" />
                          <p className="font-mono text-xs font-bold">Upload Binary</p>
                          <p className="font-mono text-[9px] mt-1">IMG (Max 5MB)</p>
                        </div>
                      )}
                    </div>
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*" />
                  </div>
                </div>

                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-purple-600 font-bold">Index Tags (CSV)</span></label>
                  <div className="relative h-32">
                    <Tag className="w-5 h-5 absolute left-4 top-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                    <textarea 
                      className="textarea textarea-bordered w-full h-full pl-12 pt-4 bg-slate-50 border-slate-200 text-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-inner font-mono text-sm resize-none" 
                      placeholder="e.g., ai, python, research" 
                      {...register('tags')} 
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="form-control relative group pt-4">
                <label className="label pb-1 flex justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 group-focus-within:text-purple-600 font-bold">Main Payload *</span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">HTML Supported</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered w-full h-96 p-4 bg-slate-50 border-slate-200 text-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-inner font-mono text-sm resize-y" 
                  placeholder="<p>Begin transmission here...</p>"
                  {...register('content', { required: true })}
                ></textarea>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="group relative flex items-center justify-center gap-3 bg-slate-900 hover:bg-purple-600 text-white font-bold h-14 w-full md:w-64 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden shrink-0"
                >
                  {submitting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <Terminal className="w-4 h-4 relative z-10" />
                      <span className="font-mono text-xs uppercase tracking-widest relative z-10">Transmit Node</span>
                      <Send className="w-4 h-4 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitArticle;