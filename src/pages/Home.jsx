// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { 
  Terminal, Cpu, Palette, Users, Calendar, Award, Rocket, Quote, 
  Sparkles, Shield, Star, ArrowRight, Infinity, Zap, Activity, Code, Layers
} from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen relative bg-slate-50 overflow-hidden font-sans">
      
      {/* Global Futuristic Background Patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Animated Light Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60 mix-blend-multiply z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/50 rounded-full blur-[120px] animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-200/50 rounded-full blur-[100px] animate-pulse" style={{animationDuration: '10s', animationDelay: '2s'}}></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-green-200/40 rounded-full blur-[130px] animate-pulse" style={{animationDuration: '12s', animationDelay: '4s'}}></div>
      </div>

      {/* SECTION 1: Hero - Holographic Interface Vibe */}
      <section className="relative min-h-[95vh] flex items-center justify-center px-4 pt-24 pb-12 border-b border-slate-200 z-10">
        <div className="relative max-w-5xl mx-auto flex flex-col items-center text-center">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8 animate-fade-in-down">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="font-mono text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-[0.2em]">University of Dhaka // Tech Hub Online</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-[7rem] font-black mb-6 tracking-tighter text-slate-900 leading-[1.05] relative">
            <span className="absolute -left-8 -top-8 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></span>
            Technology, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 drop-shadow-sm">
              Community,
            </span><br />
            Leadership.
          </h1>
          
          {/* Subtext */}
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            The University's premier platform for digital innovation. We are a multidisciplinary ecosystem connecting <strong className="text-slate-800">Coders, Engineers,</strong> and <strong className="text-slate-800">Designers</strong> to build the future.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center relative z-20">
            <Link to="/recruitment" className="group relative flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-bold h-14 px-10 rounded-xl transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.5)] hover:shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)] overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
              <span className="relative z-10 tracking-wide uppercase text-sm">Join the Society</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <a href="#wings" className="group relative flex items-center justify-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200 hover:border-slate-300 text-slate-700 font-bold h-14 px-10 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md">
              <Layers className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <span className="tracking-wide uppercase text-sm">Explore Sectors</span>
            </a>
          </div>
          
          {/* Data Nodes (Stats) */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mt-20">
            {[
              { icon: GlobeIcon, label: "Est. 2011", val: "SYS_INIT" },
              { icon: UsersIcon, label: "3,500+ Alumni", val: "NETWORK" },
              { icon: ZapIcon, label: "50+ Events/Yr", val: "OPERATIONS" }
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-slate-200 px-5 py-2.5 rounded-full shadow-sm">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-blue-600">
                  <stat.icon />
                </div>
                <div className="text-left">
                  <div className="font-mono text-[9px] uppercase tracking-widest text-slate-400">{stat.val}</div>
                  <div className="text-sm font-bold text-slate-700">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 2: Three Wings - Tech Nodes */}
      <section id="wings" className="py-32 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-md mb-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors"></div>
              <Shield className="w-7 h-7 text-blue-600 relative z-10" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Three Vectors, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">One Directive</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Code, title: "Software Engineering", desc: "Full-stack development, AI/ML research, algorithm design, and competitive programming initiatives.", color: "from-blue-500 to-cyan-400", shadow: "group-hover:shadow-blue-500/20" },
              { icon: Cpu, title: "Robotics & Hardware", desc: "IoT infrastructure, industrial automation, embedded systems, and advanced circuit engineering.", color: "from-purple-500 to-pink-400", shadow: "group-hover:shadow-purple-500/20" },
              { icon: Palette, title: "Creative & Network", desc: "UI/UX architecture, digital branding, public relations, and corporate network management.", color: "from-amber-500 to-orange-400", shadow: "group-hover:shadow-orange-500/20" }
            ].map((wing, i) => (
              <div 
                key={i} 
                className={`group relative p-10 bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${wing.shadow} overflow-hidden`}
              >
                {/* Techy top border line */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${wing.color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-800 transition-colors duration-500 relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${wing.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                    <wing.icon className="w-7 h-7 relative z-10" />
                  </div>
                  <div className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-widest border border-slate-100 px-2 py-1 rounded-md">Sector_0{i+1}</div>
                </div>
                
                <h3 className="text-2xl font-black mb-4 text-slate-800 tracking-tight">{wing.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-sm">{wing.desc}</p>
                
                {/* Decorative circuit lines */}
                <div className="absolute -bottom-6 -right-6 text-slate-100 group-hover:text-slate-200/50 transition-colors pointer-events-none">
                  <Terminal className="w-32 h-32 opacity-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Activities - Dashboard Module Layout */}
      <section className="py-32 px-4 border-t border-slate-200 relative bg-white/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="lg:w-1/3">
              <div className="font-mono text-sm font-bold text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Core Operations
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                Execution <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-400">& Integration</span>
              </h2>
              <p className="text-slate-500 leading-relaxed font-medium mb-10 text-lg">
                We bridge the gap between academic theory and industry demands through rigorous, hands-on experiential learning protocols.
              </p>
              <Link to="/events" className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 font-bold h-12 px-8 rounded-xl transition-all shadow-sm hover:shadow-md hover:text-blue-600">
                View Event Logs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Users, title: "Skill Upgrades", desc: "Intensive bootcamps and workshops led by industry veterans." },
                { icon: Calendar, title: "Project Incubation", desc: "Collaborative building of robust applications solving real campus issues." },
                { icon: Award, title: "Competitive Matrix", desc: "Representation in prestigious national and international hackathons." },
                { icon: Rocket, title: "National IT Fest", desc: "Organizing Bangladesh's premier technology and innovation symposium." }
              ].map((activity, i) => (
                <div 
                  key={i} 
                  className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-lg group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[100px] -z-10 group-hover:bg-blue-100 transition-colors"></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <activity.icon className="w-8 h-8 text-blue-500" />
                    <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest">MOD_{i+1}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-slate-800">{activity.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{activity.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: Testimonials - Comms Transcripts */}
      <section className="py-32 px-4 border-t border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-slate-100 to-transparent -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="font-mono text-sm font-bold text-purple-600 uppercase tracking-widest mb-4">Encrypted Logs</div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Voices of Leadership
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                quote: "DUITS operates not just as a club, but as an incubator. It provides the crucial infrastructure required for the next generation of tech leaders to iterate, fail, and ultimately succeed.",
                name: "Arifur Rahman",
                role: "Former President",
                initials: "AR"
              },
              {
                quote: "The professional network cultivated here is unparalleled. From establishing fundamental programming concepts to securing industry placements, the society provides continuous leverage.",
                name: "Naimul Haque",
                role: "General Secretary",
                initials: "NH"
              }
            ].map((testimonial, i) => (
              <div 
                key={i} 
                className="bg-white p-10 md:p-12 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden group hover:border-purple-300 transition-colors"
              >
                {/* Decorative Tech Accents */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-200 group-hover:bg-purple-500 transition-colors"></div>
                <div className="absolute top-8 right-8 font-mono text-[8px] text-slate-300 tracking-[0.3em] uppercase rotate-90 origin-right">Transcript // Verified</div>
                
                <Quote className="w-10 h-10 text-purple-100 mb-6" />
                
                <p className="text-lg text-slate-600 leading-relaxed font-medium mb-10 relative z-10 italic">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center gap-4 relative z-10 border-t border-slate-100 pt-6">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-purple-600 font-black text-lg">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 tracking-wide">{testimonial.name}</p>
                    <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mt-1 bg-slate-100 inline-block px-2 py-0.5 rounded">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA - Terminal Boot Sequence */}
      <section className="py-32 px-4 relative bg-slate-900 border-t-8 border-blue-500 overflow-hidden">
        {/* Terminal Grids and Glows */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-8 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <Terminal className="w-8 h-8 text-blue-400" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight text-white drop-shadow-lg">
            Initialize <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Future.exe</span>
          </h2>
          
          <p className="text-xl text-slate-400 mb-12 font-mono max-w-2xl mx-auto">
            &gt; Align yourself with the university's most prestigious technology collective. Application protocols are currently on standby.
            <span className="inline-block w-2.5 h-5 bg-blue-500 ml-2 animate-pulse align-middle"></span>
          </p>
          
          <Link 
            to="/recruitment" 
            className="group relative inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold h-16 px-12 rounded-xl transition-all duration-300 shadow-[0_0_40px_-10px_rgba(59,130,246,0.8)] hover:shadow-[0_0_60px_-10px_rgba(59,130,246,1)] overflow-hidden hover:scale-105"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
            <Infinity className="w-5 h-5" />
            <span className="tracking-widest uppercase text-sm">Execute Registration</span>
          </Link>
          
          <div className="mt-12 flex items-center justify-center gap-2 text-slate-500 font-mono text-xs uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5" /> Secured by DUITS Core
          </div>
        </div>
      </section>

      {/* Inline styles for custom animations if tailwind config isn't modified */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

// Mini internal icon components
const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

export default Home;