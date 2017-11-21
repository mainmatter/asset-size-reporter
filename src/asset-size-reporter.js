const path = require('path');
const globby = require('globby');

const calculateAssetSize = require('./calculate-asset-size');

module.exports = async ({ paths, json, console, cwd }) => {
  if (json) {
    let actualPaths = await globby(paths, { cwd });

    let result = {};

    for (let _path of actualPaths) {
      let resolvedPath = path.resolve(cwd, _path);
      result[_path] = await calculateAssetSize(resolvedPath, { gzip: true });
    }

    console.log(JSON.stringify(result, null, 2));
  }
};
