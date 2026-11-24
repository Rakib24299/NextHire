import mongoose from 'mongoose';

const savedJobSchema = new mongoose.Schema(
  {
    // কোন প্রার্থী চাকরিটি সেভ করেছে
    seekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seeker ID is required'],
      index: true
    },
    // কোন চাকরিটি সেভ করেছে
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
      index: true
    }
  },
  { timestamps: true }
);

// একজন প্রার্থী যাতে একই চাকরি দুইবার বুকমার্ক করতে না পারে
savedJobSchema.index({ seekerId: 1, jobId: 1 }, { unique: true });

export const SavedJob = mongoose.model('SavedJob', savedJobSchema);
