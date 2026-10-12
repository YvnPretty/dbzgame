const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
process.chdir(root);
fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist/public', { recursive: true });
fs.cpSync('public/img', 'dist/public/img', { recursive: true });
execFileSync(
  process.execPath,
  [require.resolve('webpack-cli/bin/cli.js'), '--mode', 'production'],
  { stdio: 'inherit' },
);

// El HTML referencia el bundle versionado para evitar JavaScript antiguo en caché.
const bundle = fs.readdirSync('dist').find((file) => /^bundle\.[a-f0-9]+\.js$/.test(file));
if (!bundle) throw new Error('Webpack no generó el bundle del juego.');
const html = fs.readFileSync('index.html', 'utf8').replace('./bundle.js', `./${bundle}`);
fs.writeFileSync('dist/index.html', html);
