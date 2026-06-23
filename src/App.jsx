// src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';
// --- AUTHENTICATION PAGES ---
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import Activate from './pages/Activate';

// --- PUBLIC PAGES ---
import Home from './pages/Home';
import About from './pages/About';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Events from './pages/Events';
import Panel from './pages/Panel';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Recruitment from './pages/Recruitment';

// --- PAYMENT ROUTES ---
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFail from './pages/PaymentFail';
import PaymentCancel from './pages/PaymentCancel';

// --- PROTECTED PAGES (Members Only) ---
import Profile from './pages/Profile';
import MyArticles from './pages/MyArticles';
import SubmitArticle from './pages/SubmitArticle';

// --- ADMIN PAGES ---
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'duits_light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'duits_light' ? 'duits_dark' : 'duits_light');
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-base-100 text-base-content transition-colors duration-300 pt-16">
          <Navbar theme={theme} toggleTheme={toggleTheme} />

          <main className="flex-grow">
            <Routes>
              {/* ========================================== */}
              {/* PUBLIC ROUTES (Anyone can access) */}
              {/* ========================================== */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
              <Route path="/events" element={<Events />} />
              <Route path="/panel" element={<Panel />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/recruitment" element={<Recruitment />} />
                
              {/* ========================================== */}
              {/* PAYMENT OUTCOME ROUTES */}
              {/* ========================================== */}
              <Route path="/recruitment/success" element={<PaymentSuccess />} />
              <Route path="/recruitment/failed" element={<PaymentFail />} /> 
              <Route path="/recruitment/cancelled" element={<PaymentCancel />} />

              {/* ========================================== */}
              {/* AUTHENTICATION ROUTES */}
              {/* ========================================== */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/password-reset/:uid/:token" element={<ResetPasswordConfirm />} />
              <Route path="/activate/:uid/:token" element={<Activate />} />

              {/* ========================================== */}
              {/* PROTECTED ROUTES (Must be logged in) */}
              {/* ========================================== */}
              <Route path="/profile" element={ <ProtectedRoute><Profile /></ProtectedRoute> } />
              <Route path="/my-articles" element={ <ProtectedRoute><MyArticles /></ProtectedRoute> } />
              <Route path="/submit-article" element={ <ProtectedRoute><SubmitArticle /></ProtectedRoute> } />

              {/* ========================================== */}
              {/* ADMIN ONLY ROUTES */}
              {/* ========================================== */}
              <Route path="/admin/dashboard" element={ <AdminRoute><AdminDashboard /></AdminRoute> } />
              
            </Routes>
          </main>

          <Footer />
        </div>
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;