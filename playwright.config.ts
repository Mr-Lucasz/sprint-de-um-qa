import { defineConfig, devices } from '@playwright/test';

// Configuração baseada na documentação oficial:
// https://playwright.dev/docs/test-configuration
// https://playwright.dev/docs/test-webserver
// https://playwright.dev/docs/test-projects

const PORTA = 3000;
const MODO = process.env.MODO ?? 'sprint';

export default defineConfig({
  testDir: './dia-2/extras/02-playwright/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: `http://localhost:${PORTA}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'api',
      testDir: './dia-2/extras/02-playwright/tests/api',
    },
    {
      name: 'e2e',
      testDir: './dia-2/extras/02-playwright/tests/e2e',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Sobe o app automaticamente antes dos testes
  webServer: {
    command: `node app/server.js --modo=${MODO} --porta=${PORTA}`,
    url: `http://localhost:${PORTA}/api/cursos`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
