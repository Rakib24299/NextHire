import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import {
  Search,
  MapPin,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function Home() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ব্যাকএন্ড থেকে লেটেস্ট ৬টি চাকরি লোড করা
  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/jobs?limit=6');
        if (res.data.success) {
          setJobs(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load featured jobs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  // সার্চ সাবমিট হ্যান্ডলার
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    if (location.trim()) params.append('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-slate-900">
      {/* ============================================================== */}
      {/* HERO SECTION                                                   */}
      {/* ============================================================== */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-b border-slate-200">
        {/* Big Bold Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1] mb-4">
          Where Ambition Meets{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500">
            Opportunity.
          </span>
        </h1>

        <p
          style={{ fontFamily: "'Gruppo', sans-serif" }}
          className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-8 font-normal leading-relaxed"
        >
          NextHire connects emerging developers, fresh graduates, and ambitious companies with transparent, real-time hiring.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="max-w-4xl mx-auto bg-white p-2 sm:p-2.5 rounded-3xl sm:rounded-full border border-slate-200/90 shadow-lg flex flex-col sm:flex-row items-center"
        >
          {/* Keyword Search */}
          <div className="flex items-center gap-3 px-4 py-2 w-full sm:flex-1 border-b sm:border-b-0 sm:border-r border-slate-200">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Job title, keywords, or skills..."
              className="w-full bg-transparent text-sm focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Location Search */}
          <div className="flex items-center gap-3 px-4 py-2 w-full sm:flex-1">
            <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, country, or 'Remote'"
              className="w-full bg-transparent text-sm focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-black text-white text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Search Jobs</span>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Popular Tags / Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">Popular:</span>
          {['MERN Stack', 'React Developer', 'Frontend Intern', 'Node.js', 'Remote', 'Fresher Friendly'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
              className="text-xs font-medium px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* STATS & SOCIAL PROOF BAR                                       */}
      {/* ============================================================== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-200 text-center">
          <div className="flex-1 py-6 px-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">500+</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Active Tech Roles</p>
          </div>
          <div className="flex-1 py-6 px-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">100%</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Status Transparency</p>
          </div>
          <div className="flex-1 py-6 px-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">&lt; 24h</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Average Response</p>
          </div>
          <div className="flex-1 py-6 px-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">150+</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Hiring Startups</p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* FEATURED JOBS SECTION (Live Backend List - No Grid / No Gap)   */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto border-x border-b border-slate-200 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-6 sm:p-8 border-b border-slate-200">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Featured Jobs
          </h2>

          <Link
            to="/jobs"
            className="mt-3 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors group"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="flex flex-col divide-y divide-slate-200">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white p-6 h-44 animate-pulse">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl mb-4"></div>
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-14 bg-white p-8">
            <p className="text-base font-semibold text-slate-700">No open jobs found right now.</p>
            <p className="text-xs text-slate-400 mt-1 mb-6">Be the first company to post an opening!</p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold"
            >
              Post a Job Opening
            </Link>
          </div>
        )}

        {/* Live Job Cards List (No Grid, No Gap) */}
        {!loading && jobs.length > 0 && (
          <div className="flex flex-col">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* WHY NEXTHIRE SECTION (Flush Cards, No Grid, No Gap)            */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto bg-white border-x border-b border-slate-200">
        <div className="text-center py-8 px-4 border-b border-slate-200">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why NextHire
          </h2>
        </div>

        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Feature 1 */}
          <div className="flex-1 bg-slate-50 p-6 sm:p-8 hover:bg-slate-100/60 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">Real-Time Status</h3>
            <p className="text-sm text-slate-600">
              Track when your application is reviewed or shortlisted.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex-1 bg-slate-50 p-6 sm:p-8 hover:bg-slate-100/60 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">Direct Hiring</h3>
            <p className="text-sm text-slate-600">
              Jobs posted directly by verified teams and startups.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex-1 bg-slate-50 p-6 sm:p-8 hover:bg-slate-100/60 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">Fast PDF Apply</h3>
            <p className="text-sm text-slate-600">
              Apply in seconds with your resume link and cover note.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* CALL TO ACTION (CTA BANNER - Flush, No Gap)                    */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto">
        <div className="bg-slate-900 p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-6">
              Ready to Hire or Get Hired?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Post Your Job Opening</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/jobs"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all border border-slate-700"
              >
                Explore Openings
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
