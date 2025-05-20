import { fileURLToPath, URL } from 'node:url';

import tailwindcss from "@tailwindcss/vite";
import plugin from '@vitejs/plugin-react';
import child_process from 'child_process';
import fs from 'fs';
import path from 'path';
import { env } from 'process';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  // Only do HTTPS cert setup in dev server mode
  let httpsOptions = undefined;

  if (command === 'serve') {
    const baseFolder =
      env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

    const certificateName = "quickmarkweb.client";
    const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
    const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

    if (!fs.existsSync(baseFolder)) {
      fs.mkdirSync(baseFolder, { recursive: true });
    }

    if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
      if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
      ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
      }
    }

    httpsOptions = {
      key: fs.readFileSync(keyFilePath),
      cert: fs.readFileSync(certFilePath),
    };
  }

  const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7045';

  return {
    plugins: [plugin(), tailwindcss()],
    resolve: {
      alias: {
        // '@': fileURLToPath(new URL('./src', import.meta.url))
        '@': path.resolve(__dirname, 'src'),
      }
    },
    server: {
      proxy: {
        '^/weatherforecast': {
          target,
          secure: false
        }
      },
      port: parseInt(env.DEV_SERVER_PORT || '53300'),
      https: httpsOptions,
    }
  };
});
