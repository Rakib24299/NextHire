import jwt from 'jsonwebtoken';

/**
 * জেনারেট করবে JWT টোকেন এবং সিকিউর HTTP-Only কুকি হিসেবে সেট করবে
 */
export const generateTokenAndSetCookie = (res, user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  // ব্রাউজারে কুকি সেট করা
  res.cookie('token', token, {
    httpOnly: true, // XSS অ্যাটাক থেকে রক্ষা করে
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // ৭ দিন
  });

  return token;
};
