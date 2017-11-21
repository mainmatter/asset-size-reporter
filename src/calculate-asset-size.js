const fs = require('fs-extra');
const gzipSize = require('gzip-size');

module.exports = function calculateAssetSize(path, options) {
  return Promise.all([
    calculateRawAssetSize(path),
    calculateCompressedAssetSizes(path, options),
  ]).then(sizes => Object.assign(...sizes));
};

function calculateRawAssetSize(path) {
  return fs.stat(path).then(stats => {
    return { size: stats.size };
  });
}

function calculateCompressedAssetSizes(path, options) {
  options = options || {};

  if (!options.gzip) {
    return Promise.resolve({});
  }

  return fs.readFile(path).then(data => {
    return gzipSize(data)
  }).then(size => {
    return { gzip: size };
  });
}
