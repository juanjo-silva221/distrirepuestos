import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFilePath = path.join(__dirname, '..', '.env');

if (existsSync(envFilePath)) {
  process.loadEnvFile(envFilePath);
}

const { startServer } = await import('./app.js');

await startServer();
