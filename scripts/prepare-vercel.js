const fs = require('node:fs');
const path = require('node:path');

const output = path.join(__dirname, '..', 'public');
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(path.join(output, 'dist'), { recursive: true });
fs.copyFileSync(path.join(__dirname, '..', 'index.html'), path.join(output, 'index.html'));
fs.copyFileSync(path.join(__dirname, '..', 'dist', 'output.css'), path.join(output, 'dist', 'output.css'));
fs.cpSync(path.join(__dirname, '..', 'assets'), path.join(output, 'assets'), { recursive: true });
fs.cpSync(path.join(__dirname, '..', 'js'), path.join(output, 'js'), { recursive: true });
