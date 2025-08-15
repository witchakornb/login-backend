import { test, expect, request } from '@playwright/test';

// Helper to extract cookie value by name
function getCookie(cookies, name) {
  const c = cookies.find(c => c.name === name);
  return c ? c.value : undefined;
}

test.describe('Auth Flow', () => {
  test('register -> me -> logout -> login -> refresh', async ({ baseURL }) => {
    const api = await request.newContext();

    // Register
    const regRes = await api.post(`${baseURL}/auth/register`, {
      data: { email: 'e2e@example.com', password: 'secret123' }
    });
    expect(regRes.status()).toBe(201);
    const regJson = await regRes.json();
    expect(regJson.user.email).toBe('e2e@example.com');
    let cookies = await api.storageState();

    // Me
    const meRes = await api.get(`${baseURL}/auth/me`);
    expect(meRes.status()).toBe(200);
    const meJson = await meRes.json();
    expect(meJson.user.email).toBe('e2e@example.com');

    // Logout
    const logoutRes = await api.post(`${baseURL}/auth/logout`);
    expect(logoutRes.status()).toBe(200);

    // Login again
    const loginRes = await api.post(`${baseURL}/auth/login`, {
      data: { email: 'e2e@example.com', password: 'secret123' }
    });
    expect(loginRes.status()).toBe(200);

    // Refresh
    const refreshRes = await api.post(`${baseURL}/auth/refresh`);
    expect(refreshRes.status()).toBe(200);
  });
});
