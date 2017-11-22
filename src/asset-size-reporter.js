const path = require('path');
const globby = require('globby');

const prettyBytes = require('./pretty-bytes');
const pathSizes = require('./path-sizes');
const reportSizes = require('./report-sizes');
const combineSizes = require('./combine-sizes');
const reportComparedSizes = require('./report-compared-sizes');

module.exports = async ({ patterns, json, compare, gzip, console, cwd }) => {
  if (gzip === undefined) {
    gzip = true;
  }

  let actualPaths = await globby(patterns, { cwd });

  let result = {};

  for (let _path of actualPaths) {
    let resolvedPath = path.resolve(cwd, _path);
    result[_path] = await pathSizes(resolvedPath, { gzip });
  }

  if (json) {
    console.log(JSON.stringify(result, null, 2));

  } else if (compare) {
    let combined = combineSizes(compare, result);
    reportComparedSizes(combined, { console });

  } else {
    reportSizes(result, { console });
  }
};
