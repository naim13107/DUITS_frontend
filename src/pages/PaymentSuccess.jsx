// src/pages/PaymentSuccess.jsx - Light Futuristic Design
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { recruitmentAPI } from '../api/recruitment';
import { CheckCircle2, XCircle, Clock, Download, Terminal, User, FileText, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const urlAppId = searchParams.get('app');
  const urlTrxId = searchParams.get('trx'); 
  const appId = urlAppId || localStorage.getItem('pending_app_id');
  
  const [status, setStatus] = useState('VERIFYING');
  const [application, setApplication] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const pollRef = useRef(null);

  useEffect(() => {
    if (!appId) {
      setStatus('NOT_FOUND');
      return;
    }

    let attempts = 0;
    const maxAttempts = 15;

    const verifyPaymentStatus = async () => {
      try {
        const res = await recruitmentAPI.getApplicationStatus(appId);
        const appData = res.data;

        if (appData.payment_status === 'PAID' || appData.payment_status === 'COMPLETED') {
          setApplication(appData);
          setStatus('SUCCESS');
          clearInterval(pollRef.current);
          localStorage.removeItem('pending_app_id');
        } else if (appData.payment_status === 'FAILED') {
          setApplication(appData);
          setStatus('FAILED');
          clearInterval(pollRef.current);
          localStorage.removeItem('pending_app_id');
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            setStatus('TIMEOUT');
            clearInterval(pollRef.current);
          }
        }
      } catch (error) {
        console.error("Verification error:", error);
      }
    };

    verifyPaymentStatus();
    pollRef.current = setInterval(verifyPaymentStatus, 2000);

    return () => clearInterval(pollRef.current);
  }, [appId]);

  const handleDownloadPDF = async () => {
    if (!application) return;
    
    setDownloading(true);
    try {
      const response = await recruitmentAPI.downloadPdf(application.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DUITS_Receipt_${application.full_name.replace(' ', '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Receipt decrypted and downloaded!");
    } catch (error) {
      toast.error("Failed to extract PDF receipt.");
    } finally {
      setDownloading(false);
    }
  };

  if (status === 'NOT_FOUND') {
    return (
      <div className="relative min-h-[85vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 p-10 rounded-3xl text-center">
          <XCircle className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <h2 className="text-2xl font-black mb-3 text-slate-800 tracking-tight">Cache Miss</h2>
          <p className="text-slate-500 mb-8 font-medium text-sm">Session identifier invalid or expired.</p>
          <Link to="/" className="btn bg-slate-900 text-white border-none shadow-md w-full font-mono text-xs uppercase tracking-widest">Main Console</Link>
        </div>
      </div>
    );
  }

  if (status === 'VERIFYING') {
    return (
      <div className="relative min-h-[85vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 p-10 rounded-3xl text-center">
          <div className="relative inline-block mx-auto mb-8">
            <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-500 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-black mb-3 text-slate-800 tracking-tight uppercase">Synchronizing Ledger</h2>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest border border-slate-100 bg-slate-50 p-4 rounded-xl">
            Awaiting financial node confirmation.<br/>Do not interrupt protocol.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'FAILED' || status === 'TIMEOUT') {
    return (
      <div className="relative min-h-[85vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-xl border border-slate-200 p-10 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
          <div className="relative inline-block mx-auto mb-6">
            <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
              {status === 'TIMEOUT' ? <Clock className="w-12 h-12 text-red-500" /> : <XCircle className="w-12 h-12 text-red-500" />}
            </div>
          </div>
          <h2 className="text-2xl font-black mb-3 text-slate-800 tracking-tight uppercase">
            {status === 'TIMEOUT' ? 'Sync Timeout' : 'Transfer Failed'}
          </h2>
          <p className="text-slate-500 mb-8 font-medium text-sm">
            {status === 'TIMEOUT' 
              ? "Unable to confirm state. If funds were debited, contact admin."
              : "Financial vector rejected. Try a different authorization node."}
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/recruitment" className="btn bg-slate-900 text-white w-full font-mono text-xs uppercase tracking-widest shadow-lg">Retry Sequence</Link>
            <Link to="/contact" className="btn bg-white border-slate-200 text-slate-600 w-full font-mono text-xs uppercase tracking-widest">Support Comms</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-200/50 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative w-full max-w-xl bg-white/90 backdrop-blur-xl shadow-2xl border border-slate-200 overflow-hidden rounded-3xl z-10">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-400"></div>
        
        {/* Success Header */}
        <div className="bg-slate-900 text-white text-center py-10 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-green-400/30">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full animate-ping"></div>
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">Clearance Granted</h1>
          <p className="font-mono text-xs text-green-400 uppercase tracking-widest font-bold">Ledger successfully synchronized</p>
        </div>

        <div className="p-8 md:p-10 space-y-8">
          {/* Data Output Block */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-inner">
            <div className="font-mono text-[10px] text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Transaction Details</div>
            <div className="space-y-4">
              {[
                { label: "Entity Alias", value: application?.full_name },
                { label: "App Index", value: `#${application?.id}`, mono: true },
                { label: "Hash ID", value: urlTrxId || application?.transaction_id || 'N/A', mono: true },
                { label: "State Code", value: "AUTHORIZED", badge: true },
                { label: "Block Time", value: new Date().toLocaleString(), mono: true }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-slate-500 font-mono text-xs uppercase tracking-widest font-bold">{item.label}</span>
                  <span className={`${item.badge ? 'inline-flex px-3 py-1 bg-green-100 text-green-700 font-black text-[10px] uppercase tracking-widest border border-green-200 rounded' : item.mono ? 'font-mono text-xs font-bold text-slate-800 bg-white px-2 py-1 border border-slate-100 rounded' : 'font-bold text-sm text-slate-800'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleDownloadPDF} 
            disabled={downloading}
            className="group relative flex items-center justify-center gap-3 bg-slate-900 hover:bg-green-600 text-white font-bold h-14 w-full rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
          >
            {downloading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <Download className="w-4 h-4 relative z-10 group-hover:-translate-y-1 transition-transform" />
                <span className="font-mono text-xs uppercase tracking-widest relative z-10">Extract PDF Log</span>
              </>
            )}
          </button>
          
          <p className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400">
            Internal cache updated. Retain log for system checks.
          </p>
        </div>

        <div className="bg-slate-100 border-t border-slate-200 p-6 flex flex-col sm:flex-row gap-4">
          <Link to="/" className="btn bg-white border-slate-200 text-slate-600 hover:bg-slate-50 flex-1 rounded-xl font-mono text-xs uppercase tracking-widest shadow-sm">
            <Terminal className="w-4 h-4 mr-2" /> Main
          </Link>
          <Link to="/profile" className="btn bg-white border-slate-200 text-blue-600 hover:border-blue-300 hover:bg-blue-50 flex-1 rounded-xl font-mono text-xs uppercase tracking-widest shadow-sm">
            <User className="w-4 h-4 mr-2" /> Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;