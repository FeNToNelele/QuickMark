import { fileURLToPath, URL } from 'node:url';
import tailwindcss from "@tailwindcss/vite";
import plugin from '@vitejs/plugin-react';
import child_process from 'child_process';
import fs from 'fs';
import path from 'path';
import { env } from 'process';
import { defineConfig } from 'vite';

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "quickmarkweb.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

export default defineConfig(({ command }) => {
    if (command === 'serve') {
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
                console.error("Could not create certificate. HTTPS might not work correctly.");
            }
        }
    }

    const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
        env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:7045';

    const config = {
        plugins: [plugin(), tailwindcss()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            }
        },
        server: {
            proxy: {
                '/api': {
                    target: 'http://localhost:5000', //this used in production. in development use 7045
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, '')
                }
            },
            port: parseInt(env.DEV_SERVER_PORT || '53300'),
        }
    };
    /*
    if (command === 'serve') {
        config.server.https = {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        };
    }
	*/
    return config;
    
});
