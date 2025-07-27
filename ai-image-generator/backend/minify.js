const fs = require('fs');
const Terser = require('terser');

const inputPath = '../public/imageGen.js';
const outputPath = '../public/imageGen.min.js';

fs.readFile(inputPath, 'utf8', async (err, code) => {
  if (err) throw err;
  const result = await Terser.minify(code);
  fs.writeFile(outputPath, result.code, err => {
    if (err) throw err;
    console.log('Minified JS written to', outputPath);
  });
});
