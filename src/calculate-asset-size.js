const fs = require('fs-extra');

module.exports = function calculateAssetSize(path, options) {
  return fs.stat(path).then(stats => {
    return { size: stats.size };
  });
};
