const fs = require('fs');
const path = require('path');
const jimpModule = require('jimp');
const pngToIco = require('png-to-ico');

const Jimp = jimpModule.Jimp || jimpModule.default || jimpModule;
const readImage =
  typeof jimpModule.read === 'function'
    ? jimpModule.read.bind(jimpModule)
    : Jimp.read.bind(Jimp);
const mimePng = jimpModule.MIME_PNG || Jimp.MIME_PNG;

const sourcePng = path.join(__dirname, '..', 'public', 'Logo.png');
const outDir = path.join(__dirname, '..', 'build');
const outIco = path.join(outDir, 'icon.ico');

async function main() {
  if (!fs.existsSync(sourcePng)) {
    throw new Error(`Missing source PNG: ${sourcePng}`);
  }

  const image = await readImage(sourcePng);
  const sizes = [16, 24, 32, 48, 64, 128, 256];

  const buffers = await Promise.all(
    sizes.map(async (size) => {
      const resized = image.clone().contain(size, size);
      return resized.getBufferAsync(mimePng);
    })
  );

  const icoBuffer = await pngToIco(buffers);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(outIco, icoBuffer);
  console.log(`Wrote ${outIco}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
