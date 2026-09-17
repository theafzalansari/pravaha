/**
 * convert_video.js
 * Converts zones.mp4 (MPEG-4 Part 2 / mp4v) to zones_web.mp4 (H.264/avc1)
 * for Chrome-compatible browser playback.
 * Run: node convert_video.js
 */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG = path.resolve(
  'C:/Users/AFZAL ANSARI/WebstormProjects/SIH25007/backend/node_modules/ffmpeg-static/ffmpeg.exe'
);
const INPUT  = path.resolve(__dirname, 'frontend/public/zones.mp4');
const OUTPUT = path.resolve(__dirname, 'frontend/public/zones_web.mp4');

console.log('=== PRAVAHA Video Converter ===');
console.log(`FFmpeg : ${FFMPEG}`);
console.log(`Input  : ${INPUT}`);
console.log(`Output : ${OUTPUT}`);
console.log('');

if (!fs.existsSync(FFMPEG)) {
  console.error('ERROR: ffmpeg binary not found at:', FFMPEG);
  process.exit(1);
}
if (!fs.existsSync(INPUT)) {
  console.error('ERROR: Input file not found:', INPUT);
  process.exit(1);
}

console.log('Converting mp4v → H.264 (libx264) + yuv420p + faststart ...');

const result = spawnSync(FFMPEG, [
  '-y',
  '-i', INPUT,
  '-c:v', 'libx264',
  '-preset', 'fast',
  '-crf', '23',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  '-an',        // no audio track (source has none)
  OUTPUT
], {
  stdio: ['ignore', 'pipe', 'pipe'],
  encoding: 'utf8',
  timeout: 300000   // 5 minute max
});

// Print stderr (FFmpeg logs to stderr)
if (result.stderr) {
  console.log('--- FFmpeg output ---');
  console.log(result.stderr);
  console.log('---------------------');
}
if (result.stdout) console.log(result.stdout);

if (result.error) {
  console.error('Spawn error:', result.error);
  process.exit(1);
}

console.log(`Exit code: ${result.status}`);

if (result.status !== 0) {
  console.error('FFmpeg failed.');
  process.exit(1);
}

if (!fs.existsSync(OUTPUT)) {
  console.error('ERROR: Output file was not created!');
  process.exit(1);
}

const size = fs.statSync(OUTPUT).size;
console.log(`\nSUCCESS: zones_web.mp4 created (${(size / 1024 / 1024).toFixed(2)} MB)`);
