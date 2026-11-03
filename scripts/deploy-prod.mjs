import { spawnSync } from 'node:child_process';

const env = {
  ...process.env,
  EXPO_PUBLIC_API_URL: 'https://api.nacal.app',
  EXPO_PUBLIC_COGNITO_CLIENT_ID: '10eu9vlu592skl8qjp7pjgle9d',
  EXPO_PUBLIC_COGNITO_DOMAIN: 'https://nacal.auth.sa-east-1.amazoncognito.com',
  EXPO_PUBLIC_WEB_URL: 'https://app.nacal.app',
};

function run(command, args) {
  const result = spawnSync(command, args, { env, stdio: 'inherit' });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('node', ['scripts/check-web-env.mjs']);
run('yarn', ['export:web', '--clear']);
run('npx', ['wrangler', 'deploy']);
