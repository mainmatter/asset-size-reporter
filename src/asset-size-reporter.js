const path = require('path');
const globby = require('globby');
const prettyBytes = require('pretty-bytes');

const calculateAssetSize = require('./calculate-asset-size');

module.exports = async ({ paths, json, gzip, console, cwd }) => {
  if (gzip === undefined) {
    gzip = true;
  }

  if (json) {
    let actualPaths = await globby(paths, { cwd });

    let result = {};

    for (let _path of actualPaths) {
      let resolvedPath = path.resolve(cwd, _path);
      result[_path] = await calculateAssetSize(resolvedPath, { gzip });
    }

    console.log(JSON.stringify(result, null, 2));

  } else {
    let actualPaths = await globby(paths, { cwd });

    for (let _path of actualPaths) {
      let resolvedPath = path.resolve(cwd, _path);
      let size = await calculateAssetSize(resolvedPath, { gzip });

      let output = `${_path}: ${prettyBytes(size.size)}`;
      if ('gzip' in size) {
        output += ` / gzip ${prettyBytes(size.gzip)}`;
      }

      console.log(output);
    }
  }
};
