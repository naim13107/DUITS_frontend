// VerifyEmail.jsx - Futuristic Design
import { MailCheck, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const VerifyEmail = () => {
  const location = useLocation();
  const email = location.state?.email || "your email address";

  return (
    <div className="relative flex items-center justify-center min-h-[80vh] px-4 my-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative card w-full max-w-md bg-base-100/90 backdrop-blur-xl shadow-2xl border border-base-200/50 text-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>
        
        <div className="card-body items-center p-10">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/30">
              <MailCheck className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full animate-ping"></div>
          </div>
          
          <h2 className="card-title text-3xl font-black mt-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Check Your Email
          </h2>
          
          <p className="text-base-content/70 mb-4 leading-relaxed">
            We have sent an account activation link to <br />
            <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{email}</span>.
          </p>
          
          <p className="text-sm text-base-content/50 mb-6">
            Please check your inbox (and your spam folder) to activate your account before logging in.
          </p>
          
          <Link to="/login" className="btn bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-none w-full shadow-2xl shadow-primary/30 transition-all duration-300 hover:scale-[1.02] group">
            Return to Login
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-base-content/30">
            <Shield className="w-3 h-3" />
            <span>Check your spam folder if you don't see the email</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;