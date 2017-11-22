const path = require('path');
const globby = require('globby');

const pathSizes = require('./path-sizes');

module.exports = async (patterns, { cwd, gzip, brotli }) => {
  let actualPaths = await globby(patterns, { cwd });

  let result = {};
  for (let _path of actualPaths) {
    let resolvedPath = path.resolve(cwd, _path);
    result[_path] = await pathSizes(resolvedPath, { gzip, brotli });
  }

  return result;
};
