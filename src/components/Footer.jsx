// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { Phone, Mail, Send } from 'lucide-react';

// Custom SVG for Facebook
const FacebookIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// Custom SVG for LinkedIn
const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear(); 

  const linkGroups = [
    {
      title: "Quick Links",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Events", path: "/events" },
        { name: "Projects", path: "/projects" }, 
        { name: "Team", path: "/panel" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", path: "/articles" },
        { name: "Gallery", path: "/gallery" },
        { name: "Tutorials", path: "/tutorials" },
        { name: "FAQ", path: "/faq" },
      ]
    },
    {
      title: "Community",
      links: [
        { name: "Join Us", path: "/recruitment" },
        { name: "Code of Conduct", path: "/code-of-conduct" },
        { name: "Contact", path: "/contact" },
        { name: "Support", path: "/support" },
      ]
    }
  ];

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand & Contact Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Logo area */}
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-xl shadow-md group-hover:bg-blue-600 transition-colors">
                DU
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                Dhaka University IT Society
              </span>
            </Link>

            {/* Contact Info */}
            <div className="space-y-4 text-slate-800 font-medium">
              <div className="flex items-center gap-4 group">
                <Phone className="w-5 h-5 text-slate-700" strokeWidth={2.5} />
                <a href="tel:01519-201101" className="hover:text-blue-600 transition-colors">01519-201101</a>
              </div>
              <div className="flex items-center gap-4 group">
                <Mail className="w-5 h-5 text-slate-700" strokeWidth={2.5} />
                <a href="mailto:duits.official@gmail.com" className="hover:text-blue-600 transition-colors">duits.official@gmail.com</a>
              </div>
              <div className="flex items-start gap-4 group">
                <Send className="w-5 h-5 text-slate-700 mt-0.5" strokeWidth={2.5} />
                <span className="leading-relaxed">
                  1st Floor, TSC, University of Dhaka, Dhaka, Bangladesh
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 border border-transparent hover:border-blue-100">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 border border-transparent hover:border-blue-100">
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a href="mailto:duits.official@gmail.com" className="w-10 h-10 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 border border-transparent hover:border-blue-100">
                <Mail className="w-5 h-5" strokeWidth={2} />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {linkGroups.map((group, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="font-bold text-slate-900 text-lg mb-6 tracking-tight">
                {group.title}
              </h3>
              <ul className="space-y-4">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.path} 
                      className="text-slate-500 hover:text-blue-600 font-medium transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 font-medium text-sm">
            © {currentYear} Dhaka University IT Society. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/privacy-policy" className="text-slate-500 hover:text-slate-800 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-slate-500 hover:text-slate-800 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;