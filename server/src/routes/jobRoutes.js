import express from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  getMyPostedJobs,
  updateJob,
  deleteJob,
  toggleSaveJob,
  getMySavedJobs
} from '../controllers/jobController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ১. পাবলিক রুট: সব চাকরি দেখা (সার্চ, ফিল্টার ও পেজিনেশন)
router.get('/', getAllJobs);

// ২. ক্যান্ডিডেট রুট: সেভ করা চাকরি দেখা (/:id এর আগেই ডিক্লেয়ার করতে হবে)
router.get('/saved/all', protect, authorizeRoles('seeker'), getMySavedJobs);

// ৩. রিক্রুটার রুট: নিজের পোস্ট করা চাকরি দেখা (/:id এর আগেই ডিক্লেয়ার করতে হবে)
router.get('/my/posted-jobs', protect, authorizeRoles('employer', 'admin'), getMyPostedJobs);

// ৪. পাবলিক রুট: নির্দিষ্ট একটি চাকরির ডিটেইলস
router.get('/:id', getJobById);

// ৫. রিক্রুটার রুট: নতুন চাকরি পোস্ট করা
router.post('/', protect, authorizeRoles('employer', 'admin'), createJob);

// ৬. রিক্রুটার রুট: চাকরি এডিট করা
router.put('/:id', protect, authorizeRoles('employer', 'admin'), updateJob);

// ৭. রিক্রুটার রুট: চাকরি ডিলিট করা
router.delete('/:id', protect, authorizeRoles('employer', 'admin'), deleteJob);

// ৮. ক্যান্ডিডেট রুট: চাকরি সেভ/আনসেভ (বুকমার্ক) করা
router.post('/save/:id', protect, authorizeRoles('seeker'), toggleSaveJob);

export default router;
