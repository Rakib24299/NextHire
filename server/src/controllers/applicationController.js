import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';

/**
 * @desc    চাকরিতে আবেদন করা
 * @route   POST /api/v1/applications/apply/:jobId
 * @access  Protected (Seeker Only)
 */
export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { resumeUrl, coverNote } = req.body;
    const seekerId = req.user.id;

    // ১. রেজুমে লিংক চেক
    if (!resumeUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid resume URL or PDF link.'
      });
    }

    // ২. চাকরিটি ডাটাবেজে আছে কি না এবং একটিভ কি না
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'The job you are applying for does not exist.'
      });
    }

    if (job.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Applications for this job opening are now closed.'
      });
    }

    // ৩. পূর্বে আবেদন করা হয়েছে কি না চেক (ডুপ্লিকেট প্রতিরোধ)
    const existingApplication = await Application.findOne({ jobId, seekerId });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this job opening.'
      });
    }

    // ৪. আবেদন তৈরি করা
    const application = await Application.create({
      jobId,
      seekerId,
      employerId: job.employerId,
      resumeUrl,
      coverNote: coverNote || '',
      status: 'pending'
    });

    // ৫. জবের কাউন্টার ১ বাড়ানো
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      data: application
    });
  } catch (error) {
    console.error('Apply Job Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while submitting application.'
    });
  }
};

/**
 * @desc    প্রার্থী তার করা সমস্ত আবেদন এবং স্ট্যাটাস দেখা
 * @route   GET /api/v1/applications/my-applications
 * @access  Protected (Seeker Only)
 */
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ seekerId: req.user.id })
      .populate('jobId', 'title companyName companyLogo location jobType salary status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Get My Applications Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching your applications.'
    });
  }
};

/**
 * @desc    চাকরিদাতা একটি নির্দিষ্ট চাকরির আবেদনকারী প্রার্থীদের তালিকা দেখা
 * @route   GET /api/v1/applications/job/:jobId
 * @access  Protected (Only Job Owner Employer)
 */
export const getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    // ১. চাকরিটি খোঁজা এবং নিয়োগদাতা ভেরিফাই করা
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job opening not found.'
      });
    }

    if (job.employerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view applicants for your own job posts.'
      });
    }

    // ২. প্রপেলার ক্যান্ডিডেটদের লিস্ট
    const applicants = await Application.find({ jobId })
      .populate('seekerId', 'name email profile')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: applicants.length,
      jobTitle: job.title,
      data: applicants
    });
  } catch (error) {
    console.error('Get Job Applicants Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching applicants.'
    });
  }
};

/**
 * @desc    চাকরিদাতা কোনো প্রার্থীর আবেদনের স্ট্যাটাস পরিবর্তন করা
 * @route   PATCH /api/v1/applications/:applicationId/status
 * @access  Protected (Only Job Owner Employer)
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'reviewing', 'shortlisted', 'rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application record not found.'
      });
    }

    // ভেরিফাই করা: যে পোস্ট করেছে শুধু সে-ই স্ট্যাটাস আপডেট করতে পারবে
    if (application.employerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot update candidate status for other companies.'
      });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: `Candidate status updated to ${status}.`,
      data: application
    });
  } catch (error) {
    console.error('Update Application Status Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating application status.'
    });
  }
};
