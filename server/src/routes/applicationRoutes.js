import express from 'express';
import {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ১. ক্যান্ডিডেট রুট: নির্দিষ্ট কোনো চাকরিতে আবেদন করা
router.post('/apply/:jobId', protect, authorizeRoles('seeker'), applyToJob);

// ২. ক্যান্ডিডেট রুট: নিজের সমস্ত আবেদনের তালিকা ও স্ট্যাটাস দেখা
router.get('/my-applications', protect, authorizeRoles('seeker'), getMyApplications);

// ৩. রিক্রুটার রুট: একটি নির্দিষ্ট চাকরির সব আবেদনকারীদের তালিকা দেখা
router.get('/job/:jobId', protect, authorizeRoles('employer', 'admin'), getJobApplicants);

// ৪. রিক্রুটার রুট: কোনো প্রার্থীর আবেদনের স্ট্যাটাস পরিবর্তন করা (Shortlisted/Rejected)
router.patch('/:applicationId/status', protect, authorizeRoles('employer', 'admin'), updateApplicationStatus);

export default router;
