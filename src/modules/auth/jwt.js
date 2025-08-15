import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const ACCESS_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export function signAccessToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, type: 'access' }, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
}

export function verifyAccessToken(token) {
  const payload = jwt.verify(token, JWT_SECRET);
  if (payload.type !== 'access') throw new Error('Not access token');
  return payload;
}

export function verifyRefreshToken(token) {
  const payload = jwt.verify(token, JWT_SECRET);
  if (payload.type !== 'refresh') throw new Error('Not refresh token');
  return payload;
}
