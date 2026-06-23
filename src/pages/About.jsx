// src/pages/About.jsx - Light Futuristic Design
import { Info, History, Target, Sparkles, Code, Cpu, Network } from 'lucide-react';

const About = () => {
  return (
    <div className="relative max-w-5xl mx-auto px-4 py-24 min-h-screen">
      {/* Background Tech Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      {/* Animated Light Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-200/40 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative text-center mb-20 z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-widest">System_Init: 2011</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 bg-clip-text text-transparent tracking-tight">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">DUITS</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
          Empowering the youth through technology, structural logic, and community-driven innovation.
        </p>
      </div>

      <div className="relative space-y-8 z-10">
        {[
          { icon: Network, title: "Who We Are", color: "blue", 
            desc: "Dhaka University IT Society (DUITS) is a university-wide tech organization based at the Teacher-Student Centre (TSC). We are a community of passionate learners, developers, and tech enthusiasts bridging the gap between academic knowledge and industry demands." },
          { icon: Target, title: "Our Directive", color: "purple",
            desc: "To create a digitally empowered student community that leads the technological advancement of Bangladesh. We strive to provide every student with the resources, mentorship, and platform needed to excel in the IT sector.",
            list: ["Executing national level tech symposiums.", "Compiling free skill development algorithms.", "Establishing peer-to-peer industry networks."] },
          { icon: History, title: "Origin Story", color: "green",
            desc: "Founded in 2011 by a visionary group of students and faculty members, DUITS started as a small club to share programming resources. Today, it stands as the largest tech community in the university, having trained thousands of students and organized massive events like the National IT Festival." }
        ].map((item, index) => (
          <div 
            key={index}
            className="group relative bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 hover:border-slate-300 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
          >
            {/* Tech border accent */}
            <div className={`absolute top-0 left-0 w-2 h-full bg-${item.color}-500 opacity-80`}></div>
            
            <div className="flex flex-col md:flex-row gap-8 items-start p-8 md:p-10">
              <div className={`w-16 h-16 rounded-2xl bg-${item.color}-50 border border-${item.color}-100 flex flex-shrink-0 items-center justify-center text-${item.color}-600 group-hover:scale-110 group-hover:bg-${item.color}-100 transition-all duration-300 shadow-sm`}>
                <item.icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-black mb-4 text-slate-800 tracking-tight flex items-center gap-4">
                  {item.title}
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg">{item.desc}</p>
                {item.list && (
                  <ul className="mt-6 space-y-3">
                    {item.list.map((li, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-700 font-medium bg-slate-50 border border-slate-100 rounded-lg px-4 py-2">
                        <Code className={`w-4 h-4 text-${item.color}-500`} />
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;