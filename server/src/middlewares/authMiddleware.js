import { verifyToken } from '../utils/jwtUtils.js';

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    const user = verifyToken(token);
    if (!user || (roles.length && !roles.includes(user.role))) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.user = user;
    next();
  };
};

export default authMiddleware;
