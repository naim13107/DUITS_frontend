// src/pages/Articles.jsx - Light Futuristic Design
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articlesAPI } from '../api/articles';
import { Search, FileText, User, Calendar, TrendingUp, Grid3x3, ArrowRight, BookOpen } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await articlesAPI.getArticles();
        setArticles(res.data.results || res.data);
      } catch (err) {
        toast.error("Failed to load data nodes.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter(article => 
    article.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReadArticle = (articleId) => {
    if (!user) {
      toast.error('Authentication required to access full data node.', { icon: '🔒' });
      navigate('/login');
    } else {
      navigate(`/articles/${articleId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-slate-50 min-h-screen">
      
      {/* Header Deck */}
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 shadow-sm mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-100 mb-4">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="font-mono text-[10px] font-bold text-blue-700 uppercase tracking-widest">Knowledge_Base</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Data Library
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">
            Access compiled logs, research, and technical insights.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <input 
              type="text" 
              placeholder="Query database..." 
              className="input input-bordered w-full pl-12 pr-4 bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-inner rounded-xl font-mono text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <div className="bg-slate-100 p-1.5 rounded-xl flex items-center gap-1 border border-slate-200">
            <button 
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600 border border-slate-200' : 'text-slate-400 hover:text-slate-700'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button 
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600 border border-slate-200' : 'text-slate-400 hover:text-slate-700'}`}
              onClick={() => setViewMode('list')}
            >
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex flex-col gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="w-full h-48 bg-slate-100 rounded-2xl animate-pulse"></div>
              <div className="h-6 bg-slate-100 w-3/4 rounded animate-pulse mt-4"></div>
              <div className="h-4 bg-slate-100 w-1/2 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : filteredArticles.length > 0 ? (
        <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
          {filteredArticles.map((article) => (
            <div 
              key={article.id} 
              className="group bg-white rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Image Area */}
              <figure className={`${viewMode === 'grid' ? 'h-56' : 'h-72'} w-full relative overflow-hidden bg-slate-100 m-0 p-2`}>
                <div className="w-full h-full rounded-2xl overflow-hidden relative">
                  {article.cover_image ? (
                    <img 
                      src={article.cover_image} 
                      alt={article.title} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-slate-50 border border-slate-100">
                      <FileText className="w-12 h-12 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay"></div>
                </div>
              </figure>
              
              {/* Content Area */}
              <div className="p-8 flex flex-col flex-grow">
                {article.category && (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-500 mb-3 block">
                    {article.category}
                  </span>
                )}
                <h2 className="text-2xl font-black text-slate-900 mb-4 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors">
                  {article.title}
                </h2>
                
                <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-8 border border-slate-100 bg-slate-50 p-3 rounded-lg">
                  <span className="flex items-center gap-1.5 font-bold text-slate-700">
                    <User className="w-3.5 h-3.5 text-blue-500" /> 
                    {article.author_name || 'Anon'}
                  </span>
                  <span className="opacity-30">|</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> 
                    {new Date(article.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mt-auto">
                  <button 
                    onClick={() => handleReadArticle(article.id)} 
                    className="w-full py-3.5 bg-slate-50 hover:bg-slate-900 text-slate-700 hover:text-white border border-slate-200 hover:border-slate-900 rounded-xl font-mono text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Access Data <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">No matching logs</h3>
          <p className="text-slate-500 mt-2 font-medium">Refine your query parameters.</p>
        </div>
      )}
    </div>
  );
};

export default Articles;