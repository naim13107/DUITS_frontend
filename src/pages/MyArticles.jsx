// src/pages/MyArticles.jsx - Light Futuristic Design
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articlesAPI } from '../api/articles';
import { PenTool, Plus, Sparkles, Clock, Eye, FileText, Database } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const MyArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMyArticles = async () => {
      try {
        const res = await articlesAPI.getArticles();
        const allArticles = res.data.results || res.data;
        
        const myFilteredArticles = allArticles.filter(article => 
          article.author === user?.id || 
          article.author_email === user?.email || 
          article.author_name === (user?.full_name || user?.name)
        );
        
        setArticles(myFilteredArticles);
      } catch (err) {
        toast.error("Failed to load data nodes.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyArticles();
    }
  }, [user]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-purple-600 animate-spin"></div>
    </div>
  );

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-20 min-h-screen bg-slate-50">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6 bg-white/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-50 border border-purple-100 mb-4">
              <Database className="w-4 h-4 text-purple-600" />
              <span className="font-mono text-[10px] font-bold text-purple-700 uppercase tracking-widest">Personal_Records</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              My Data Nodes
            </h1>
            <p className="text-slate-500 font-medium mt-2">Manage your submitted articles and track validation status.</p>
          </div>
          <Link to="/submit-article" className="btn bg-slate-900 hover:bg-purple-600 text-white border-none shadow-md transition-all duration-300 flex items-center gap-2 px-6 rounded-xl font-mono text-xs uppercase tracking-widest group">
            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Initialize Node
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-24 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-3xl mb-6 shadow-inner">
              <FileText className="w-16 h-16 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">No Data Nodes Found</h3>
            <p className="text-slate-500 mt-2 mb-8 font-medium">Your personal data repository is currently empty.</p>
            <Link to="/submit-article" className="btn bg-white border border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 shadow-sm transition-all rounded-xl font-mono text-xs uppercase tracking-widest px-8">
              Compile First Node
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-5 bg-transparent pl-8">Node Identifier</th>
                    <th className="bg-transparent">Classification</th>
                    <th className="bg-transparent">Validation State</th>
                    <th className="bg-transparent">Timestamp</th>
                    <th className="text-right bg-transparent pr-8">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {articles.map((article) => (
                    <tr key={article.id} className="hover:bg-slate-50 transition-colors group relative">
                      <td className="font-bold text-slate-800 group-hover:text-purple-600 transition-colors py-5 pl-8 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-purple-500 opacity-0 group-hover:opacity-100"></div>
                        {article.title}
                      </td>
                      <td className="text-slate-600 text-sm font-medium">{article.category || 'UNCLASSIFIED'}</td>
                      <td>
                        <span className={`inline-flex items-center px-3 py-1 rounded border text-[10px] font-bold tracking-widest shadow-sm ${
                          article.status === 'APPROVED' ? 'bg-green-50 border-green-200 text-green-700' : 
                          article.status === 'REJECTED' ? 'bg-red-50 border-red-200 text-red-700' : 
                          'bg-amber-50 border-amber-200 text-amber-700'
                        }`}>
                          {article.status || 'ANALYZING...'}
                        </span>
                      </td>
                      <td className="text-sm text-slate-500 font-mono flex items-center gap-2 mt-4">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(article.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="text-right pr-8">
                        <Link to={`/articles/${article.id}`} className="btn btn-sm bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-sm transition-all rounded-lg font-mono text-[10px] uppercase tracking-widest flex inline-flex items-center gap-2">
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyArticles;