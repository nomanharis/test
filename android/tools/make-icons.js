// Renders the launcher icons from the web app's icon design. Run: node make-icons.js <android-dir>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const root = process.argv[2];
const legacy = fs.readFileSync(path.join(root, '../deutsch/icons/icon.svg'), 'utf8');
// Foreground for the adaptive icon: the sign only, centred in the 66/108 safe zone, transparent background.
const fg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108">
  <g transform="translate(54 54) scale(0.135) translate(-256 -284)">
    <rect x="86" y="146" width="340" height="220" rx="30" fill="#f6c400"/>
    <rect x="104" y="164" width="304" height="184" rx="18" fill="none" stroke="#111" stroke-width="14"/>
    <text x="256" y="300" text-anchor="middle" font-family="Arial Narrow, Arial, sans-serif" font-weight="700" font-size="150" fill="#111">B1</text>
    <path d="M206 366h100l-50 56z" fill="#f6c400"/>
  </g></svg>`;
const dens = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const [d, k] of Object.entries(dens)) {
    const dir = path.join(root, 'res', `mipmap-${d}`);
    fs.mkdirSync(dir, { recursive: true });
    for (const [name, svg, dp, bg] of [['ic_launcher.png', legacy, 48, '#16324f'], ['ic_launcher_fg.png', fg, 108, 'transparent']]) {
      const s = Math.round(dp * k);
      await p.setViewportSize({ width: s, height: s });
      await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${s}" height="${s}" `)}</body></html>`);
      await p.screenshot({ path: path.join(dir, name), omitBackground: true });
    }
  }
  await b.close();
})();
