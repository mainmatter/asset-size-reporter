const fs = require('fs-extra');
const gzipSize = require('gzip-size');

module.exports = async function calculateAssetSize(path, options) {
  let sizes = await Promise.all([
    calculateRawAssetSize(path),
    calculateCompressedAssetSizes(path, options),
  ]);

  return Object.assign(...sizes);
};

async function calculateRawAssetSize(path) {
  let stats = await fs.stat(path);
  return { size: stats.size };
}

async function calculateCompressedAssetSizes(path, options = {}) {
  if (!options.gzip) {
    return {};
  }

  let data = await fs.readFile(path);
  let size = await calculateGzipSize(data, options.gzip);

  return { gzip: size };
}

async function calculateGzipSize(data, level) {
  if (level === true) {
    level = 9;
  }

  return await gzipSize(data, { level });
}
