import fs from 'fs';
import path from 'path';

const css = fs.readFileSync(path.join(process.cwd(), 'src/index.css'), 'utf8');

const expectRuleToUseV1Font = (selector) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  expect(css).toMatch(new RegExp(`${escapedSelector}\\s*\\{[^}]*font-family:\\s*var\\(--main-body-font\\)`, 's'));
};

test('v1 pages restore the original Barlow Condensed font scope', () => {
  expect(css).toContain("@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700&display=swap');");
  expect(css).toContain("--main-body-font: 'Barlow Condensed', sans-serif;");

  [
    '.header',
    '.page-header',
    '.page-title',
    '.table-header',
    '.report-tab',
    '.form-header',
    '.form-table-header',
    '.form-label',
    '.submit-button',
  ].forEach(expectRuleToUseV1Font);
});
