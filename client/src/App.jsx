import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Jobs from './pages/Jobs';

// Temporary placeholder for routes we will build next
const PlaceholderPage = ({ title }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-[#FAFAFA]">
    <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-md shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{title} Page</h2>
      <p className="text-sm text-slate-500 mb-6">
        This page component will be built in our very next step!
      </p>
      <a
        href="/"
        className="inline-flex px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-black transition-colors"
      >
        Return to Home
      </a>
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans antialiased text-slate-900 selection:bg-blue-600 selection:text-white">
          {/* Global Toast Alerts */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#0F172A',
                color: '#FFFFFF',
                borderRadius: '16px',
                fontSize: '14px',
                padding: '12px 20px',
              },
            }}
          />

          {/* Sticky Slayed Navbar */}
          <Navbar />

          {/* Main Page Content */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<PlaceholderPage title="Job Details & Application" />} />
              <Route path="/login" element={<PlaceholderPage title="User Login" />} />
              <Route path="/register" element={<PlaceholderPage title="User Registration" />} />
              <Route path="/seeker/dashboard" element={<PlaceholderPage title="Seeker Dashboard" />} />
              <Route path="/employer/dashboard" element={<PlaceholderPage title="Employer Dashboard" />} />
            </Routes>
          </main>

          {/* Minimalist Footer */}
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}
