import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const airbnbDir = path.resolve(__dirname, '..', 'airBnb');

function isValidJavaHome(dir) {
  if (!dir) return false;
  return fs.existsSync(path.join(dir, 'bin', 'java.exe')) || fs.existsSync(path.join(dir, 'bin', 'java'));
}

// Ensure JAVA_HOME points to a valid JDK directory containing bin/java
if (!isValidJavaHome(process.env.JAVA_HOME)) {
  const commonJavaPaths = [
    'C:\\Program Files\\Java\\jdk-21',
    'C:\\Program Files\\Java\\jdk-17',
    'C:\\Program Files\\Java\\jdk-11',
    'C:\\Program Files (x86)\\Java\\jdk-21'
  ];
  for (const javaPath of commonJavaPaths) {
    if (isValidJavaHome(javaPath)) {
      process.env.JAVA_HOME = javaPath;
      console.log(`[Backend Setup] Auto-detected valid JAVA_HOME: ${javaPath}`);
      break;
    }
  }
}

const isWin = process.platform === 'win32';
const cmd = isWin ? 'mvnw.cmd' : './mvnw';
const args = ['spring-boot:run'];

console.log(`[Backend] Starting Spring Boot application in ${airbnbDir} with JAVA_HOME=${process.env.JAVA_HOME}...`);

const child = spawn(cmd, args, {
  cwd: airbnbDir,
  stdio: 'inherit',
  shell: true,
  env: process.env
});

child.on('error', (err) => {
  console.error('[Backend] Failed to start backend process:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`[Backend] Process exited with code ${code}`);
  }
  process.exit(code || 0);
});
