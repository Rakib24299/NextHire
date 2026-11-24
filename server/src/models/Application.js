import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    // কোন চাকরিতে আবেদন করা হয়েছে (Job মডেলের সাথে রেফারেন্স)
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
      index: true
    },
    // কে আবেদন করেছে (User - Seeker মডেলের সাথে রেফারেন্স)
    seekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seeker ID is required'],
      index: true
    },
    // চাকরির মালিক বা কোম্পানি কে (User - Employer মডেলের সাথে রেফারেন্স)
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employer ID is required'],
      index: true
    },
    // আপলোড করা PDF রেজুমের লিংক
    resumeUrl: {
      type: String,
      required: [true, 'Resume URL is required']
    },
    // সংক্ষিপ্ত মেসেজ বা কভার নোট
    coverNote: {
      type: String,
      maxlength: [1000, 'Cover note cannot exceed 1000 characters'],
      default: ''
    },
    // আবেদনের বর্তমান স্ট্যাটাস
    status: {
      type: String,
      enum: {
        values: ['pending', 'reviewing', 'shortlisted', 'rejected'],
        message: 'Status must be pending, reviewing, shortlisted, or rejected'
      },
      default: 'pending'
    }
  },
  { timestamps: true }
);

// একজন প্রার্থী যাতে একই চাকরিতে একাধিকবার আবেদন করতে না পারে (ডুপ্লিকেট অ্যাপ্লিকেশন রোধ)
applicationSchema.index({ jobId: 1, seekerId: 1 }, { unique: true });

export const Application = mongoose.model('Application', applicationSchema);
