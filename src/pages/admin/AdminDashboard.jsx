// AdminDashboard.jsx - Light Theme High-Tech Design
import { useState, useEffect } from 'react';
import { authAPI } from '../../api/auth';
import { recruitmentAPI } from '../../api/recruitment';
import apiClient from '../../api/apiClient'; 
import { 
  Users, ShieldCheck, Mail, Hash, Trash2, FileText, DollarSign, 
  UserPlus, Search, Download, Plus, X, Eye, CheckCircle, XCircle, Award, CreditCard, TrendingUp,
  Sparkles, Zap, BarChart3, Settings, LayoutDashboard, Terminal
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [isLoading, setIsLoading] = useState(true);
  
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [allSessions, setAllSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [newSessionData, setNewSessionData] = useState({ session_name: '', application_fee: 300, deadline: '' });
  const [articles, setArticles] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [panelMembers, setPanelMembers] = useState([]);
  const [isPanelModalOpen, setIsPanelModalOpen] = useState(false);
  const [newPanelData, setNewPanelData] = useState({ user: '', designation: 'Executive Member', session: '' });
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (activeTab === 'members' && users.length === 0) fetchUsers();
    if (activeTab === 'recruitment') fetchRecruitmentData();
    if (activeTab === 'articles' && articles.length === 0) fetchArticles();
    if (activeTab === 'finance' && transactions.length === 0) fetchTransactions();
    if (activeTab === 'panel') {
      fetchPanel();
      if (users.length === 0) fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await authAPI.getAllUsers();
      setUsers(response.data.results || response.data); 
    } catch (error) {
      toast.error("Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiClient.patch(`/auth/users/${userId}/`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}!`);
    } catch (err) {
      console.error("Role Update Error:", err.response || err);
      toast.error(err.response?.data?.detail || "Failed to update role on the server. Check backend permissions.");
    }
  };

const handleDeleteUser = async (userId, userName) => {
  if (!window.confirm(`Delete ${userName} permanently?`)) return;
  try {
    await apiClient.delete(`/auth/users/${userId}/`);
    setUsers(users.filter(u => u.id !== userId));
    toast.success(`User "${userName}" deleted!`);
  } catch (err) {
    console.error("Delete User Error:", err.response?.data);
    toast.error(err.response?.data?.detail || "Failed to delete user.");
  }
};

  const fetchRecruitmentData = async () => {
    setIsLoading(true);
    try {
      const [settingsRes, appsRes] = await Promise.all([
        recruitmentAPI.getSettings(),
        recruitmentAPI.getApplications(searchQuery)
      ]);
      const fetchedSessions = settingsRes.data.results || settingsRes.data;
      setAllSessions(fetchedSessions);
      if (fetchedSessions.length > 0 && !selectedSession) {
        setSelectedSession(fetchedSessions.find(s => s.is_open) || fetchedSessions);
      }
      setApplications(appsRes.data.results || appsRes.data);
    } catch (error) {
      toast.error("Failed to load recruitment data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'recruitment') {
      const delayDebounceFn = setTimeout(() => { fetchRecruitmentData(); }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery]);

  const toggleRecruitmentStatus = async () => {
    if (!selectedSession) return;
    try {
      const updatedStatus = !selectedSession.is_open;
      await recruitmentAPI.updateSetting(selectedSession.id, { is_open: updatedStatus });
      const updatedSession = { ...selectedSession, is_open: updatedStatus };
      setSelectedSession(updatedSession);
      setAllSessions(allSessions.map(s => String(s.id) === String(updatedSession.id) ? updatedSession : s));
      toast.success(`Recruitment is now ${updatedStatus ? 'OPEN' : 'CLOSED'}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Only one session can be open at a time.");
      fetchRecruitmentData();
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      const response = await recruitmentAPI.createSetting(newSessionData);
      setAllSessions([...allSessions, response.data]);
      setSelectedSession(response.data);
      setIsSessionModalOpen(false);
      setNewSessionData({ session_name: '', application_fee: 300, deadline: '' });
      toast.success("New Recruitment Session Created!");
    } catch (error) {
      toast.error("Failed to create session.");
    }
  };

  const handleDeleteSession = async () => {
    if (!selectedSession) return;
    if (!window.confirm(`DANGER: Delete "${selectedSession.session_name}" and ALL its applicants?`)) return;
    try {
      await recruitmentAPI.deleteSetting(selectedSession.id);
      toast.success("Session deleted!");
      const remainingSessions = allSessions.filter(s => s.id !== selectedSession.id);
      setAllSessions(remainingSessions);
      setSelectedSession(remainingSessions.length > 0 ? remainingSessions : null);
      fetchRecruitmentData();
    } catch (error) {
      toast.error("Failed to delete session.");
    }
  };

  const handleDownloadPDF = async (appId, applicantName) => {
    try {
      toast.loading("Generating PDF...", { id: 'pdf' });
      const response = await recruitmentAPI.downloadPdf(appId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${applicantName.replace(' ', '_')}_Application.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Download complete!", { id: 'pdf' });
    } catch (error) {
      toast.error("Failed to download PDF.", { id: 'pdf' });
    }
  };

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/articles/');
      setArticles(res.data.results || res.data);
    } catch (err) {
      toast.error("Failed to fetch articles");
    } finally {
      setIsLoading(false);
    }
  };

  // LOGICAL BUG FIX: Rely on the server response to update UI state
  const handleArticleStatus = async (id, status) => {
    try {
      const response = await apiClient.patch(`/articles/${id}/`, { status });
      
      // We grab the status returned by the server. If the server ignored it, it will return the old status.
      const serverStatus = response.data.status || status; 
      
      setArticles(articles.map(a => a.id === id ? { ...a, status: serverStatus } : a));
      
      if (serverStatus !== status) {
        toast.error(`Warning: Backend ignored the update. Check Django Serializer read_only fields.`);
      } else {
        toast.success(`Article marked as ${serverStatus}`);
      }
    } catch (err) {
      toast.error("Failed to update article status");
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/categories/', { name: newCategoryName });
      toast.success(`Category "${newCategoryName}" created successfully!`);
      setIsCategoryModalOpen(false);
      setNewCategoryName('');
    } catch (err) {
      toast.error(err.response?.data?.name?.[0]|| "Failed to create category. It may already exist.");
    }
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/transactions/');
      setTransactions(res.data.results || res.data);
    } catch (err) {
      toast.error("Failed to fetch transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const totalRevenue = transactions
    .filter(t => t.payment_status === 'PAID' || t.status === 'SUCCESS')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const fetchPanel = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/panel-members/');
      setPanelMembers(res.data.results || res.data);
    } catch (err) {
      toast.error("Failed to fetch panel members");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.full_name || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    (u.student_id || '').toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const handleAddPanelMember = async (e) => {
    e.preventDefault();
    if (!newPanelData.user) {
      toast.error("Please search and select a valid user from the list.");
      return;
    }

    try {
      const payload = {
        user: newPanelData.user, 
        designation: newPanelData.designation,
        session: newPanelData.session
      };

      const res = await apiClient.post('/panel-members/', payload);
      
      setPanelMembers([...panelMembers, res.data]);
      setIsPanelModalOpen(false);
      setNewPanelData({ user: '', designation: 'Executive Member', session: '' });
      setUserSearchTerm(''); 
      toast.success("Panel member added!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add panel member. Check console.");
    }
  };

  const handleRemovePanelMember = async (id) => {
    if (!window.confirm("Remove this member from the panel?")) return;
    try {
      await apiClient.delete(`/panel-members/${id}/`);
      setPanelMembers(panelMembers.filter(p => p.id !== id));
      toast.success("Member removed from panel");
    } catch (err) {
      toast.error("Failed to remove member");
    }
  };

  const displayedApps = applications.filter(app => {
    if (!selectedSession || !selectedSession.session_name) return false;
    const targetSessionName = String(selectedSession.session_name).trim().toLowerCase();
    const appDriveName = String(app.recruitment_drive_name || '').trim().toLowerCase();
    return targetSessionName === appDriveName;
  });

  const tabConfigs = [
    { id: 'members', icon: Users, label: 'Members', color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/30' },
    { id: 'recruitment', icon: UserPlus, label: 'Recruitment', color: 'from-green-500 to-emerald-500', shadow: 'shadow-green-500/30' },
    { id: 'articles', icon: FileText, label: 'Articles', color: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-500/30' },
    { id: 'finance', icon: DollarSign, label: 'Finance', color: 'from-amber-500 to-orange-500', shadow: 'shadow-orange-500/30' },
    { id: 'panel', icon: Award, label: 'Panel Setup', color: 'from-indigo-500 to-purple-500', shadow: 'shadow-indigo-500/30' }
  ];

  return (
    <div className="relative min-h-screen bg-grid-pattern overflow-hidden pt-8 pb-16">
      {/* Sci-Fi Animated Background Orbs - Adjusted for Light Theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-multiply opacity-50">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-purple-100 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] bg-green-100 rounded-full blur-[80px] animate-float-slow"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 z-10 animate-slide-up">
        {/* Futuristic Header Deck */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 shadow-xl mb-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>
          <div className="absolute -right-20 -top-20 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 rotate-12">
             <Settings className="w-96 h-96 text-slate-800 animate-spin-slow" style={{animationDuration: '30s'}} />
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
            <div className="relative">
              <div className="p-5 bg-slate-100 border border-slate-200 rounded-2xl shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
                <ShieldCheck className="w-12 h-12 text-blue-600 animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping shadow-sm"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-2 shadow-sm">
                <Zap className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span className="text-xs font-bold text-blue-700 uppercase tracking-[0.2em]">System Core Online</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 drop-shadow-sm mb-1">
                Control Matrix
              </h1>
              <p className="text-slate-500 text-sm font-mono flex items-center gap-2">
                <Terminal className="w-4 h-4" /> root@duits-mainframe:~/dashboard
              </p>
            </div>
          </div>
        </div>

        {/* HUD Navigation Tabs */}
        <div className="relative mb-8 z-20">
          <div className="flex overflow-x-auto gap-3 p-2 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200 shadow-lg">
            {tabConfigs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 whitespace-nowrap overflow-hidden relative ${
                  activeTab === tab.id 
                    ? `text-white shadow-md scale-[1.02] border border-transparent ${tab.shadow}` 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {activeTab === tab.id && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-100`}></div>
                )}
                {activeTab === tab.id && (
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-white/40"></div>
                )}
                <tab.icon className={`w-4 h-4 relative z-10 ${activeTab === tab.id ? 'animate-float' : ''}`} />
                <span className="relative z-10 tracking-wide">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Global Loading Hologram */}
        {isLoading && (
          <div className="flex justify-center items-center py-32 animate-zoom-in">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 border-r-4 border-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
              <div className="absolute inset-2 rounded-full border-b-4 border-purple-500 border-l-4 border-transparent animate-spin-reverse" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
              <div className="absolute inset-6 rounded-full border-t-4 border-green-500 border-r-4 border-transparent animate-spin" style={{ animationDuration: '1s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-blue-600 animate-pulse-slow" />
              </div>
            </div>
          </div>
        )}

        {/* ========================================= MEMBERS TAB ========================================= */}
        {!isLoading && activeTab === 'members' && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative animate-slide-up">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-400 via-cyan-400 to-transparent"></div>
            
            <div className="overflow-x-auto">
              <table className="table w-full border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-slate-600 text-xs uppercase tracking-[0.15em]">
                    <th className="py-5 bg-transparent">Member Data</th>
                    <th className="bg-transparent">Comms Link</th>
                    <th className="bg-transparent">Verification</th>
                    <th className="bg-transparent">Access Level</th>
                    <th className="text-right bg-transparent">Overrides</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((member) => (
                    <tr key={member.id} className="hover:bg-blue-50/50 transition-all duration-300 group">
                      <td className="py-4 bg-transparent relative">
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors">{member.full_name || 'Classified_Entity'}</div>
                        <div className="text-xs text-slate-500 font-mono flex items-center gap-1 mt-1"><Hash className="w-3 h-3 text-blue-500"/> UID-{member.student_id || 'UNKNOWN'}</div>
                      </td>
                      <td className="bg-transparent"><div className="flex items-center gap-2 font-mono text-sm text-slate-700"><Mail className="w-4 h-4 text-slate-400"/>{member.email}</div></td>
                      <td className="bg-transparent">
                        {member.is_verified ? 
                          <span className="badge bg-green-100 text-green-700 border border-green-200 py-3 px-4 font-bold tracking-wider shadow-sm">VERIFIED</span> : 
                          <span className="badge bg-amber-100 text-amber-700 border border-amber-200 py-3 px-4 font-bold tracking-wider shadow-sm animate-pulse">PENDING</span>
                        }
                      </td>
                      <td className="bg-transparent">
                        <select 
                          className="select select-bordered select-sm w-full max-w-xs bg-white border-slate-300 text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-mono text-xs uppercase" 
                          value={member.is_superuser ? 'admin' : member.role} 
                          onChange={(e) => handleRoleChange(member.id, e.target.value)} 
                          disabled={member.email === 'admin@gmail.com'}
                        >
                          <option value="Visitor">Lvl 1: Visitor</option>
                          <option value="Member">Lvl 2: Member</option>
                          <option value="Executive">Lvl 3: Executive</option>
                          <option value="Admin">Lvl 4: Admin (ROOT)</option>
                        </select>
                      </td>
                      <td className="text-right bg-transparent">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setSelectedUser(member)} className="btn btn-sm btn-ghost hover:bg-blue-100 hover:text-blue-700 transition-all text-slate-500">
                            <Eye className="w-4 h-4" /> Inspect
                          </button>
                          <button onClick={() => handleDeleteUser(member.id, member.full_name)} className="btn btn-sm bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 shadow-sm flex items-center gap-2 transition-all" disabled={member.email === 'admin@gmail.com'}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================= RECRUITMENT TAB ========================================= */}
        {!isLoading && activeTab === 'recruitment' && (
          <div className="space-y-8 animate-slide-up">
            {/* Control Console */}
            <div className="bg-white/90 backdrop-blur-xl flex flex-col md:flex-row justify-between items-center p-6 border border-slate-200 rounded-2xl gap-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full blur-3xl"></div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto relative z-10">
                <div className="w-2 h-8 bg-green-500 rounded-full shadow-sm"></div>
                <h3 className="font-bold text-slate-700 text-lg tracking-widest uppercase font-mono">Target Protocol:</h3>
                <div className="relative">
                  <select className="select select-bordered select-md w-full sm:w-80 bg-white border-slate-300 text-slate-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all font-mono tracking-wide" value={selectedSession?.id || ''} onChange={(e) => setSelectedSession(allSessions.find(s => String(s.id) === String(e.target.value)))}>
                    {allSessions.map(s => (<option key={s.id} value={s.id}>{s.session_name} {s.is_open ? ' [ONLINE]' : ' [OFFLINE]'}</option>))}
                    {allSessions.length === 0 && <option value="">NO PROTOCOLS FOUND</option>}
                  </select>
                </div>
              </div>
              <button onClick={() => setIsSessionModalOpen(true)} className="btn relative group border-none bg-transparent hover:bg-transparent overflow-hidden w-full md:w-auto z-10 shadow-md">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:from-green-600 group-hover:to-emerald-600 transition-all"></div>
                <span className="relative z-10 flex items-center gap-2 text-white font-bold tracking-widest text-sm shadow-sm">
                  <Plus className="w-5 h-5"/> INITIALIZE NEW
                </span>
              </button>
            </div>

            {/* Active Session Display */}
            {selectedSession && (
              <div className="bg-white/90 rounded-3xl border border-slate-200 relative overflow-hidden shadow-lg">
                <div className={`absolute top-0 left-0 w-full h-[3px] ${selectedSession.is_open ? 'bg-green-500' : 'bg-red-500'}`}></div>
                
                <div className="p-8 flex-col lg:flex-row justify-between items-start lg:items-center gap-8 flex relative z-10">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                        {selectedSession.session_name}
                      </h2>
                      <button onClick={handleDeleteSession} className="btn btn-sm bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 shadow-sm flex items-center gap-2 px-4 font-mono text-xs uppercase transition-all">
                        <Trash2 className="w-4 h-4" /> Purge Protocol
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-slate-600 font-mono text-sm">
                      <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200"><DollarSign className="w-4 h-4 text-green-600"/> Credits: ৳{selectedSession.application_fee}</span>
                      <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">Termination: {new Date(selectedSession.deadline).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 bg-slate-50 px-6 py-5 rounded-2xl border border-slate-200 shadow-inner w-full lg:w-auto justify-between lg:justify-start">
                    <div className="flex flex-col">
                      <span className="text-xs font-mono text-slate-500 mb-1 uppercase">Gate Status</span>
                      <span className={`font-black tracking-widest text-lg ${selectedSession.is_open ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedSession.is_open ? 'SYSTEM OPEN' : 'LOCKED DOWN'}
                      </span>
                    </div>
                    <div className="h-10 w-[2px] bg-slate-200 hidden lg:block"></div>
                    <input type="checkbox" className={`toggle toggle-lg ${selectedSession.is_open ? 'toggle-success' : 'toggle-error'}`} checked={selectedSession.is_open || false} onChange={toggleRecruitmentStatus} />
                  </div>
                </div>
              </div>
            )}

            {/* Applicants Database */}
            <div className="bg-white/90 rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
                <h3 className="font-bold text-xl flex items-center gap-3 tracking-widest uppercase text-slate-800">
                  <div className="p-2 bg-green-100 rounded-lg border border-green-200">
                    <Users className="w-5 h-5 text-green-700" />
                  </div>
                  Data Stream ({displayedApps.length})
                </h3>
                <div className="relative w-full md:w-96 group">
                  <input type="text" placeholder="Query ID, Name, Dept..." className="input input-bordered w-full pl-12 bg-white border-slate-300 text-slate-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all shadow-sm relative z-10 font-mono" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400 z-20 group-focus-within:text-green-600 transition-colors" />
                </div>
              </div>

              <div className="overflow-x-auto relative z-10">
                <table className="table w-full border-collapse">
                  <thead className="bg-white border-b border-slate-200 font-mono text-xs uppercase tracking-wider text-slate-500">
                    <tr><th className="py-5 bg-transparent">Subject Entity</th><th className="bg-transparent">Vector & Sync</th><th className="bg-transparent">Ledger Status</th><th className="bg-transparent">Timestamp</th><th className="text-right bg-transparent">Extraction</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedApps.map((app) => (
                      <tr key={app.id} className="hover:bg-green-50/50 transition-all duration-300 group">
                        <td className="py-4 bg-transparent relative">
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-green-500 opacity-0 group-hover:opacity-100"></div>
                          <div className="font-bold text-slate-800 text-base group-hover:text-green-700 transition-colors">{app.full_name}</div>
                          <div className="text-xs text-slate-500 font-mono flex gap-3 mt-1"><span>ID:{app.student_id}</span><span className="opacity-30">|</span><span>{app.phone}</span></div>
                        </td>
                        <td className="bg-transparent text-slate-800"><div className="font-bold tracking-wide">{app.department}</div><div className="text-xs text-slate-500 font-mono mt-1">SYNC:{app.session}</div></td>
                        <td className="bg-transparent">
                          <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md border text-xs font-bold tracking-widest shadow-sm ${
                            app.payment_status === 'PAID' ? 'bg-green-50 border-green-200 text-green-700' : 
                            app.payment_status === 'FAILED' ? 'bg-red-50 border-red-200 text-red-700' : 
                            'bg-amber-50 border-amber-200 text-amber-700'
                          }`}>{app.payment_status}</div>
                        </td>
                        <td className="font-mono text-xs text-slate-600 bg-transparent">{new Date(app.created_at).toLocaleDateString()}</td>
                        <td className="text-right bg-transparent">
                          <button onClick={() => handleDownloadPDF(app.id, app.full_name)} className="btn btn-sm bg-white hover:bg-green-50 text-green-700 border border-slate-200 hover:border-green-300 shadow-sm flex items-center gap-2 px-4 transition-all ml-auto font-mono uppercase text-xs">
                            <Download className="w-3.5 h-3.5" /> PDF_DUMP
                          </button>
                        </td>
                      </tr>
                    ))}
                    {displayedApps.length === 0 && <tr><td colSpan="5" className="text-center py-16 text-slate-400 font-mono tracking-widest bg-transparent">NO_DATA_FOUND_IN_STREAM</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= ARTICLES TAB ========================================= */}
        {!isLoading && activeTab === 'articles' && (
          <div className="space-y-8 animate-slide-up">
            <div className="bg-white/90 flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border border-slate-200 rounded-3xl shadow-xl gap-4 relative overflow-hidden">
               <div className="absolute left-0 top-0 w-2 h-full bg-purple-500"></div>
              <div className="pl-4">
                <h2 className="text-2xl font-black flex items-center gap-3 text-slate-800 tracking-widest uppercase">
                  <FileText className="w-6 h-6 text-purple-600 animate-pulse" />
                  Neural Network Posts
                </h2>
                <p className="text-sm font-mono text-slate-500 mt-1">Review and synchronize community knowledge base.</p>
              </div>
              <button onClick={() => setIsCategoryModalOpen(true)} className="btn relative group border-none bg-transparent hover:bg-transparent overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:from-purple-600 group-hover:to-pink-600 transition-all"></div>
                <span className="relative z-10 flex items-center gap-2 text-white font-bold tracking-widest text-xs uppercase">
                  <Plus className="w-4 h-4"/> Inject Category
                </span>
              </button>
            </div>

            <div className="bg-white/90 rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
              <div className="overflow-x-auto">
                <table className="table w-full border-collapse">
                  <thead className="bg-purple-50/50 border-b border-slate-200 font-mono text-xs uppercase tracking-wider text-purple-800/70">
                    <tr><th className="py-5 bg-transparent">Data Node</th><th className="bg-transparent">Originator</th><th className="bg-transparent">Timestamp</th><th className="bg-transparent">Integrity Check</th><th className="text-right bg-transparent">Execute Override</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {articles.map(article => (
                      <tr key={article.id} className="hover:bg-purple-50/50 transition-all duration-300 group">
                        <td className="font-bold text-slate-800 text-base bg-transparent group-hover:text-purple-700 transition-colors relative">
                          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-purple-500 opacity-0 group-hover:opacity-100"></div>
                          {article.title}
                        </td>
                        <td className="bg-transparent text-sm text-slate-700">{article.author_name || 'Ghost_Entity'}</td>
                        <td className="bg-transparent font-mono text-xs text-slate-500">{new Date(article.created_at).toLocaleDateString()}</td>
                        <td className="bg-transparent">
                          <span className={`inline-flex items-center px-3 py-1 rounded border text-xs font-bold tracking-widest ${
                            article.status === 'APPROVED' ? 'bg-green-50 border-green-200 text-green-700 shadow-sm' : 
                            article.status === 'REJECTED' ? 'bg-red-50 border-red-200 text-red-700 shadow-sm' : 
                            'bg-amber-50 border-amber-200 text-amber-700 shadow-sm'
                          }`}>
                            {article.status || 'PENDING'}
                          </span>
                        </td>
                        <td className="text-right bg-transparent">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => handleArticleStatus(article.id, 'APPROVED')} className="btn btn-sm bg-white hover:bg-green-50 text-green-600 border border-slate-200 hover:border-green-300 shadow-sm transition-all" title="Authorize"><CheckCircle className="w-4 h-4"/></button>
                            <button onClick={() => handleArticleStatus(article.id, 'REJECTED')} className="btn btn-sm bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-300 shadow-sm transition-all" title="Purge"><XCircle className="w-4 h-4"/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {articles.length === 0 && <tr><td colSpan="5" className="text-center py-16 text-slate-400 font-mono tracking-widest bg-transparent">NO_NODES_IN_QUEUE</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= FINANCE TAB ========================================= */}
        {!isLoading && activeTab === 'finance' && (
          <div className="space-y-8 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stat Cards with Light Tech styling */}
              <div className="bg-white/90 rounded-3xl border border-slate-200 border-b-[4px] border-b-green-500 shadow-xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-2xl group-hover:bg-green-100 transition-all duration-500"></div>
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-2">Total Yield Flux</p>
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-green-600 drop-shadow-sm">৳{totalRevenue}</h2>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-green-200 text-green-600 shadow-sm group-hover:shadow-md transition-all"><TrendingUp className="w-8 h-8"/></div>
                </div>
              </div>

              <div className="bg-white/90 rounded-3xl border border-slate-200 border-b-[4px] border-b-blue-500 shadow-xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-all duration-500"></div>
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-2">Network Exchanges</p>
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-blue-600 drop-shadow-sm">{transactions.length}</h2>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-blue-200 text-blue-600 shadow-sm group-hover:shadow-md transition-all"><CreditCard className="w-8 h-8"/></div>
                </div>
              </div>

              <div className="bg-white/90 rounded-3xl border border-slate-200 border-b-[4px] border-b-amber-500 shadow-xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-2xl group-hover:bg-amber-100 transition-all duration-500"></div>
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mb-2">Conversion Matrix</p>
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-amber-600 drop-shadow-sm">
                      {transactions.length > 0 ? Math.round((transactions.filter(t => t.payment_status === 'PAID').length / transactions.length) * 100) : 0}%
                    </h2>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-amber-200 text-amber-600 shadow-sm group-hover:shadow-md transition-all"><BarChart3 className="w-8 h-8"/></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
              <div className="overflow-x-auto relative z-10">
                <table className="table w-full border-collapse">
                  <thead className="bg-slate-100/50 border-b border-slate-200 font-mono text-xs uppercase tracking-wider text-slate-500">
                    <tr><th className="py-5 bg-transparent">Hash ID</th><th className="bg-transparent">Node Link</th><th className="bg-transparent">Volume</th><th className="bg-transparent">State Code</th><th className="bg-transparent">Block Time</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map(txn => (
                      <tr key={txn.id} className="hover:bg-slate-50/80 transition-all duration-300 group">
                        <td className="font-mono text-xs text-amber-600/70 group-hover:text-amber-600 transition-colors bg-transparent relative">
                           <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-amber-500 opacity-0 group-hover:opacity-100"></div>
                           {txn.transaction_id || txn.mer_txnid || 'N/A'}
                        </td>
                        <td className="font-bold text-slate-800 bg-transparent text-sm tracking-wide">{txn.applicant_name || `App #${txn.application_id}` || 'Unknown'}</td>
                        <td className="font-mono font-bold text-green-600 bg-transparent">৳{txn.amount}</td>
                        <td className="bg-transparent">
                          <span className={`inline-flex items-center px-3 py-1 rounded border text-[10px] font-bold tracking-widest uppercase ${
                            txn.payment_status === 'PAID' || txn.status === 'SUCCESS' ? 'bg-green-50 border-green-200 text-green-700 shadow-sm' : 
                            'bg-red-50 border-red-200 text-red-700 shadow-sm'
                          }`}>{txn.payment_status || txn.status}</span>
                        </td>
                        <td className="font-mono text-xs text-slate-500 bg-transparent">{new Date(txn.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                    {transactions.length === 0 && <tr><td colSpan="5" className="text-center py-16 text-slate-400 font-mono tracking-widest bg-transparent">NO_EXCHANGE_RECORDS_FOUND</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= PANEL TAB ========================================= */}
        {!isLoading && activeTab === 'panel' && (
          <div className="space-y-8 animate-slide-up">
            <div className="bg-white/90 flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border border-slate-200 rounded-3xl shadow-xl gap-4 relative overflow-hidden">
               <div className="absolute left-0 top-0 w-2 h-full bg-indigo-500"></div>
              <div className="pl-4">
                <h2 className="text-2xl font-black flex items-center gap-3 text-slate-800 tracking-widest uppercase">
                  <Award className="w-6 h-6 text-indigo-600 animate-pulse" />
                  Command Hierarchy
                </h2>
                <p className="text-sm font-mono text-slate-500 mt-1">Assign root privileges and administrative designations.</p>
              </div>
              <button onClick={() => setIsPanelModalOpen(true)} className="btn relative group border-none bg-transparent hover:bg-transparent overflow-hidden shadow-md">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 group-hover:from-indigo-600 group-hover:to-blue-600 transition-all"></div>
                <span className="relative z-10 flex items-center gap-2 text-white font-bold tracking-widest text-xs uppercase">
                  <Plus className="w-4 h-4"/> Authorize Entity
                </span>
              </button>
            </div>

            <div className="bg-white/90 rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
              <div className="overflow-x-auto">
                <table className="table w-full border-collapse">
                  <thead className="bg-indigo-50/50 border-b border-slate-200 font-mono text-xs uppercase tracking-wider text-indigo-800/70">
                    <tr><th className="py-5 bg-transparent">Operator Identity</th><th className="bg-transparent">Directive Role</th><th className="bg-transparent">Sector Vector</th><th className="text-right bg-transparent">Admin Override</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {panelMembers.map(pm => {
                      const memberName = pm.user?.full_name || pm.user?.name || "Unknown_Entity";
                      const memberImage = pm.user?.profile_image || null;
                      const memberDept = pm.user?.department || "N/A";
                      
                      return (
                        <tr key={pm.id} className="hover:bg-indigo-50/50 transition-all duration-300 group">
                          <td className="bg-transparent py-4 relative">
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500 opacity-0 group-hover:opacity-100"></div>
                            <div className="flex items-center gap-4">
                              {memberImage ? (
                                <div className="avatar">
                                  <div className="w-12 h-12 rounded-xl ring-1 ring-slate-200 group-hover:ring-indigo-300 transition-all p-0.5 bg-white"><img src={memberImage} alt="Avatar" className="rounded-lg" /></div>
                                </div>
                              ) : (
                                <div className="avatar placeholder">
                                  <div className="w-12 h-12 rounded-xl ring-1 ring-slate-200 group-hover:ring-indigo-300 transition-all bg-slate-100 flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-blue-50"></div>
                                    <span className="text-lg font-black text-indigo-700 relative z-10">{memberName.charAt(0)}</span>
                                  </div>
                                </div>
                              )}
                              <div className="font-bold text-slate-800 text-base group-hover:text-indigo-700 transition-colors tracking-wide">{memberName}</div>
                            </div>
                          </td>
                          <td className="bg-transparent">
                            <span className="inline-flex px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-widest shadow-sm rounded-md">
                              {pm.designation}
                            </span>
                          </td>
                          <td className="bg-transparent">
                            <div className="text-sm font-bold text-slate-800 tracking-wide">{memberDept}</div>
                            <div className="text-xs font-mono text-slate-500 mt-1">SYNC:{pm.session}</div>
                          </td>
                          <td className="text-right bg-transparent">
                            <button onClick={() => handleRemovePanelMember(pm.id)} className="btn btn-sm bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-300 shadow-sm transition-all" title="Revoke Clearance"><Trash2 className="w-4 h-4"/></button>
                          </td>
                        </tr>
                      );
                    })}
                    {panelMembers.length === 0 && <tr><td colSpan="4" className="text-center py-16 text-slate-400 font-mono tracking-widest bg-transparent">NO_DIRECTIVES_ESTABLISHED</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= FUTURISTIC MODALS ========================================= */}
        
        {/* User Inspect Modal */}
        {selectedUser && (
          <div className="modal modal-open bg-slate-900/40 backdrop-blur-sm transition-all duration-500">
            <div className="modal-box bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 max-w-md relative overflow-hidden animate-zoom-in">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
              <button onClick={() => setSelectedUser(null)} className="btn btn-sm btn-circle absolute right-6 top-6 bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-all duration-300 hover:rotate-90 text-slate-500"><X className="w-4 h-4" /></button>
              
              <div className="text-center mb-8 relative">
                <div className="absolute inset-0 bg-blue-50 rounded-full blur-3xl"></div>
                <div className="avatar placeholder mb-4 relative z-10">
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 ring-2 ring-blue-200 shadow-md overflow-hidden flex items-center justify-center p-1">
                    {selectedUser.profile_image ? 
                      <img src={selectedUser.profile_image} alt="User" className="rounded-xl object-cover w-full h-full" /> : 
                      <span className="text-4xl font-black bg-gradient-to-br from-blue-600 to-cyan-500 bg-clip-text text-transparent">{selectedUser.full_name?.charAt(0) || 'U'}</span>
                    }
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-wider">{selectedUser.full_name}</h3>
                <p className="font-mono text-xs text-blue-700 uppercase tracking-[0.2em] mt-2 border border-blue-200 bg-blue-50 inline-block px-3 py-1 rounded-full">{selectedUser.role}</p>
              </div>
              
              <div className="space-y-1 relative z-10">
                {[
                  { label: "Comms Link", val: selectedUser.email },
                  { label: "Terminal ID", val: selectedUser.phone || 'N/A' },
                  { label: "Registry No", val: selectedUser.student_id || 'N/A' },
                  { label: "Sector Unit", val: selectedUser.department || 'N/A' },
                  { label: "Sync Block", val: selectedUser.session || 'N/A' },
                  { label: "Hab Block", val: selectedUser.hall || 'N/A' }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                    <span className="font-mono text-xs uppercase text-slate-500 group-hover:text-blue-600 transition-colors">{item.label}</span>
                    <span className="font-bold text-sm text-slate-800 tracking-wide text-right">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create Session Modal */}
        {isSessionModalOpen && (
          <div className="modal modal-open bg-slate-900/40 backdrop-blur-sm transition-all duration-500">
            <div className="modal-box bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 max-w-md relative overflow-hidden animate-zoom-in">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400"></div>
              <button onClick={() => setIsSessionModalOpen(false)} className="btn btn-sm btn-circle absolute right-6 top-6 bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-all duration-300 hover:rotate-90 text-slate-500"><X className="w-4 h-4" /></button>
              
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500 uppercase tracking-widest">
                <Zap className="w-6 h-6 text-green-500" /> Boot Protocol
              </h3>
              
              <form onSubmit={handleCreateSession} className="space-y-6 relative z-10">
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-xs uppercase tracking-widest text-slate-500 group-focus-within:text-green-600 transition-colors">Protocol Designation</span></label>
                  <input type="text" className="input input-bordered w-full bg-white border-slate-300 text-slate-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all shadow-sm font-mono text-sm" required value={newSessionData.session_name} onChange={(e) => setNewSessionData({...newSessionData, session_name: e.target.value})} />
                </div>
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-xs uppercase tracking-widest text-slate-500 group-focus-within:text-green-600 transition-colors">Credit Requirement (৳)</span></label>
                  <input type="number" className="input input-bordered w-full bg-white border-slate-300 text-slate-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all shadow-sm font-mono text-sm" required value={newSessionData.application_fee} onChange={(e) => setNewSessionData({...newSessionData, application_fee: e.target.value})} />
                </div>
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-xs uppercase tracking-widest text-slate-500 group-focus-within:text-green-600 transition-colors">Termination Timestamp</span></label>
                  <input type="datetime-local" className="input input-bordered w-full bg-white border-slate-300 text-slate-800 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all shadow-sm font-mono text-sm" required value={newSessionData.deadline} onChange={(e) => setNewSessionData({...newSessionData, deadline: e.target.value})} />
                </div>
                <div className="modal-action mt-8 flex gap-3 pt-4 border-t border-slate-100">
                  <button type="button" className="btn bg-slate-100 hover:bg-slate-200 text-slate-600 border-none transition-all font-mono text-xs tracking-widest uppercase" onClick={() => setIsSessionModalOpen(false)}>Abort</button>
                  <button type="submit" className="btn bg-green-100 hover:bg-green-200 text-green-700 border border-green-200 shadow-sm transition-all font-mono text-xs tracking-widest uppercase px-8">Execute</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Panel Member Modal */}
        {isPanelModalOpen && (
          <div className="modal modal-open bg-slate-900/40 backdrop-blur-sm transition-all duration-500">
            <div className="modal-box bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 max-w-md overflow-visible animate-zoom-in relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-400"></div>
              <button onClick={() => { setIsPanelModalOpen(false); setUserSearchTerm(''); }} className="btn btn-sm btn-circle absolute right-6 top-6 bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-all duration-300 hover:rotate-90 text-slate-500"><X className="w-4 h-4" /></button>
              
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 uppercase tracking-widest">
                <ShieldCheck className="w-6 h-6 text-indigo-500" /> Grant Access
              </h3>
              
              <form onSubmit={handleAddPanelMember} className="space-y-6">
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-xs uppercase tracking-widest text-slate-500 group-focus-within:text-indigo-600 transition-colors">Query Entity Vector *</span></label>
                  <input 
                    type="text" 
                    className="input input-bordered w-full bg-white border-slate-300 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all shadow-sm font-mono text-sm" 
                    placeholder="Input Name, Email, or Hash..." 
                    value={userSearchTerm}
                    onChange={(e) => {
                      setUserSearchTerm(e.target.value);
                      setIsUserDropdownOpen(true);
                    }}
                    onFocus={() => setIsUserDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setIsUserDropdownOpen(false), 200)} 
                  />
                  
                  {isUserDropdownOpen && (
                    <ul className="absolute z-50 top-[76px] w-full max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl p-2">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map(u => (
                          <li 
                            key={u.id} 
                            className="p-3 hover:bg-indigo-50 cursor-pointer rounded-lg flex flex-col transition-all border-b border-slate-100 last:border-0 group/item"
                            onMouseDown={() => { 
                              setNewPanelData({...newPanelData, user: u.id});
                              setUserSearchTerm(`${u.full_name} (${u.student_id || u.email})`);
                              setIsUserDropdownOpen(false);
                            }}
                          >
                            <span className="font-bold text-sm text-slate-800 group-hover/item:text-indigo-700">{u.full_name || 'Classified'}</span>
                            <span className="font-mono text-[10px] text-slate-500 uppercase mt-1">{u.email} // ID: {u.student_id || 'NULL'}</span>
                          </li>
                        ))
                      ) : (
                        <li className="p-4 text-slate-400 font-mono text-xs text-center uppercase tracking-widest">No matching vectors</li>
                      )}
                    </ul>
                  )}
                  <label className="label pt-2"><span className="font-mono text-[10px] uppercase text-indigo-400">Entity must exist in primary database.</span></label>
                </div>
                
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-xs uppercase tracking-widest text-slate-500 group-focus-within:text-indigo-600 transition-colors">Clearance Level *</span></label>
                  <select className="select select-bordered w-full bg-white border-slate-300 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all shadow-sm font-mono text-sm appearance-none" required value={newPanelData.designation} onChange={(e) => setNewPanelData({...newPanelData, designation: e.target.value})}>
                    <option value="President">PRIME_DIRECTIVE (President)</option>
                    <option value="Vice President">SUB_PRIME (Vice President)</option>
                    <option value="General Secretary">CORE_LOGIC (General Secretary)</option>
                    <option value="Joint Secretary">AUX_LOGIC (Joint Secretary)</option>
                    <option value="Organizing Secretary">SYS_OPS (Organizing Secretary)</option>
                    <option value="Treasurer">LEDGER_KEEPER (Treasurer)</option>
                    <option value="Executive Member">NODE_EXEC (Executive Member)</option>
                  </select>
                </div>
                
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-xs uppercase tracking-widest text-slate-500 group-focus-within:text-indigo-600 transition-colors">Sync Cycle Block</span></label>
                  <input type="text" className="input input-bordered w-full bg-white border-slate-300 text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all shadow-sm font-mono text-sm" placeholder="e.g., 2023-2024" required value={newPanelData.session} onChange={(e) => setNewPanelData({...newPanelData, session: e.target.value})} />
                </div>
                
                <div className="modal-action mt-8 flex gap-3 pt-4 border-t border-slate-100">
                  <button type="button" className="btn bg-slate-100 hover:bg-slate-200 text-slate-600 border-none transition-all font-mono text-xs tracking-widest uppercase" onClick={() => { setIsPanelModalOpen(false); setUserSearchTerm(''); }}>Abort</button>
                  <button type="submit" className="btn bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border border-indigo-200 shadow-sm transition-all font-mono text-xs tracking-widest uppercase px-8">Authorize</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Category Modal */}
        {isCategoryModalOpen && (
          <div className="modal modal-open bg-slate-900/40 backdrop-blur-sm transition-all duration-500">
            <div className="modal-box bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 max-w-sm relative overflow-hidden animate-zoom-in">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-400"></div>
              <button onClick={() => setIsCategoryModalOpen(false)} className="btn btn-sm btn-circle absolute right-6 top-6 bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-all duration-300 hover:rotate-90 text-slate-500"><X className="w-4 h-4" /></button>
              
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 uppercase tracking-widest">
                <Terminal className="w-6 h-6 text-purple-500" /> Init Class
              </h3>
              
              <form onSubmit={handleCreateCategory} className="space-y-6 relative z-10">
                <div className="form-control relative group">
                  <label className="label pb-1"><span className="font-mono text-xs uppercase tracking-widest text-slate-500 group-focus-within:text-purple-600 transition-colors">Class Designation</span></label>
                  <input 
                    type="text" 
                    className="input input-bordered w-full bg-white border-slate-300 text-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm font-mono text-sm" 
                    placeholder="e.g. ArtIntel_Protocol"
                    required 
                    value={newCategoryName} 
                    onChange={(e) => setNewCategoryName(e.target.value)} 
                  />
                </div>
                <div className="modal-action mt-8 flex gap-3 pt-4 border-t border-slate-100">
                  <button type="button" className="btn bg-slate-100 hover:bg-slate-200 text-slate-600 border-none transition-all font-mono text-xs tracking-widest uppercase" onClick={() => setIsCategoryModalOpen(false)}>Abort</button>
                  <button type="submit" className="btn bg-purple-100 hover:bg-purple-200 text-purple-700 border border-purple-200 shadow-sm transition-all font-mono text-xs tracking-widest uppercase px-6">Compile</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;