// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'node src/server.js',
    port: 3000,
    timeout: 10_000,
    reuseExistingServer: true,
    env: { PORT: '3000' }
  }
});
