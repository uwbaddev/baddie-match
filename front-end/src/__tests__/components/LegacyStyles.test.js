import fs from 'fs';
import path from 'path';

const css = fs.readFileSync(path.join(process.cwd(), 'src/index.css'), 'utf8');

const expectRuleToUseLegacyFont = (selector) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  expect(css).toMatch(new RegExp(`${escapedSelector}\\s*\\{[^}]*font-family:\\s*var\\(--main-body-font\\)`, 's'));
};

test('legacy pages restore the original Barlow Condensed font scope', () => {
  expect(css).toContain("@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700&display=swap');");
  expect(css).toContain("--main-body-font: 'Barlow Condensed', sans-serif;");

  [
    '.legacy-header',
    '.legacy-page-header',
    '.legacy-page-title',
    '.legacy-table-header',
    '.legacy-report-tab',
    '.legacy-site .form-header',
    '.legacy-site .form-table-header',
    '.legacy-site .form-label',
    '.legacy-site .submit-button',
  ].forEach(expectRuleToUseLegacyFont);
});
