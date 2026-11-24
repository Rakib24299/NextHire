import jwt from 'jsonwebtoken';

/**
 * লগইন করা ইউজার কি না ভেরিফাই করার মিডলওয়্যার
 */
export const protect = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    // কুকিতে না থাকলে Authorization হেডারে চেক করা (Bearer <token>)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized! Please log in to access this resource.'
      });
    }

    // টোকেন ডিকোড ও ভেরিফাই
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: '...', role: 'seeker'|'employer' }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token! Please log in again.'
    });
  }
};

/**
 * নির্দিষ্ট রোল চেক করার মিডলওয়্যার (যেমন: শুধু 'employer' চাকরি পোস্ট করতে পারবে)
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: Role '${req.user.role}' is not authorized to perform this action!`
      });
    }
    next();
  };
};
