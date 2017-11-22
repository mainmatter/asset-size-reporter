const fs = require('fs');
const gzipSize = require('gzip-size');

module.exports = async (path, { level } = {}) => {
  return new Promise((resolve, reject) => {
    let stream = fs.createReadStream(path);
    stream.on('error', reject);
    stream.pipe(gzipSize.stream({ level })).on('gzip-size', resolve);
  });
};
