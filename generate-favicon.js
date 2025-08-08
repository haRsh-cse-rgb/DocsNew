const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicons() {
  try {
    const inputPath = path.join(__dirname, 'packages/web/public/IndiaJobs.png');
    const outputDir = path.join(__dirname, 'packages/web/public');

    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.error('Input file not found:', inputPath);
      return;
    }

    console.log('Generating favicons from:', inputPath);

    // Generate favicon.ico (16x16)
    await sharp(inputPath)
      .resize(16, 16)
      .png()
      .toFile(path.join(outputDir, 'favicon-16x16.png'));

    // Generate favicon.ico (32x32)
    await sharp(inputPath)
      .resize(32, 32)
      .png()
      .toFile(path.join(outputDir, 'favicon-32x32.png'));

    // Generate apple-touch-icon (180x180)
    await sharp(inputPath)
      .resize(180, 180)
      .png()
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));

    // Generate favicon.ico (ICO format)
    await sharp(inputPath)
      .resize(32, 32)
      .toFormat('ico')
      .toFile(path.join(outputDir, 'favicon.ico'));

    console.log('✅ Favicons generated successfully!');
    console.log('Generated files:');
    console.log('- favicon-16x16.png');
    console.log('- favicon-32x32.png');
    console.log('- apple-touch-icon.png');
    console.log('- favicon.ico');

  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons(); 