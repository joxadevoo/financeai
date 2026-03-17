import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const ICONS_DIR = path.resolve(process.cwd(), 'public/icons')

if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true })
}

const svgLogo = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="1024" height="1024" rx="200" fill="url(#paint0_linear_logo)"/>
<path d="M298 718V306H726V409H418V489H656V592H418V718H298Z" fill="white"/>
<defs>
<linearGradient id="paint0_linear_logo" x1="0" y1="0" x2="1024" y2="1024" gradientUnits="userSpaceOnUse">
<stop stop-color="#2563EB"/>
<stop offset="1" stop-color="#4F46E5"/>
</linearGradient>
</defs>
</svg>
`

const sizes = [192, 512]

async function generateIcons() {
  for (const size of sizes) {
    await sharp(Buffer.from(svgLogo))
      .resize(size, size)
      .toFile(path.join(ICONS_DIR, `icon-${size}x${size}.png`))
    console.log(`Generated icon-${size}x${size}.png`)
  }

  // Generate Apple Touch Icon
  await sharp(Buffer.from(svgLogo))
    .resize(180, 180)
    .toFile(path.join(ICONS_DIR, 'apple-touch-icon.png'))
  console.log('Generated apple-touch-icon.png')
}

generateIcons().catch(console.error)
