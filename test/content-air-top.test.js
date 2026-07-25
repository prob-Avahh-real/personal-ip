import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../src/content.js';

const proj = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

test('featured portfolio is Air Top with playable href', () => {
  const p = site.works.portfolio;
  assert.match(p.name, /空气陀螺|Air Top/i);
  assert.ok(
    p.href.includes('air-top'),
    `portfolio.href should point at air-top demo, got ${p.href}`,
  );
});

test('air-top demo ships under public/ for GitHub Pages', () => {
  const index = path.join(proj, 'public', 'air-top', 'index.html');
  const app = path.join(proj, 'public', 'air-top', 'js', 'app.js');
  assert.ok(fs.existsSync(index), 'missing public/air-top/index.html');
  assert.ok(fs.existsSync(app), 'missing public/air-top/js/app.js');
});
