const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');
const babel = require('@babel/core');
const terser = require('terser').minify;

const fileName = process.env.VUE_APP_TRACKER_FILENAME || 'vector.min.js';

/**
 * build tracker to `dist`
 */
async function buildTracker() {
  // output esm file
  esbuild.buildSync({
    entryPoints: ['tracker/index.esm.js'],
    outfile: 'lib/index.esm.js',
    format: 'esm',
    target: 'es2020',
    bundle: true,
    sourcemap: true,
  });

  // build
  esbuild.buildSync({
    entryPoints: ['tracker/index.js'],
    outfile: `dist/${fileName}`,
    format: 'iife',
    target: 'es2020',
  });
  const output = path.resolve(__dirname, `../dist/${fileName}`);
  let content = fs.readFileSync(output, { encoding: 'utf-8' });

  // transform
  content = babel.transformSync(content, {
    // prevent from using vue app's babel config
    configFile: path.resolve(__dirname, '../tracker/babel.config.json'),
  }).code;

  // minify
  const result = await terser(content);
  fs.writeFileSync(output, result.code);
}

module.exports = buildTracker;
