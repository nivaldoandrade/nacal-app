import process from 'node:process';

const requiredVariables = [
  'EXPO_PUBLIC_API_URL',
  'EXPO_PUBLIC_COGNITO_DOMAIN',
  'EXPO_PUBLIC_COGNITO_CLIENT_ID',
  'EXPO_PUBLIC_WEB_URL',
];

const urlVariables = [
  'EXPO_PUBLIC_API_URL',
  'EXPO_PUBLIC_COGNITO_DOMAIN',
  'EXPO_PUBLIC_WEB_URL',
];

const missingVariables = requiredVariables.filter(name => !process.env[name]);

if (missingVariables.length > 0) {
  console.error(`Variáveis públicas ausentes no build web: ${missingVariables.join(', ')}`);
  process.exit(1);
}

const privateHostPattern = /^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;
const forbiddenHostFragments = ['nafoodiary', 'execute-api', 'nivaldoandrade.dev.br'];

for (const name of urlVariables) {
  let url;

  try {
    url = new URL(process.env[name]);
  } catch {
    console.error(`${name} não é uma URL válida.`);
    process.exit(1);
  }

  if (url.protocol !== 'https:') {
    console.error(`${name} precisa usar HTTPS no build web de produção.`);
    process.exit(1);
  }

  if (privateHostPattern.test(url.hostname) || forbiddenHostFragments.some(fragment => url.hostname.includes(fragment))) {
    console.error(`${name} aponta para um ambiente de desenvolvimento: ${url.hostname}`);
    process.exit(1);
  }
}

console.log('Ambiente web de produção validado.');
