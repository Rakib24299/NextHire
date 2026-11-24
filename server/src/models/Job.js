import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    // কোন চাকরিদাতা এই চাকরিটি পোস্ট করেছে (User মডেলের সাথে রেফারেন্স)
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employer ID is required'],
      index: true
    },
    // চাকরির পদবি
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    // বিস্তারিত বিবরণ
    description: {
      type: String,
      required: [true, 'Job description is required']
    },
    // কোম্পানির নাম ও লোগো
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    companyLogo: {
      type: String,
      default: ''
    },
    // কাজের লোকেশন (যেমন: Dhaka, Bangladesh)
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true
    },
    // কর্মক্ষেত্রের ধরন: onsite, remote, নাকি hybrid
    workplaceType: {
      type: String,
      enum: {
        values: ['onsite', 'remote', 'hybrid'],
        message: 'Workplace type must be onsite, remote, or hybrid'
      },
      default: 'onsite'
    },
    // চাকরির ক্যাটাগরি: full-time, part-time, internship, contract
    jobType: {
      type: String,
      enum: {
        values: ['full-time', 'part-time', 'internship', 'contract'],
        message: 'Job type must be full-time, part-time, internship, or contract'
      },
      required: [true, 'Job type is required']
    },
    // অভিজ্ঞতার স্তর: fresher, junior, mid
    experienceLevel: {
      type: String,
      enum: {
        values: ['fresher', 'junior', 'mid'],
        message: 'Experience level must be fresher, junior, or mid'
      },
      default: 'fresher'
    },
    // স্যালারি তথ্য
    salary: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: 'BDT' },
      isNegotiable: { type: Boolean, default: false }
    },
    // প্রয়োজনীয় স্কিলস (যেমন: ['React', 'Node.js', 'MongoDB'])
    skillsRequired: [
      {
        type: String,
        trim: true
      }
    ],
    // চাকরির বর্তমান অবস্থা: active নাকি closed
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active'
    },
    // সর্বমোট কতজন আবেদন করেছে তার কাউন্টার
    applicationCount: {
      type: Number,
      default: 0
    },
    // আবেদনের শেষ তারিখ
    deadline: {
      type: Date
    }
  },
  { timestamps: true }
);

// কি-ওয়ার্ড দিয়ে দ্রুত ফুল-টেক্সট সার্চ করার জন্য ইনডেক্সিং
jobSchema.index({ title: 'text', companyName: 'text', skillsRequired: 'text' });

// স্ট্যাটাস ও সময় অনুযায়ী দ্রুত ফিল্টারিং করার জন্য ইনডেক্সিং
jobSchema.index({ status: 1, createdAt: -1 });

export const Job = mongoose.model('Job', jobSchema);
