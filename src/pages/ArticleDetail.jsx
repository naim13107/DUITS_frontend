// src/pages/ArticleDetail.jsx - Light Futuristic Design
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { articlesAPI } from '../api/articles';
import { ArrowLeft, Calendar, Tag, Lock, ShieldAlert, Terminal } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const hasAccess = user && (user.is_superuser || user.role !== 'Visitor');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await articlesAPI.getArticle(id);
        setArticle(res.data);
      } catch (err) {
        toast.error("Data Node not found.");
        navigate('/articles');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, navigate]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
    </div>
  );

  if (!article) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 bg-slate-50 min-h-screen">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 rounded-lg shadow-sm transition-all mb-8 text-sm font-bold uppercase tracking-wider font-mono">
        <ArrowLeft className="w-4 h-4" /> Return
      </button>

      {/* Header Info */}
      <div className="mb-10 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
        {article.category && (
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 text-blue-600 rounded-md font-mono text-[10px] font-bold uppercase tracking-widest mb-6">
            Class: {article.category}
          </div>
        )}
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-8 tracking-tight">
          {article.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-mono bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
              {article.author_name?.charAt(0) || 'U'}
            </div>
            <span className="font-bold text-slate-800 uppercase tracking-widest text-xs">Auth: {article.author_name || 'Ghost_Writer'}</span>
          </div>
          <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-400"/> {new Date(article.created_at).toLocaleDateString()}</span>
          {article.tags && <span className="flex items-center gap-2"><Tag className="w-4 h-4 text-purple-400"/> {article.tags}</span>}
        </div>
      </div>

      {article.cover_image && (
        <div className="w-full h-64 md:h-[450px] rounded-3xl overflow-hidden mb-12 shadow-xl border border-slate-200 bg-slate-100 relative group">
          <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay z-10 pointer-events-none"></div>
          <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
        </div>
      )}

      {/* Content Area */}
      {hasAccess ? (
        <article 
          className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:font-medium prose-a:text-blue-600 prose-img:rounded-2xl prose-img:border prose-img:border-slate-200 prose-img:shadow-lg bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm"
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
      ) : (
        <div className="relative mt-8 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm overflow-hidden">
          
          {/* Blurred Placeholder */}
          <div className="prose prose-lg max-w-none opacity-20 blur-[8px] select-none pointer-events-none h-[500px]">
            <h2>System Architecture Overview</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
          </div>
          
          {/* Security Clearance Modal */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 bg-white/40 backdrop-blur-md">
            <div className="bg-white p-10 rounded-3xl shadow-2xl border border-red-100 text-center max-w-lg w-full relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
              
              <div className="bg-red-50 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-100 shadow-inner">
                <ShieldAlert className="w-12 h-12 text-red-500 animate-pulse" />
              </div>
              
              <h3 className="text-2xl font-black mb-3 text-slate-900 uppercase tracking-widest">Access Denied</h3>
              <p className="text-slate-500 mb-8 font-mono text-sm leading-relaxed border border-slate-100 bg-slate-50 p-4 rounded-xl">
                [ERR_INSUFFICIENT_CLEARANCE]<br/>
                Verified DUITS membership is required to decrypt and view this data node.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login" className="btn bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs uppercase tracking-widest px-8 shadow-lg border-none">
                  <Terminal className="w-4 h-4 mr-2" /> Authenticate
                </Link>
                <Link to="/recruitment" className="btn bg-white border-slate-200 hover:bg-slate-50 text-slate-700 font-mono text-xs uppercase tracking-widest px-8">
                  Request Clearance
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;