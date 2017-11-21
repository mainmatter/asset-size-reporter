const calculateAssetSize = require('./calculate-asset-size');

module.exports = async function assetSizesAsJSON(paths, options) {
  let result = {};

  for (let path of paths) {
    result[path] = await calculateAssetSize(path, options);
  }

  return result;
};
