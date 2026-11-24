import { Job } from '../models/Job.js';
import { SavedJob } from '../models/SavedJob.js';

/**
 * @desc    নতুন চাকরি পোস্ট করা
 * @route   POST /api/v1/jobs
 * @access  Protected (Only Employer)
 */
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      companyName,
      companyLogo,
      location,
      workplaceType,
      jobType,
      experienceLevel,
      salary,
      skillsRequired,
      deadline
    } = req.body;

    // ১. প্রয়োজনীয় ফিল্ড ভ্যালিডেশন
    if (!title || !description || !companyName || !location || !jobType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, companyName, location, and jobType.'
      });
    }

    // ২. নতুন চাকরি তৈরি (লগইন থাকা ইউজারকে employerId হিসেবে সেট করা)
    const job = await Job.create({
      employerId: req.user.id,
      title,
      description,
      companyName,
      companyLogo: companyLogo || '',
      location,
      workplaceType: workplaceType || 'onsite',
      jobType,
      experienceLevel: experienceLevel || 'fresher',
      salary: salary || { min: 0, max: 0, currency: 'BDT', isNegotiable: false },
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
      deadline: deadline ? new Date(deadline) : null
    });

    res.status(201).json({
      success: true,
      message: 'Job posted successfully.',
      data: job
    });
  } catch (error) {
    console.error('Create Job Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating job post.'
    });
  }
};

/**
 * @desc    সব চাকরি দেখা (সার্চ, ফিল্টার এবং পেজিনেশন সহ)
 * @route   GET /api/v1/jobs
 * @access  Public
 */
export const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      jobType,
      workplaceType,
      experienceLevel,
      location,
      page = 1,
      limit = 10,
      sort = 'newest'
    } = req.query;

    // ফিল্টার অবজেক্ট তৈরি
    const query = { status: 'active' };

    // ১. কি-ওয়ার্ড সার্চ (টাইটেল, কোম্পানি অথবা স্কিল দিয়ে)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { skillsRequired: { $regex: search, $options: 'i' } }
      ];
    }

    // ২. স্পেসিফিক ফিল্টারিং
    if (jobType) {
      query.jobType = jobType;
    }
    if (workplaceType) {
      query.workplaceType = workplaceType;
    }
    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // ৩. সর্টিং অপশন
    let sortOptions = { createdAt: -1 }; // ডিফল্ট: একদম নতুনগুলো আগে
    if (sort === 'salary_desc') {
      sortOptions = { 'salary.max': -1 };
    } else if (sort === 'salary_asc') {
      sortOptions = { 'salary.min': 1 };
    }

    // ৪. পেজিনেশন হিসাব
    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('employerId', 'name email company')
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      totalJobs,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalJobs / pageSize),
      data: jobs
    });
  } catch (error) {
    console.error('Get All Jobs Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching jobs.'
    });
  }
};

/**
 * @desc    নির্দিষ্ট একটি চাকরির বিস্তারিত দেখা
 * @route   GET /api/v1/jobs/:id
 * @access  Public
 */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employerId', 'name email company');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job opening not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Get Job By ID Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching job details.'
    });
  }
};

/**
 * @desc    চাকরিদাতা তার নিজের পোস্ট করা চাকরিগুলো দেখা
 * @route   GET /api/v1/jobs/my/posted-jobs
 * @access  Protected (Only Employer)
 */
export const getMyPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: jobs.length,
      data: jobs
    });
  } catch (error) {
    console.error('Get My Jobs Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching your jobs.'
    });
  }
};

/**
 * @desc    চাকরি এডিট/আপডেট করা
 * @route   PUT /api/v1/jobs/:id
 * @access  Protected (Only Owner Employer)
 */
export const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job post not found.'
      });
    }

    // ভেরিফাই করা: যে পোস্ট করেছে শুধু সে-ই এডিট করতে পারবে
    if (job.employerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to update this job post.'
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Job updated successfully.',
      data: job
    });
  } catch (error) {
    console.error('Update Job Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating job.'
    });
  }
};

/**
 * @desc    চাকরি ডিলিট করা
 * @route   DELETE /api/v1/jobs/:id
 * @access  Protected (Only Owner Employer)
 */
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job post not found.'
      });
    }

    // ভেরিফাই করা: যে পোস্ট করেছে শুধু সে-ই ডিলিট করতে পারবে
    if (job.employerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to delete this job post.'
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully.'
    });
  } catch (error) {
    console.error('Delete Job Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while deleting job.'
    });
  }
};

/**
 * @desc    চাকরি সেভ/বুকমার্ক করা
 * @route   POST /api/v1/jobs/save/:id
 * @access  Protected (Seeker Only)
 */
export const toggleSaveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const seekerId = req.user.id;

    const existingSave = await SavedJob.findOne({ seekerId, jobId });

    if (existingSave) {
      await existingSave.deleteOne();
      return res.status(200).json({
        success: true,
        message: 'Job removed from saved list.'
      });
    }

    await SavedJob.create({ seekerId, jobId });
    res.status(201).json({
      success: true,
      message: 'Job saved successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while saving job.'
    });
  }
};

/**
 * @desc    প্রার্থী তার সেভ করা চাকরির তালিকা দেখা
 * @route   GET /api/v1/jobs/saved/all
 * @access  Protected (Seeker Only)
 */
export const getMySavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ seekerId: req.user.id })
      .populate('jobId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: savedJobs.length,
      data: savedJobs.map(item => item.jobId)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching saved jobs.'
    });
  }
};
