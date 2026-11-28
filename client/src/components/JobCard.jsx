import { Link } from 'react-router-dom';
import { MapPin, ArrowUpRight } from 'lucide-react';

export default function JobCard({ job }) {
  if (!job) return null;

  // স্যালারি ফরম্যাটিং
  const formatSalary = () => {
    if (job.salary?.isNegotiable) return 'Negotiable';
    if (job.salary?.min || job.salary?.max) {
      const min = job.salary.min ? Number(job.salary.min).toLocaleString() : '';
      const max = job.salary.max ? Number(job.salary.max).toLocaleString() : '';
      const currency = job.salary.currency || 'BDT';
      if (min && max) return `${min} - ${max} ${currency}`;
      if (min) return `From ${min} ${currency}`;
      if (max) return `Up to ${max} ${currency}`;
    }
    return 'Competitive';
  };

  // কোম্পানি নামের আদ্যক্ষর (Fallback Avatar)
  const companyInitial = job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C';

  return (
    <div className="group relative bg-white border-b border-slate-200 hover:bg-slate-50/80 p-6 transition-colors duration-200 flex flex-col justify-between">
      
      <div>
        {/* Top Header: Company Avatar & Meta */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-lg shadow-inner group-hover:scale-105 transition-transform duration-200">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                companyInitial
              )}
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                {job.companyName}
              </h4>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{job.location}</span>
              </p>
            </div>
          </div>

          {/* Workplace Badge */}
          <span className="capitalize text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
            {job.workplaceType || 'Onsite'}
          </span>
        </div>

        {/* Job Title & Snippet */}
        <Link to={`/jobs/${job._id}`} className="block">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
            {job.title}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {job.description}
          </p>
        </Link>

        {/* Capsule Tag Badges */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          <span className="capitalize text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/50">
            {job.jobType}
          </span>
          <span className="capitalize text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50">
            {job.experienceLevel || 'Fresher'}
          </span>
          {job.skillsRequired?.slice(0, 2).map((skill, idx) => (
            <span key={idx} className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Footer: Salary & Action Button */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Salary</p>
          <p className="text-xs font-bold text-slate-800">{formatSalary()}</p>
        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 group-hover:bg-blue-600 text-white text-xs font-semibold transition-all duration-200 shadow-sm"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
