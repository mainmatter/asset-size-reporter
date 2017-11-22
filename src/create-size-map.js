const { resolve } = require('path');
const globby = require('globby');

const pathSizes = require('./path-sizes');

module.exports = async (patterns, { cwd, gzip, brotli } = {}) => {
  let paths = await globby(patterns, { cwd });

  let result = {};
  for (let path of paths) {
    let resolvedPath = resolve(cwd, path);
    result[path] = await pathSizes(resolvedPath, { gzip, brotli });
  }

  return result;
};
