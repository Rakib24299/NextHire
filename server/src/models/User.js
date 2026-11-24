import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false 
    },
    role: {
      type: String,
      enum: {
        values: ['seeker', 'employer', 'admin'],
        message: 'Role must be either seeker or employer'
      },
      default: 'seeker'
    },
    // ক্যান্ডিডেটের জন্য প্রোফাইল তথ্য
    profile: {
      avatar: { type: String, default: '' },
      headline: { type: String, default: '' },
      bio: { type: String, default: '' },
      phone: { type: String, default: '' },
      resumeUrl: { type: String, default: '' },
      skills: [{ type: String, trim: true }]
    },
    // চাকরিদাতার জন্য কোম্পানির তথ্য
    company: {
      name: { type: String, default: '' },
      logo: { type: String, default: '' },
      website: { type: String, default: '' },
      address: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

// পাসওয়ার্ড ডাটাবেজে সেভ হওয়ার ঠিক আগে অটোমেটিক হ্যাশ (Bcrypt) হবে
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// লগইন করার সময় পাসওয়ার্ড মেলানোর জন্য মেথড
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
