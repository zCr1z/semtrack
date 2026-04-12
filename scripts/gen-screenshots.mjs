/**
 * gen-screenshots.mjs
 * Generates premium dark-mode PWA screenshots from SVG templates
 * Run: node scripts/gen-screenshots.mjs
 */
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { Resvg } from '@resvg/resvg-js'

const __dir = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dir, '..')

function render(svgStr, w, h) {
  return new Resvg(svgStr, { fitTo: { mode: 'width', value: w } }).render().asPng()
}

// ─── DESKTOP 1280×720 ────────────────────────────────────────────────────────
const desktopSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#09090d"/>
      <stop offset="100%" stop-color="#0f0f17"/>
    </linearGradient>
    <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a103a"/>
      <stop offset="100%" stop-color="#0f0f1a"/>
    </linearGradient>
    <linearGradient id="accentG" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1280" height="720" fill="url(#bg)"/>

  <!-- Header bar -->
  <rect width="1280" height="84" fill="#111118" opacity="0.95"/>
  <rect width="1280" height="1" y="84" fill="#27272a" opacity="0.6"/>

  <!-- Logo mark placeholder (bars) -->
  <rect x="40" y="24" width="7" height="24" rx="2" fill="#7c3aed"/>
  <rect x="50" y="18" width="7" height="30" rx="2" fill="#ec4899"/>
  <rect x="60" y="21" width="7" height="27" rx="2" fill="#a855f7"/>
  <path d="M38 46 Q52 28 72 20" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round" fill="none"/>

  <!-- App title -->
  <text x="82" y="40" font-family="DM Sans,system-ui,sans-serif" font-size="18" font-weight="600" fill="#ffffff">SemTrackify</text>
  <text x="82" y="57" font-family="DM Sans,system-ui,sans-serif" font-size="11" fill="#71717a">Know your numbers. Control your future.</text>

  <!-- Dark mode toggle placeholder -->
  <rect x="1216" y="24" width="36" height="36" rx="10" fill="#18181b" stroke="#3f3f46" stroke-width="1"/>
  <circle cx="1234" cy="42" r="7" fill="none" stroke="#a1a1aa" stroke-width="1.5"/>

  <!-- CGPA hero card -->
  <rect x="40" y="104" width="460" height="160" rx="20" fill="url(#hero)" stroke="#3b1f6e" stroke-width="1"/>
  <text x="64" y="142" font-family="DM Sans,system-ui,sans-serif" font-size="11" font-weight="600" letter-spacing="2" fill="#a78bfa">CGPA</text>
  <text x="64" y="208" font-family="DM Sans,system-ui,sans-serif" font-size="72" font-weight="700" fill="#ffffff">8.77</text>

  <!-- Stat card: Credits -->
  <rect x="520" y="104" width="220" height="76" rx="14" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <text x="542" y="132" font-family="DM Sans,system-ui,sans-serif" font-size="10" font-weight="600" letter-spacing="1.5" fill="#71717a">TOTAL CREDITS</text>
  <text x="542" y="162" font-family="DM Sans,system-ui,sans-serif" font-size="28" font-weight="600" fill="#f4f4f5">87</text>

  <!-- Stat card: Grade Points -->
  <rect x="752" y="104" width="220" height="76" rx="14" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <text x="774" y="132" font-family="DM Sans,system-ui,sans-serif" font-size="10" font-weight="600" letter-spacing="1.5" fill="#71717a">GRADE POINTS</text>
  <text x="774" y="162" font-family="DM Sans,system-ui,sans-serif" font-size="28" font-weight="600" fill="#f4f4f5">763.5</text>

  <!-- Semester cards row -->
  <text x="40" y="296" font-family="DM Sans,system-ui,sans-serif" font-size="11" font-weight="600" letter-spacing="1" fill="#52525b">SEMESTERS</text>

  <!-- Sem card 1 (active) -->
  <rect x="40" y="308" width="170" height="80" rx="18" fill="#13093a" stroke="#6d28d9" stroke-width="1.5"/>
  <text x="58" y="334" font-family="DM Sans,system-ui,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5" fill="#8b5cf6">FALL 2023</text>
  <text x="58" y="364" font-family="DM Sans,system-ui,sans-serif" font-size="26" font-weight="700" fill="#ede9fe">8.45</text>
  <text x="102" y="366" font-family="DM Sans,system-ui,sans-serif" font-size="10" fill="#7c3aed">GPA</text>
  <rect x="130" y="350" width="1" height="28" fill="#4c1d95" opacity="0.8"/>
  <text x="140" y="364" font-family="DM Sans,system-ui,sans-serif" font-size="26" font-weight="700" fill="#ede9fe">22</text>
  <text x="165" y="366" font-family="DM Sans,system-ui,sans-serif" font-size="10" fill="#7c3aed">CR</text>

  <!-- Sem card 2 -->
  <rect x="224" y="308" width="170" height="80" rx="18" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <text x="242" y="334" font-family="DM Sans,system-ui,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5" fill="#52525b">WINTER 2024</text>
  <text x="242" y="364" font-family="DM Sans,system-ui,sans-serif" font-size="26" font-weight="700" fill="#f4f4f5">8.92</text>
  <text x="286" y="366" font-family="DM Sans,system-ui,sans-serif" font-size="10" fill="#71717a">GPA</text>
  <rect x="314" y="350" width="1" height="28" fill="#3f3f46" opacity="0.7"/>
  <text x="324" y="364" font-family="DM Sans,system-ui,sans-serif" font-size="26" font-weight="700" fill="#f4f4f5">26</text>
  <text x="349" y="366" font-family="DM Sans,system-ui,sans-serif" font-size="10" fill="#71717a">CR</text>

  <!-- Sem card 3 -->
  <rect x="408" y="308" width="170" height="80" rx="18" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <text x="426" y="334" font-family="DM Sans,system-ui,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5" fill="#52525b">FALL 2024</text>
  <text x="426" y="364" font-family="DM Sans,system-ui,sans-serif" font-size="26" font-weight="700" fill="#f4f4f5">8.77</text>
  <text x="470" y="366" font-family="DM Sans,system-ui,sans-serif" font-size="10" fill="#71717a">GPA</text>
  <rect x="498" y="350" width="1" height="28" fill="#3f3f46" opacity="0.7"/>
  <text x="508" y="364" font-family="DM Sans,system-ui,sans-serif" font-size="26" font-weight="700" fill="#f4f4f5">23</text>
  <text x="533" y="366" font-family="DM Sans,system-ui,sans-serif" font-size="10" fill="#71717a">CR</text>

  <!-- Table card -->
  <rect x="40" y="412" width="1200" height="280" rx="18" fill="#111118" stroke="#27272a" stroke-width="1"/>

  <!-- Table header -->
  <rect x="40" y="412" width="1200" height="40" rx="18" fill="#141420"/>
  <rect x="40" y="432" width="1200" height="20" fill="#141420"/>
  <text x="70" y="436" font-family="DM Sans,system-ui,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5" fill="#52525b">SUBJECT</text>
  <text x="680" y="436" font-family="DM Sans,system-ui,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5" fill="#52525b">CREDS</text>
  <text x="800" y="436" font-family="DM Sans,system-ui,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5" fill="#52525b">GRADE</text>
  <text x="930" y="436" font-family="DM Sans,system-ui,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5" fill="#52525b">GP</text>
  <text x="1040" y="436" font-family="DM Sans,system-ui,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5" fill="#52525b">TOTAL</text>

  <!-- Row 1 -->
  <rect x="40" y="452" width="1200" height="1" fill="#1f1f2e" opacity="0.8"/>
  <text x="70" y="478" font-family="DM Sans,system-ui,sans-serif" font-size="14" fill="#e4e4e7">Data Structures and Algorithms</text>
  <text x="700" y="478" font-family="DM Sans,system-ui,sans-serif" font-size="14" fill="#e4e4e7" text-anchor="middle">4</text>
  <text x="830" y="478" font-family="DM Sans,system-ui,sans-serif" font-size="14" font-weight="600" fill="#a78bfa" text-anchor="middle">S</text>
  <text x="940" y="478" font-family="DM Sans,system-ui,sans-serif" font-size="14" fill="#a1a1aa" text-anchor="middle">10</text>
  <text x="1060" y="478" font-family="DM Sans,system-ui,sans-serif" font-size="14" font-weight="600" fill="#f4f4f5" text-anchor="middle">40</text>

  <!-- Row 2 -->
  <rect x="40" y="494" width="1200" height="1" fill="#1f1f2e" opacity="0.8"/>
  <text x="70" y="520" font-family="DM Sans,system-ui,sans-serif" font-size="14" fill="#e4e4e7">Operating Systems</text>
  <text x="700" y="520" font-family="DM Sans,system-ui,sans-serif" font-size="14" fill="#e4e4e7" text-anchor="middle">3</text>
  <text x="830" y="520" font-family="DM Sans,system-ui,sans-serif" font-size="14" font-weight="600" fill="#a78bfa" text-anchor="middle">A</text>
  <text x="940" y="520" font-family="DM Sans,system-ui,sans-serif" font-size="14" fill="#a1a1aa" text-anchor="middle">9</text>
  <text x="1060" y="520" font-family="DM Sans,system-ui,sans-serif" font-size="14" font-weight="600" fill="#f4f4f5" text-anchor="middle">27</text>

  <!-- Row 3 -->
  <rect x="40" y="536" width="1200" height="1" fill="#1f1f2e" opacity="0.8"/>
  <text x="70" y="562" font-family="DM Sans,system-ui,sans-serif" font-size="14" fill="#e4e4e7">Computer Architecture</text>
  <text x="700" y="562" font-family="DM Sans,system-ui,sans-serif" font-size="14" fill="#e4e4e7" text-anchor="middle">4</text>
  <text x="830" y="562" font-family="DM Sans,system-ui,sans-serif" font-size="14" font-weight="600" fill="#a78bfa" text-anchor="middle">A</text>
  <text x="940" y="562" font-family="DM Sans,system-ui,sans-serif" font-size="14" fill="#a1a1aa" text-anchor="middle">9</text>
  <text x="1060" y="562" font-family="DM Sans,system-ui,sans-serif" font-size="14" font-weight="600" fill="#f4f4f5" text-anchor="middle">36</text>

  <!-- Row 4 -->
  <rect x="40" y="578" width="1200" height="1" fill="#1f1f2e" opacity="0.8"/>
  <text x="70" y="604" font-family="DM Sans,system-ui,sans-serif" font-size="14" fill="#e4e4e7">Software Architecture</text>
  <text x="700" y="604" font-family="DM Sans,system-ui,sans-serif" font-size="14" fill="#e4e4e7" text-anchor="middle">3</text>
  <text x="830" y="604" font-family="DM Sans,system-ui,sans-serif" font-size="14" font-weight="600" fill="#a78bfa" text-anchor="middle">S</text>
  <text x="940" y="604" font-family="DM Sans,system-ui,sans-serif" font-size="14" fill="#a1a1aa" text-anchor="middle">10</text>
  <text x="1060" y="604" font-family="DM Sans,system-ui,sans-serif" font-size="14" font-weight="600" fill="#f4f4f5" text-anchor="middle">30</text>

  <!-- Subtle violet accent glow in background -->
  <ellipse cx="960" cy="240" rx="260" ry="120" fill="#7c3aed" opacity="0.04"/>
</svg>`

// ─── MOBILE 720×1280 ─────────────────────────────────────────────────────────
const mobileSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#09090d"/>
      <stop offset="100%" stop-color="#0f0f17"/>
    </linearGradient>
    <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a103a"/>
      <stop offset="100%" stop-color="#0f0f1a"/>
    </linearGradient>
  </defs>

  <rect width="720" height="1280" fill="url(#bg)"/>

  <!-- Header -->
  <rect width="720" height="90" fill="#111118" opacity="0.95"/>
  <rect width="720" height="1" y="90" fill="#27272a" opacity="0.6"/>

  <!-- Logo bars -->
  <rect x="28" y="26" width="8" height="26" rx="2" fill="#7c3aed"/>
  <rect x="40" y="20" width="8" height="32" rx="2" fill="#ec4899"/>
  <rect x="52" y="23" width="8" height="29" rx="2" fill="#a855f7"/>
  <path d="M26 50 Q44 30 66 22" stroke="#7c3aed" stroke-width="2.5" stroke-linecap="round" fill="none"/>

  <text x="76" y="44" font-family="DM Sans,system-ui,sans-serif" font-size="20" font-weight="600" fill="#ffffff">SemTrackify</text>
  <text x="76" y="63" font-family="DM Sans,system-ui,sans-serif" font-size="12" fill="#71717a">Know your numbers. Control your future.</text>

  <!-- Theme toggle -->
  <rect x="662" y="24" width="38" height="38" rx="11" fill="#18181b" stroke="#3f3f46" stroke-width="1"/>
  <circle cx="681" cy="43" r="8" fill="none" stroke="#a1a1aa" stroke-width="1.5"/>

  <!-- Hero CGPA card -->
  <rect x="24" y="112" width="672" height="176" rx="22" fill="url(#hero)" stroke="#3b1f6e" stroke-width="1.5"/>
  <text x="50" y="155" font-family="DM Sans,system-ui,sans-serif" font-size="12" font-weight="600" letter-spacing="2.5" fill="#a78bfa">CGPA</text>
  <text x="50" y="254" font-family="DM Sans,system-ui,sans-serif" font-size="88" font-weight="700" fill="#ffffff">8.77</text>

  <!-- Stat cards row -->
  <rect x="24" y="308" width="328" height="88" rx="16" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <text x="46" y="338" font-family="DM Sans,system-ui,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5" fill="#52525b">TOTAL CREDITS</text>
  <text x="46" y="378" font-family="DM Sans,system-ui,sans-serif" font-size="36" font-weight="600" fill="#f4f4f5">87</text>

  <rect x="368" y="308" width="328" height="88" rx="16" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <text x="390" y="338" font-family="DM Sans,system-ui,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5" fill="#52525b">GRADE POINTS</text>
  <text x="390" y="378" font-family="DM Sans,system-ui,sans-serif" font-size="36" font-weight="600" fill="#f4f4f5">763.5</text>

  <!-- Semester card (active) -->
  <rect x="24" y="420" width="220" height="96" rx="20" fill="#13093a" stroke="#6d28d9" stroke-width="1.5"/>
  <text x="44" y="450" font-family="DM Sans,system-ui,sans-serif" font-size="11" font-weight="700" letter-spacing="1.5" fill="#8b5cf6">FALL 2024</text>
  <text x="44" y="490" font-family="DM Sans,system-ui,sans-serif" font-size="32" font-weight="700" fill="#ede9fe">8.77</text>
  <text x="110" y="492" font-family="DM Sans,system-ui,sans-serif" font-size="11" fill="#7c3aed">GPA</text>
  <rect x="148" y="468" width="1" height="34" fill="#4c1d95"/>
  <text x="162" y="490" font-family="DM Sans,system-ui,sans-serif" font-size="32" font-weight="700" fill="#ede9fe">23</text>
  <text x="200" y="492" font-family="DM Sans,system-ui,sans-serif" font-size="11" fill="#7c3aed">CR</text>

  <!-- Sem card 2 -->
  <rect x="260" y="420" width="220" height="96" rx="20" fill="#18181b" stroke="#27272a" stroke-width="1"/>
  <text x="280" y="450" font-family="DM Sans,system-ui,sans-serif" font-size="11" font-weight="700" letter-spacing="1.5" fill="#52525b">FALL 2023</text>
  <text x="280" y="490" font-family="DM Sans,system-ui,sans-serif" font-size="32" font-weight="700" fill="#f4f4f5">8.45</text>
  <text x="346" y="492" font-family="DM Sans,system-ui,sans-serif" font-size="11" fill="#71717a">GPA</text>
  <rect x="384" y="468" width="1" height="34" fill="#3f3f46"/>
  <text x="398" y="490" font-family="DM Sans,system-ui,sans-serif" font-size="32" font-weight="700" fill="#f4f4f5">22</text>
  <text x="436" y="492" font-family="DM Sans,system-ui,sans-serif" font-size="11" fill="#71717a">CR</text>

  <!-- Subject table -->
  <rect x="24" y="542" width="672" height="340" rx="18" fill="#111118" stroke="#27272a" stroke-width="1"/>

  <!-- Table header -->
  <rect x="24" y="542" width="672" height="44" rx="18" fill="#141420"/>
  <rect x="24" y="566" width="672" height="20" fill="#141420"/>
  <text x="50" y="568" font-family="DM Sans,system-ui,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5" fill="#52525b">SUBJECT</text>
  <text x="480" y="568" font-family="DM Sans,system-ui,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5" fill="#52525b">CR</text>
  <text x="540" y="568" font-family="DM Sans,system-ui,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5" fill="#52525b">GR</text>
  <text x="620" y="568" font-family="DM Sans,system-ui,sans-serif" font-size="10" font-weight="700" letter-spacing="1.5" fill="#52525b">TOTAL</text>

  <!-- Row 1 -->
  <rect x="24" y="586" width="672" height="1" fill="#1f1f2e"/>
  <text x="50" y="614" font-family="DM Sans,system-ui,sans-serif" font-size="15" fill="#e4e4e7">Data Structures and Algorithms</text>
  <text x="486" y="614" font-family="DM Sans,system-ui,sans-serif" font-size="15" fill="#e4e4e7" text-anchor="middle">4</text>
  <text x="552" y="614" font-family="DM Sans,system-ui,sans-serif" font-size="15" font-weight="700" fill="#a78bfa" text-anchor="middle">S</text>
  <text x="636" y="614" font-family="DM Sans,system-ui,sans-serif" font-size="15" font-weight="600" fill="#f4f4f5" text-anchor="middle">40</text>

  <!-- Row 2 -->
  <rect x="24" y="632" width="672" height="1" fill="#1f1f2e"/>
  <text x="50" y="660" font-family="DM Sans,system-ui,sans-serif" font-size="15" fill="#e4e4e7">Operating Systems</text>
  <text x="486" y="660" font-family="DM Sans,system-ui,sans-serif" font-size="15" fill="#e4e4e7" text-anchor="middle">3</text>
  <text x="552" y="660" font-family="DM Sans,system-ui,sans-serif" font-size="15" font-weight="700" fill="#a78bfa" text-anchor="middle">A</text>
  <text x="636" y="660" font-family="DM Sans,system-ui,sans-serif" font-size="15" font-weight="600" fill="#f4f4f5" text-anchor="middle">27</text>

  <!-- Row 3 -->
  <rect x="24" y="678" width="672" height="1" fill="#1f1f2e"/>
  <text x="50" y="706" font-family="DM Sans,system-ui,sans-serif" font-size="15" fill="#e4e4e7">Computer Architecture</text>
  <text x="486" y="706" font-family="DM Sans,system-ui,sans-serif" font-size="15" fill="#e4e4e7" text-anchor="middle">4</text>
  <text x="552" y="706" font-family="DM Sans,system-ui,sans-serif" font-size="15" font-weight="700" fill="#a78bfa" text-anchor="middle">A</text>
  <text x="636" y="706" font-family="DM Sans,system-ui,sans-serif" font-size="15" font-weight="600" fill="#f4f4f5" text-anchor="middle">36</text>

  <!-- Row 4 -->
  <rect x="24" y="724" width="672" height="1" fill="#1f1f2e"/>
  <text x="50" y="752" font-family="DM Sans,system-ui,sans-serif" font-size="15" fill="#e4e4e7">Software Architecture</text>
  <text x="486" y="752" font-family="DM Sans,system-ui,sans-serif" font-size="15" fill="#e4e4e7" text-anchor="middle">3</text>
  <text x="552" y="752" font-family="DM Sans,system-ui,sans-serif" font-size="15" font-weight="700" fill="#a78bfa" text-anchor="middle">S</text>
  <text x="636" y="752" font-family="DM Sans,system-ui,sans-serif" font-size="15" font-weight="600" fill="#f4f4f5" text-anchor="middle">30</text>

  <!-- Semester GPA bar at bottom -->
  <rect x="24" y="910" width="672" height="64" rx="18" fill="#141420" stroke="#27272a" stroke-width="1"/>
  <text x="50" y="948" font-family="DM Sans,system-ui,sans-serif" font-size="12" font-weight="600" fill="#71717a">Semester GPA</text>
  <text x="300" y="950" font-family="DM Sans,system-ui,sans-serif" font-size="24" font-weight="700" fill="#a78bfa" text-anchor="middle">8.77</text>

  <!-- Goal Predictor card -->
  <rect x="24" y="996" width="672" height="124" rx="18" fill="#111118" stroke="#27272a" stroke-width="1"/>
  <text x="50" y="1028" font-family="DM Sans,system-ui,sans-serif" font-size="13" font-weight="600" fill="#e4e4e7">Future Goal Predictor</text>
  <rect x="206" y="1014" width="38" height="18" rx="9" fill="#7c3aed" opacity="0.25"/>
  <text x="225" y="1027" font-family="DM Sans,system-ui,sans-serif" font-size="10" font-weight="600" fill="#a78bfa" text-anchor="middle">Beta</text>
  <text x="50" y="1048" font-family="DM Sans,system-ui,sans-serif" font-size="11" fill="#52525b">Calculate minimum effort to reach your target CGPA</text>
  <rect x="530" y="1068" width="140" height="36" rx="10" fill="#1a1a2a" stroke="#3f3f46" stroke-width="1"/>
  <text x="600" y="1091" font-family="DM Sans,system-ui,sans-serif" font-size="13" fill="#71717a" text-anchor="middle">Target CGPA</text>

  <!-- Violet glow -->
  <ellipse cx="360" cy="640" rx="300" ry="200" fill="#7c3aed" opacity="0.03"/>
</svg>`

writeFileSync(path.join(root, 'public', 'screenshot-desktop.png'), render(desktopSvg, 1280, 720))
console.log('✓ screenshot-desktop.png  (1280×720)')

writeFileSync(path.join(root, 'public', 'screenshot-mobile.png'), render(mobileSvg, 720, 1280))
console.log('✓ screenshot-mobile.png  (720×1280)')

console.log('\nScreenshots generated ✓')
