/**
 * gen-icons.mjs
 * Generates PWA icons from logo.svg using @resvg/resvg-js
 * Run: node scripts/gen-icons.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import { Resvg } from '@resvg/resvg-js'

const __dir = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dir, '..')
const svgPath = path.join(root, 'public', 'logo.svg')

// We wrap the logo SVG inside a sized canvas SVG with dark background + padding
function buildWrappedSvg(innerSvg, outputSize, paddingFraction, bgColor, cornerRadius = 0) {
  const pad = Math.round(outputSize * paddingFraction)
  const inner = outputSize - pad * 2

  const roundedBg = cornerRadius > 0
    ? `<rect width="${outputSize}" height="${outputSize}" rx="${cornerRadius}" ry="${cornerRadius}" fill="${bgColor}"/>`
    : `<rect width="${outputSize}" height="${outputSize}" fill="${bgColor}"/>`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${outputSize}" height="${outputSize}" viewBox="0 0 ${outputSize} ${outputSize}">
  ${roundedBg}
  <g transform="translate(${pad}, ${pad})">
    <svg width="${inner}" height="${inner}" viewBox="0 0 100 100">
      ${innerSvg}
    </svg>
  </g>
</svg>`
}

// Extract inner content from the logo SVG file
function getInnerSvgContent(svgString) {
  // Strip the outer <svg ...> tags and return the inner content
  return svgString
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim()
}

const logoSvgRaw = readFileSync(svgPath, 'utf8')
const logoInner = getInnerSvgContent(logoSvgRaw)

function renderToPng(outputSize, paddingFraction, cornerRadius = 0) {
  const wrapped = buildWrappedSvg(logoInner, outputSize, paddingFraction, '#0b0b0f', cornerRadius)
  const resvg = new Resvg(wrapped, {
    fitTo: { mode: 'width', value: outputSize },
  })
  return resvg.render().asPng()
}

// icon-192.png  — 192×192, subtle rounding
const buf192 = renderToPng(192, 0.14, 38)
writeFileSync(path.join(root, 'public', 'icon-192.png'), buf192)
console.log('✓ icon-192.png  (192×192)')

// icon-512.png  — 512×512, proportional rounding
const buf512 = renderToPng(512, 0.12, 102)
writeFileSync(path.join(root, 'public', 'icon-512.png'), buf512)
console.log('✓ icon-512.png  (512×512)')

// icon-512-maskable.png  — extra safe-zone (20%), NO corner rounding (OS clips)
const bufMask = renderToPng(512, 0.22, 0)
writeFileSync(path.join(root, 'public', 'icon-512-maskable.png'), bufMask)
console.log('✓ icon-512-maskable.png  (512×512 maskable)')

// --- Screenshots: minimal coloured placeholder PNGs ---
// 1280×720 desktop
function makeSolidPng(w, h, hexColor) {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${hexColor}"/><text x="${w/2}" y="${h/2}" font-family="sans-serif" font-size="${Math.round(h*0.06)}" fill="#7c3aed" text-anchor="middle" dominant-baseline="middle">SemTrack</text></svg>`
  return new Resvg(svgStr, { fitTo: { mode: 'width', value: w } }).render().asPng()
}

writeFileSync(path.join(root, 'public', 'screenshot-desktop.png'), makeSolidPng(1280, 720, '#0b0b0f'))
console.log('✓ screenshot-desktop.png  (1280×720)')

writeFileSync(path.join(root, 'public', 'screenshot-mobile.png'), makeSolidPng(720, 1280, '#0b0b0f'))
console.log('✓ screenshot-mobile.png  (720×1280)')

console.log('\nAll PWA assets generated ✓')
