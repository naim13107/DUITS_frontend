// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Terminal, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ theme, toggleTheme }) => {
  const { user, logout, isAdmin, isMember } = useAuth();
  const [progress, setProgress] = useState(0);
  const location = useLocation(); 

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const total = document.body.scrollHeight - window.innerHeight;
      const currentProgress = total > 0 ? (scrolled / total) * 100 : 0;
      setProgress(currentProgress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const drawer = document.getElementById('mobile-drawer');
    if (drawer) drawer.checked = false;
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Articles', path: '/articles' },
    { name: 'Recruitment', path: '/recruitment' },
    { name: 'Panel', path: '/panel' },
    { name: 'Contact', path: '/contact' },
  ];

  const NavItem = ({ item }) => (
    <li className="relative group">
      <NavLink 
        to={item.path}
        className={({ isActive }) => 
          `flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
            isActive 
              ? 'text-blue-600 bg-blue-50/50 rounded-lg' 
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg'
          }`
        }
      >
        {({ isActive }) => (
          <>
            {isActive && <span className="absolute left-2 w-1 h-1 bg-blue-600 rounded-full animate-pulse"></span>}
            <span className={isActive ? 'ml-2' : ''}>{item.name}</span>
          </>
        )}
      </NavLink>
    </li>
  );

  return (
    <div className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="navbar container mx-auto px-4 h-20">
        
        {/* LEFT SIDE: Mobile Menu & Logo */}
        <div className="navbar-start">
          <div className="drawer w-auto lg:hidden mr-2">
            <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              <label htmlFor="mobile-drawer" className="btn btn-ghost btn-circle drawer-button text-slate-600 hover:bg-slate-100">
                <Menu className="h-5 w-5" />
              </label>
            </div>
            
            <div className="drawer-side fixed inset-0 z-50">
              <label htmlFor="mobile-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="menu p-6 w-80 min-h-full bg-white/95 backdrop-blur-xl border-r border-slate-200 flex flex-col gap-2 relative pt-20 shadow-2xl">
                <label htmlFor="mobile-drawer" className="btn btn-ghost btn-circle absolute top-4 right-4 text-slate-500">
                  <X className="h-6 w-6" />
                </label>
                <div className="font-mono text-xs text-slate-400 uppercase tracking-widest mb-4 px-4">Navigation</div>
                {navLinks.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </ul>
            </div>
          </div>

          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-black rounded-xl shadow-md group-hover:bg-blue-600 transition-colors relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
              <span className="relative z-10">DU</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-slate-900 leading-tight tracking-tight">DUITS</span>
              <span className="font-mono text-[9px] text-blue-600 leading-none tracking-[0.2em] font-bold uppercase">IT Society</span>
            </div>
          </Link>
        </div>

        {/* CENTER: Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-1">
            {navLinks.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </ul>
        </div>

        {/* RIGHT SIDE: Theme Toggle & Auth */}
        <div className="navbar-end gap-3">
          <button onClick={toggleTheme} className="btn btn-ghost btn-circle text-slate-500 hover:bg-slate-100" aria-label="Toggle Theme">
            {theme === 'duits_dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {!user ? (
            <Link to="/login" className="group relative inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-bold h-10 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden">
               <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
               <Terminal className="w-4 h-4" />
               <span className="text-xs uppercase tracking-widest">Login</span>
            </Link>
          ) : (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder ring-2 ring-slate-200 hover:ring-blue-400 transition-all">
                <div className="bg-slate-100 text-slate-800 rounded-full w-10 shadow-inner overflow-hidden">
                  {user.profile_image ? (
                    <img src={user.profile_image} alt="User" className="object-cover" />
                  ) : (
                    <span className="text-lg font-black">{user.full_name?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
              </div>
              <ul tabIndex={0} className="mt-4 z-50 p-2 shadow-2xl menu menu-sm dropdown-content bg-white/95 backdrop-blur-xl rounded-2xl w-60 border border-slate-200">
                <li className="px-4 py-3 border-b border-slate-100 mb-2">
                  <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-1">Logged in as</div>
                  <div className="font-bold text-slate-800 truncate">{user.full_name}</div>
                </li>
                <li><Link to="/profile" className="hover:bg-blue-50 hover:text-blue-700 font-medium py-2 rounded-lg">Profile</Link></li>
                
                {/* RESTRICTED LINKS */}
                {isMember() && (
                  <>
                    <li><Link to="/my-articles" className="hover:bg-blue-50 hover:text-blue-700 font-medium py-2 rounded-lg">My Articles</Link></li>
                    <li><Link to="/submit-article" className="hover:bg-blue-50 hover:text-blue-700 font-medium py-2 rounded-lg">Submit Article</Link></li>
                  </>
                )}
                
                {isAdmin() && (
                  <>
                    <div className="divider my-0"></div>
                    <li>
                      <Link to="/admin/dashboard" className="text-blue-600 font-bold hover:bg-blue-50 py-2 rounded-lg flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    </li>
                  </>
                )}
                
                <div className="divider my-0"></div>
                <li><button onClick={logout} className="text-red-600 font-bold hover:bg-red-50 py-2 rounded-lg">Logout</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-300 ease-out z-50" style={{ width: `${progress}%` }} />
    </div>
  );
};

export default Navbar;