// Simple in-memory user store. Replace with DB integration later.
import crypto from 'crypto';

class UserStore {
  constructor() {
    this.users = new Map(); // id -> user
    this.byEmail = new Map(); // email -> id
  }

  create({ email, passwordHash }) {
    const id = crypto.randomUUID();
    const user = { id, email: email.toLowerCase(), passwordHash, createdAt: new Date().toISOString() };
    this.users.set(id, user);
    this.byEmail.set(user.email, id);
    return user;
  }

  findByEmail(email) {
    const id = this.byEmail.get(email.toLowerCase());
    return id ? this.users.get(id) : null;
  }

  findById(id) {
    return this.users.get(id) || null;
  }
}

export const userStore = new UserStore();
