import { Briefcase, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-slate-100">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-sm">
                <Briefcase className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex items-center">
                <span className="text-lg font-extrabold text-slate-900">Next</span>
                <span className="text-lg font-extrabold text-blue-600">Hire</span>
              </div>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Connecting emerging developers, fresh graduates, and modern companies through high-impact opportunities.
            </p>
          </div>

          {/* Candidates Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">For Candidates</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/jobs" className="hover:text-blue-600 transition-colors">Browse All Jobs</Link></li>
              <li><Link to="/jobs?jobType=internship" className="hover:text-blue-600 transition-colors">Internship Programs</Link></li>
              <li><Link to="/jobs?workplaceType=remote" className="hover:text-blue-600 transition-colors">Remote Opportunities</Link></li>
              <li><Link to="/register" className="hover:text-blue-600 transition-colors">Candidate Signup</Link></li>
            </ul>
          </div>

          {/* Employers Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">For Employers</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/register" className="hover:text-blue-600 transition-colors">Post an Opening</Link></li>
              <li><Link to="/login" className="hover:text-blue-600 transition-colors">Employer Login</Link></li>
              <li><Link to="/pricing" className="hover:text-blue-600 transition-colors">Hiring Pricing</Link></li>
              <li><Link to="/support" className="hover:text-blue-600 transition-colors">Recruiting Support</Link></li>
            </ul>
          </div>

          {/* Tech & Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Platform</h4>
            <p className="text-sm text-slate-500">
              Built with modern MERN Architecture, JWT Security, and Tailwind CSS.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} NextHire Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted for freshers & ambitious developers.
          </p>
        </div>
      </div>
    </footer>
  );
}
