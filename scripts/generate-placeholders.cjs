const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/assets');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

function createSvg(title, subtitle, type = 'desktop') {
  if (type === 'tall') {
    // 600 x 800 tall mobile/landing screenshot - flat, clean, no gradients
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
  <rect width="600" height="800" fill="#151A18" rx="16"/>
  <rect x="2" y="2" width="596" height="796" fill="none" stroke="#2A302D" stroke-width="2" rx="14"/>
  
  <!-- Browser / Mobile Header -->
  <rect x="24" y="24" width="552" height="44" rx="8" fill="#0E1110"/>
  <rect x="40" y="38" width="16" height="16" rx="4" fill="#3DAA85"/>
  <rect x="72" y="42" width="260" height="8" rx="4" fill="#2A302D"/>
  <text x="350" y="50" fill="#8A948E" font-family="system-ui, sans-serif" font-size="11" font-weight="500">${title.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</text>

  <!-- Hero Wireframe -->
  <rect x="36" y="92" width="528" height="170" rx="12" fill="#1A211E" stroke="#2A302D"/>
  <text x="64" y="146" fill="#E8EDE9" font-family="'Archivo Black', system-ui, sans-serif" font-size="26" font-weight="900" letter-spacing="-0.02em">${title.toUpperCase()}</text>
  <text x="64" y="178" fill="#8A948E" font-family="system-ui, sans-serif" font-size="14" font-weight="500">${subtitle}</text>
  <rect x="64" y="206" width="110" height="32" rx="6" fill="#3DAA85"/>
  <text x="119" y="226" fill="#0E1110" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">VIEW LIVE</text>

  <!-- Content cards -->
  <rect x="36" y="286" width="250" height="136" rx="10" fill="#0E1110" stroke="#2A302D"/>
  <rect x="56" y="306" width="32" height="32" rx="6" fill="#3DAA85" fill-opacity="0.2"/>
  <rect x="56" y="356" width="120" height="10" rx="4" fill="#2A302D"/>
  <rect x="56" y="376" width="170" height="6" rx="3" fill="#1F2623"/>

  <rect x="314" y="286" width="250" height="136" rx="10" fill="#0E1110" stroke="#2A302D"/>
  <rect x="334" y="306" width="32" height="32" rx="6" fill="#3DAA85" fill-opacity="0.2"/>
  <rect x="334" y="356" width="120" height="10" rx="4" fill="#2A302D"/>
  <rect x="334" y="376" width="170" height="6" rx="3" fill="#1F2623"/>

  <!-- Analytics / Chart section -->
  <rect x="36" y="446" width="528" height="200" rx="12" fill="#0E1110" stroke="#2A302D"/>
  <path d="M60 590 C 130 530, 190 560, 260 500 C 330 440, 410 520, 520 470" fill="none" stroke="#3DAA85" stroke-width="3" stroke-linecap="round"/>
  <circle cx="260" cy="500" r="5" fill="#3DAA85"/>
  <circle cx="520" cy="470" r="5" fill="#3DAA85"/>

  <!-- Bottom CTA bar -->
  <rect x="36" y="670" width="528" height="84" rx="10" fill="#1A211E" stroke="#2A302D"/>
  <text x="64" y="718" fill="#E8EDE9" font-family="system-ui, sans-serif" font-size="14" font-weight="600">Client Platform Showcase</text>
  <rect x="440" y="694" width="104" height="36" rx="6" fill="#3DAA85"/>
  <text x="492" y="716" fill="#0E1110" font-family="system-ui, sans-serif" font-size="12" font-weight="700" text-anchor="middle">VISIT</text>
</svg>`;
  }

  // 800 x 500 landscape screenshot - flat, clean, no gradients
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <rect width="800" height="500" fill="#151A18" rx="14"/>
  <rect x="2" y="2" width="796" height="496" fill="none" stroke="#2A302D" stroke-width="2" rx="12"/>

  <!-- Top bar -->
  <rect x="24" y="20" width="752" height="40" rx="8" fill="#0E1110"/>
  <circle cx="46" cy="40" r="4" fill="#2A302D"/>
  <circle cx="62" cy="40" r="4" fill="#2A302D"/>
  <circle cx="78" cy="40" r="4" fill="#2A302D"/>
  <rect x="100" y="30" width="400" height="20" rx="4" fill="#1A211E"/>
  <text x="116" y="44" fill="#8A948E" font-family="system-ui, sans-serif" font-size="11">https://${title.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</text>

  <!-- Left Hero Banner -->
  <rect x="24" y="80" width="450" height="220" rx="10" fill="#1A211E" stroke="#2A302D"/>
  <text x="48" y="140" fill="#E8EDE9" font-family="'Archivo Black', system-ui, sans-serif" font-size="24" font-weight="900">${title.toUpperCase()}</text>
  <text x="48" y="172" fill="#8A948E" font-family="system-ui, sans-serif" font-size="13">${subtitle}</text>
  <rect x="48" y="200" width="110" height="32" rx="6" fill="#3DAA85"/>
  <text x="103" y="220" fill="#0E1110" font-family="system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">LIVE PREVIEW</text>

  <!-- Right Dashboard Widgets -->
  <rect x="494" y="80" width="282" height="100" rx="8" fill="#0E1110" stroke="#2A302D"/>
  <rect x="514" y="100" width="32" height="32" rx="6" fill="#3DAA85" fill-opacity="0.2"/>
  <rect x="558" y="104" width="80" height="10" rx="4" fill="#2A302D"/>
  <rect x="558" y="122" width="130" height="6" rx="3" fill="#1F2623"/>

  <rect x="494" y="200" width="282" height="100" rx="8" fill="#0E1110" stroke="#2A302D"/>
  <rect x="514" y="220" width="32" height="32" rx="6" fill="#3DAA85" fill-opacity="0.2"/>
  <rect x="558" y="224" width="80" height="10" rx="4" fill="#2A302D"/>
  <rect x="558" y="242" width="130" height="6" rx="3" fill="#1F2623"/>

  <!-- Bottom 3 Columns -->
  <rect x="24" y="324" width="234" height="144" rx="8" fill="#0E1110" stroke="#2A302D"/>
  <rect x="44" y="344" width="60" height="8" rx="4" fill="#2A302D"/>
  <rect x="44" y="364" width="140" height="6" rx="3" fill="#1F2623"/>
  <rect x="44" y="378" width="110" height="6" rx="3" fill="#1F2623"/>

  <rect x="282" y="324" width="234" height="144" rx="8" fill="#0E1110" stroke="#2A302D"/>
  <rect x="302" y="344" width="60" height="8" rx="4" fill="#2A302D"/>
  <rect x="302" y="364" width="140" height="6" rx="3" fill="#1F2623"/>
  <rect x="302" y="378" width="110" height="6" rx="3" fill="#1F2623"/>

  <rect x="540" y="324" width="236" height="144" rx="8" fill="#0E1110" stroke="#2A302D"/>
  <rect x="560" y="344" width="60" height="8" rx="4" fill="#2A302D"/>
  <rect x="560" y="364" width="140" height="6" rx="3" fill="#1F2623"/>
  <rect x="560" y="378" width="110" height="6" rx="3" fill="#1F2623"/>
</svg>`;
}

const items = [
  // WebForge (Company)
  { file: 'project-webforge-1.svg', title: 'WebForge Studio', sub: 'Custom web platforms', type: 'wide' },
  { file: 'project-webforge-2.svg', title: 'Client Analytics', sub: 'Real-time performance metrics', type: 'wide' },
  { file: 'project-webforge-3.svg', title: 'WebForge Mobile & Web', sub: 'Responsive UI Architecture', type: 'tall' },

  // Chapin Stock (Client)
  { file: 'project-chapin-1.svg', title: 'Chapin Stock E-Commerce', sub: 'Local inventory & checkout', type: 'wide' },
  { file: 'project-chapin-2.svg', title: 'Order Fulfillment', sub: 'Instant WhatsApp integration', type: 'wide' },
  { file: 'project-chapin-3.svg', title: 'Chapin Stock Catalog', sub: 'High conversion mobile store', type: 'tall' },

  // Para Boo (Personal)
  { file: 'project-paraboo-1.svg', title: 'Para Boo Interactive', sub: 'Creative web experience', type: 'wide' },
  { file: 'project-paraboo-2.svg', title: 'Audio & Visual Canvas', sub: 'Interactive sound reactive UI', type: 'wide' },
  { file: 'project-paraboo-3.svg', title: 'Para Boo Storytelling', sub: 'Smooth micro-interactions', type: 'tall' },

  // Marquee previews
  { file: 'marquee-1.svg', title: 'Landing Design', sub: 'High conversion', type: 'wide' },
  { file: 'marquee-2.svg', title: 'SaaS Dashboard', sub: 'Clean dark UI', type: 'wide' },
  { file: 'marquee-3.svg', title: 'Boutique Store', sub: 'Product catalog', type: 'wide' },
  { file: 'marquee-4.svg', title: 'Restoration Hub', sub: 'Fast 100/100 Lighthouse', type: 'wide' },
];

items.forEach(item => {
  const content = createSvg(item.title, item.sub, item.type);
  fs.writeFileSync(path.join(dir, item.file), content, 'utf-8');
});

console.log('Regenerated ' + items.length + ' placeholder images with flat #3DAA85 theme.');
