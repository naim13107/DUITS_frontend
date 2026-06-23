// src/pages/Events.jsx - Light Futuristic Design
import { useState, useEffect } from 'react';
import { eventsAPI } from '../api/events';
import { Calendar as CalendarIcon, MapPin, Clock, Sparkles, Users, Zap, Terminal } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventsAPI.getEvents();
        setEvents(res.data.results || res.data);
      } catch (err) {
        toast.error("Failed to fetch schedule.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const today = new Date();
  const upcomingEvents = events.filter(e => new Date(e.date || e.created_at) >= today);
  const pastEvents = events.filter(e => new Date(e.date || e.created_at) < today);
  
  const displayedEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-20 min-h-screen bg-slate-50">
      {/* Minimal Tech Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
            <CalendarIcon className="w-4 h-4 text-purple-500" />
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">Schedule_Sync</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 bg-clip-text text-transparent tracking-tight">
            Program <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">Log</span>
          </h1>
          <p className="text-lg text-slate-500 mt-4 font-medium max-w-xl mx-auto">Discover technical workshops, hackathons, and symposiums.</p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="flex bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-md border border-slate-200">
            <button 
              className={`flex items-center gap-2 px-8 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all rounded-xl ${activeTab === 'upcoming' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('upcoming')}
            >
              <Zap className={`w-4 h-4 ${activeTab === 'upcoming' ? 'text-yellow-400' : ''}`} />
              Active / Upcoming
            </button>
            <button 
              className={`flex items-center gap-2 px-8 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all rounded-xl ${activeTab === 'past' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
              onClick={() => setActiveTab('past')}
            >
              <Terminal className="w-4 h-4" />
              Archived
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-purple-600 animate-spin"></div>
          </div>
        ) : displayedEvents.length === 0 ? (
          <div className="text-center py-24 bg-white/60 backdrop-blur-md border border-slate-200 rounded-3xl shadow-sm">
            <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CalendarIcon className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">No {activeTab} logs found</h3>
            <p className="text-slate-500 mt-2 font-medium">System schedule is currently clear.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {displayedEvents.map((event, index) => {
              const eventDate = new Date(event.date || event.created_at);
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={event.id} 
                  className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-200 hover:border-purple-300 overflow-hidden flex flex-col md:flex-row relative"
                >
                  {/* Left Date Block */}
                  <div className="bg-slate-900 flex flex-col justify-center items-center w-full md:w-48 p-8 text-center relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <span className="text-6xl font-black text-white relative z-10">{eventDate.getDate()}</span>
                    <span className="text-sm font-mono text-purple-400 font-bold uppercase tracking-widest mt-2 relative z-10 border border-purple-500/30 bg-purple-500/10 px-3 py-1 rounded">
                      {eventDate.toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-xs text-slate-500 font-mono mt-2 relative z-10">{eventDate.getFullYear()}</span>
                  </div>
                  
                  {/* Right Content Block */}
                  <div className="p-8 relative z-10 flex flex-col justify-center flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <h2 className="text-3xl font-black text-slate-900 group-hover:text-purple-700 transition-colors tracking-tight">
                        {event.title || event.name || 'Untitled Event'}
                      </h2>
                      {event.type && (
                        <span className="inline-flex items-center px-3 py-1 bg-purple-50 border border-purple-200 text-purple-700 rounded-md font-mono text-[10px] font-bold uppercase tracking-widest shadow-sm">
                          {event.type}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 mb-8 leading-relaxed text-lg">
                      {event.description || 'No execution details provided in the system log.'}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-xs font-mono uppercase tracking-widest text-slate-500 mt-auto border-t border-slate-100 pt-6">
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                        <MapPin className="w-4 h-4 text-purple-500" /> 
                        <span className="font-bold text-slate-700">{event.location || 'TSC, DU'}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                        <Clock className="w-4 h-4 text-purple-500" /> 
                        <span className="font-bold text-slate-700">{event.time || '10:00 AM'}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span className="font-bold text-slate-700">{event.attendees || 'Public Array'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;