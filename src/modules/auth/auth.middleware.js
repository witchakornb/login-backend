import { verifyAccessToken } from './jwt.js';
import { userStore } from './user.store.js';

export function authMiddleware(req, res, next) {
  const token = req.cookies.access_token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const payload = verifyAccessToken(token);
    const user = userStore.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
