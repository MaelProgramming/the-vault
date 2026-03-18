import fs from 'fs';
import sharp from 'sharp';

async function generate() {
  const svgBuffer = fs.readFileSync('./public/logo.svg');
  
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('./public/pwa-192x192.png');
    
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('./public/pwa-512x512.png');
    
  console.log('Icons generated successfully.');
}

generate().catch(console.error);
