// src/pages/Panel.jsx - Light Futuristic Design
import { useState, useEffect } from 'react';
import { panelAPI } from '../api/panel';
import { toast } from 'react-hot-toast';
import { Sparkles, Users, User, Mail, ShieldAlert, Binary } from 'lucide-react';

const Panel = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPanel = async () => {
      try {
        const res = await panelAPI.getPanelMembers();
        const allMembers = res.data.results || res.data;
        setMembers(allMembers);
      } catch (err) {
        toast.error("Failed to load hierarchy data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPanel();
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-20 min-h-screen bg-slate-50">
      {/* Light Tech Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
            <ShieldAlert className="w-4 h-4 text-indigo-500" />
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin_Nodes</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 bg-clip-text text-transparent tracking-tight">
            Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">Hierarchy</span>
          </h1>
          <p className="text-lg text-slate-500 mt-4 font-medium max-w-xl mx-auto">Executive entities overseeing DUITS operations.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin"></div>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-24 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-3xl mb-6 shadow-inner">
              <Users className="w-16 h-16 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">No Admin Nodes Found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {members.map((member, index) => (
              <div 
                key={member.id} 
                className="group relative bg-white rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Tech Line */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 to-blue-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="p-8 flex flex-col items-center text-center relative z-10">
                  <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-2xl ring-1 ring-slate-200 group-hover:ring-indigo-300 transition-all duration-500 overflow-hidden bg-slate-50 flex items-center justify-center shadow-inner p-1">
                      {member.image || member.profile_image ? (
                        <img src={member.image || member.profile_image} alt={member.name || member.full_name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <span className="text-5xl font-black text-slate-300">
                          {member.name?.charAt(0) || member.full_name?.charAt(0) || member.user?.full_name?.charAt(0) || 'E'}
                        </span>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
                      <Binary className="w-4 h-4 text-indigo-500" />
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors tracking-tight mb-2">
                    {member.name || member.full_name || member.user?.full_name || 'Classified Entity'}
                  </h2>
                  
                  <div className="inline-flex items-center px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md font-mono text-[10px] font-bold uppercase tracking-widest shadow-sm w-full justify-center">
                    {member.designation || 'SYS_ADMIN'}
                  </div>
                  
                  <div className="w-full mt-6 pt-6 border-t border-slate-100 flex flex-col gap-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    <div className="flex items-center justify-center gap-2 bg-slate-50 rounded py-1 px-2 border border-slate-100">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{member.department || member.user?.department || 'SECTOR_UNKNOWN'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 bg-slate-50 rounded py-1 px-2 border border-slate-100">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{member.user?.email || 'NO_COMMS_LINK'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Panel;