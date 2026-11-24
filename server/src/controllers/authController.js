import { User } from '../models/User.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';

/**
 * @desc    নতুন ইউজার রেজিস্ট্রেশন
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ১. ভ্যালিডেশন
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    // ২. ইমেইল অলরেডি আছে কি না চেক করা
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email address.'
      });
    }

    // ৩. নতুন ইউজার তৈরি
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role === 'employer' ? 'employer' : 'seeker'
    });

    // ৪. টোকেন জেনারেট ও কুকিতে পাঠানো
    const token = generateTokenAndSetCookie(res, user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        company: user.company
      },
      token
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while registering user.'
    });
  }
};

/**
 * @desc    ইউজার লগইন
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ১. ফিল্ড চেক
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // ২. ইউজারকে খোঁজা
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // ৩. পাসওয়ার্ড ম্যাচ করা
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // ৪. টোকেন সেট করা
    const token = generateTokenAndSetCookie(res, user);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        company: user.company
      },
      token
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while logging in.'
    });
  }
};

/**
 * @desc    ইউজার লগআউট (কুকি ক্লিয়ার)
 * @route   POST /api/v1/auth/logout
 * @access  Public
 */
export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};

/**
 * @desc    লগইন করা ইউজারের প্রোফাইল ডাটা পাওয়া
 * @route   GET /api/v1/auth/me
 * @access  Protected
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
