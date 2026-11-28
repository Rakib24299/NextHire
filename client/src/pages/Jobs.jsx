import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  Briefcase,
  Building2,
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

const JOB_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'Full-Time', value: 'full-time' },
  { label: 'Part-Time', value: 'part-time' },
  { label: 'Internship', value: 'internship' },
  { label: 'Contract', value: 'contract' },
];

const WORKPLACE_TYPES = [
  { label: 'All Workplaces', value: '' },
  { label: 'Onsite', value: 'onsite' },
  { label: 'Remote', value: 'remote' },
  { label: 'Hybrid', value: 'hybrid' },
];

const EXPERIENCE_LEVELS = [
  { label: 'All Levels', value: '' },
  { label: 'Fresher', value: 'fresher' },
  { label: 'Junior', value: 'junior' },
  { label: 'Mid-Level', value: 'mid' },
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Salary: High to Low', value: 'salary_desc' },
  { label: 'Salary: Low to High', value: 'salary_asc' },
];

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get('search') || '';
  const urlLocation = searchParams.get('location') || '';
  const jobType = searchParams.get('jobType') || '';
  const workplaceType = searchParams.get('workplaceType') || '';
  const experienceLevel = searchParams.get('experienceLevel') || '';
  const sort = searchParams.get('sort') || 'newest';
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadTick, setReloadTick] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (urlSearch) params.set('search', urlSearch);
    if (urlLocation) params.set('location', urlLocation);
    if (jobType) params.set('jobType', jobType);
    if (workplaceType) params.set('workplaceType', workplaceType);
    if (experienceLevel) params.set('experienceLevel', experienceLevel);
    if (sort) params.set('sort', sort);
    params.set('page', String(currentPage));
    params.set('limit', '8');
    return params.toString();
  }, [urlSearch, urlLocation, jobType, workplaceType, experienceLevel, sort, currentPage]);

  useEffect(() => {
    let cancelled = false;

    const loadJobs = async () => {
      try {
        const res = await api.get(`/jobs?${buildQueryString()}`);
        if (!cancelled && res.data.success) {
          setJobs(res.data.data || []);
          setTotalJobs(res.data.totalJobs || 0);
          setTotalPages(res.data.totalPages || 1);
          setError('');
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        if (!cancelled) {
          setError(err.response?.data?.message || 'Failed to load jobs. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadJobs();
    return () => {
      cancelled = true;
    };
  }, [buildQueryString, reloadTick]);

  // Update a single URL query param and reset to page 1 (unless updating page itself)
  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    if (key !== 'page') {
      next.delete('page');
    }
    setLoading(true);
    setSearchParams(next);
  };

  // Handle top search bar submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nextSearch = String(formData.get('search') || '').trim();
    const nextLocation = String(formData.get('location') || '').trim();

    const next = new URLSearchParams(searchParams);
    if (nextSearch) next.set('search', nextSearch);
    else next.delete('search');

    if (nextLocation) next.set('location', nextLocation);
    else next.delete('location');

    next.delete('page');
    setLoading(true);
    setSearchParams(next);
  };

  // Reset all filters
  const handleClearFilters = () => {
    setLoading(true);
    setSearchParams({});
  };

  const handleRetry = () => {
    setLoading(true);
    setError('');
    setReloadTick((prev) => prev + 1);
  };

  const hasActiveFilters = Boolean(
    urlSearch || urlLocation || jobType || workplaceType || experienceLevel
  );

  return (
    <div className="bg-[#FAFAFA] min-h-screen text-slate-900">
      {/* Top Header & Search Bar */}
      <section className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-6">
            Find Your Next Role
          </h1>

          {/* Capsule Search Form */}
          <form
            key={`${urlSearch}-${urlLocation}`}
            onSubmit={handleSearchSubmit}
            className="bg-[#FAFAFA] p-2 sm:p-2.5 rounded-3xl sm:rounded-full border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center"
          >
            <div className="flex items-center gap-3 px-4 py-2 w-full sm:flex-1 border-b sm:border-b-0 sm:border-r border-slate-200/80">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                name="search"
                defaultValue={urlSearch}
                placeholder="Job title, company, or skill (e.g. React)..."
                className="w-full bg-transparent text-sm focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-2 w-full sm:flex-1">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                name="location"
                defaultValue={urlLocation}
                placeholder="City or Remote..."
                className="w-full bg-transparent text-sm focus:outline-none text-slate-800 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="flex items-center w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-none px-7 py-3 rounded-full bg-slate-900 hover:bg-blue-600 text-white text-sm font-semibold transition-colors shadow-sm cursor-pointer"
              >
                Search Jobs
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Main Content: Sidebar Filters + Job List (No Grid, No Gap) */}
      <section className="max-w-7xl mx-auto border-x border-slate-200 bg-white">
        <div className="flex flex-col lg:flex-row">
          {/* Left Sidebar Filters */}
          <aside
            className={`lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 ${
              mobileFiltersOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white p-6 sticky top-20 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-slate-700" />
                  <h2 className="font-bold text-slate-900 text-base">Filters</h2>
                </div>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  )}
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="lg:hidden p-1 rounded-full hover:bg-slate-100 text-slate-500"
                    aria-label="Close filters"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Filter Group: Job Type */}
              <div>
                <label
                  htmlFor="filter-job-type"
                  className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Job Type
                </label>
                <select
                  id="filter-job-type"
                  value={jobType}
                  onChange={(e) => updateFilter('jobType', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  {JOB_TYPES.map((item) => (
                    <option key={item.label} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Group: Workplace Type */}
              <div>
                <label
                  htmlFor="filter-workplace"
                  className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Workplace
                </label>
                <select
                  id="filter-workplace"
                  value={workplaceType}
                  onChange={(e) => updateFilter('workplaceType', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  {WORKPLACE_TYPES.map((item) => (
                    <option key={item.label} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Group: Experience Level */}
              <div>
                <label
                  htmlFor="filter-experience"
                  className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  Experience
                </label>
                <select
                  id="filter-experience"
                  value={experienceLevel}
                  onChange={(e) => updateFilter('experienceLevel', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  {EXPERIENCE_LEVELS.map((item) => (
                    <option key={item.label} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Right Panel: Results Header, Job List, Pagination */}
          <div className="flex-1">
            {/* Results Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-200">
              <p className="text-sm text-slate-600 font-medium">
                {loading ? (
                  'Searching opportunities...'
                ) : (
                  <>
                    Showing <span className="font-bold text-slate-900">{jobs.length}</span> of{' '}
                    <span className="font-bold text-slate-900">{totalJobs}</span> active jobs
                  </>
                )}
              </p>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort-jobs" className="text-xs font-semibold text-slate-500">
                  Sort by:
                </label>
                <select
                  id="sort-jobs"
                  value={sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="bg-white border border-slate-200 rounded-full px-4 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-slate-400 cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loading Skeleton */}
            {loading ? (
              <div className="flex flex-col divide-y divide-slate-200">
                {[...Array(6)].map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 h-48 animate-pulse flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-200" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3 bg-slate-200 rounded w-1/3" />
                        <div className="h-3 bg-slate-100 rounded w-1/4" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-full" />
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div className="h-4 bg-slate-200 rounded w-1/4" />
                      <div className="h-8 bg-slate-200 rounded-full w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              /* Error State */
              <div className="bg-white p-10 text-center">
                <p className="text-red-600 font-semibold mb-4">{error}</p>
                <button
                  onClick={handleRetry}
                  className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : jobs.length === 0 ? (
              /* Empty State */
              <div className="bg-white p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No matching jobs found</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  Try adjusting your search keywords, location, or clearing some active filters to see more results.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-blue-600 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              /* Jobs List (No Grid, No Gap) */
              <>
                <div className="flex flex-col">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="py-6 flex items-center justify-center gap-2 border-t border-slate-200">
                    <button
                      onClick={() => updateFilter('page', String(currentPage - 1))}
                      disabled={currentPage <= 1}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Prev
                    </button>

                    <div className="flex items-center gap-1.5">
                      {[...Array(totalPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        const active = pageNum === currentPage;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => updateFilter('page', String(pageNum))}
                            className={`w-9 h-9 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                              active
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => updateFilter('page', String(currentPage + 1))}
                      disabled={currentPage >= totalPages}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
