import { userStore } from './user.store.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from './jwt.js';
import { hashPassword, verifyPassword } from './password.js';
import { loginSchema, registerSchema } from './auth.schemas.js';

function setTokens(res, accessToken, refreshToken) {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 15 * 60 * 1000
  });
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export async function registerHandler(req, res) {
  try {
    const parsed = registerSchema.parse(req.body);
    const existing = userStore.findByEmail(parsed.email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const passwordHash = await hashPassword(parsed.password);
    const user = userStore.create({ email: parsed.email, passwordHash });
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    setTokens(res, accessToken, refreshToken);
    res.status(201).json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    if (err.errors) {
      return res.status(400).json({ message: 'Validation failed', errors: err.errors });
    }
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function loginHandler(req, res) {
  try {
    const parsed = loginSchema.parse(req.body);
    const user = userStore.findByEmail(parsed.email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await verifyPassword(parsed.password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    setTokens(res, accessToken, refreshToken);
    res.json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    if (err.errors) {
      return res.status(400).json({ message: 'Validation failed', errors: err.errors });
    }
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function refreshHandler(req, res) {
  try {
    const token = req.cookies.refresh_token || req.body.refresh_token;
    if (!token) return res.status(401).json({ message: 'Missing refresh token' });
    const payload = verifyRefreshToken(token);
    const user = userStore.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'User not found' });
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    setTokens(res, accessToken, refreshToken);
    res.json({ user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
}

export async function meHandler(req, res) {
  const user = req.user;
  res.json({ user: { id: user.id, email: user.email } });
}

export async function logoutHandler(req, res) {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token', { path: '/auth/refresh' });
  res.json({ message: 'Logged out' });
}
