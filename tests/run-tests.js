import assert from 'assert';
import http from 'http';
// Ensure test environment before importing app
process.env.NODE_ENV = 'test';
const { app } = await import('../src/server.js');

async function request(method, path, body, cookies) {
  const data = body ? JSON.stringify(body) : null;
  return new Promise((resolve, reject) => {
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': data ? Buffer.byteLength(data) : 0
    };
    if (cookies && cookies.length) headers['Cookie'] = cookies.join('; ');
    const req = http.request({
      hostname: 'localhost',
      port: server.address().port,
      path,
      method,
      headers
    }, (res) => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        const setCookie = res.headers['set-cookie'] || [];
        resolve({ status: res.statusCode, body: raw ? JSON.parse(raw) : null, cookies: setCookie });
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

const server = app.listen(0);

(async () => {
  try {
    // Register
    const reg = await request('POST', '/auth/register', { email: 'test@example.com', password: 'secret123' });
    assert.equal(reg.status, 201, 'register status');
    assert.ok(reg.body.user.id, 'user id exists');
    const cookies = reg.cookies.map(c => c.split(';')[0]);

    // Me
    const me = await request('GET', '/auth/me', null, cookies);
    assert.equal(me.status, 200);
    assert.equal(me.body.user.email, 'test@example.com');

    // Logout
    const logout = await request('POST', '/auth/logout', null, cookies);
    assert.equal(logout.status, 200);

    // Login
  const login = await request('POST', '/auth/login', { email: 'test@example.com', password: 'secret123' });
  assert.equal(login.status, 200);

  console.log('All tests passed');
  server.close(() => process.exit(0));
  } catch (e) {
    console.error('Test failed', e);
    server.close();
    process.exit(1);
  }
})();
