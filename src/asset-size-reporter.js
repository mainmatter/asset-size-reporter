const path = require('path');
const globby = require('globby');

const prettyBytes = require('./pretty-bytes');
const pathSizes = require('./path-sizes');
const reportSizes = require('./report-sizes');
const combineSizes = require('./combine-sizes');

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

    for (let _path of Object.keys(combined)) {
      let sizes = combined[_path].after;
      let previous = combined[_path].before;

      let output = `${_path}: `;
      if (sizes === undefined) {
        // file was deleted
        output += prettyBytes(previous.raw);
        if (previous.gzip !== null) {
          output += ` / gzip ${prettyBytes(previous.gzip)}`;
        }
        output += ` (deleted file)`;

      } else if (previous === undefined) {
        // file was added
        output += prettyBytes(sizes.raw);
        if (sizes.gzip !== null) {
          output += ` / gzip ${prettyBytes(sizes.gzip)}`;
        }
        output += ` (new file)`;

      } else {
        // file was modified
        output += `${prettyBytes(previous.raw)} -> ${prettyBytes(sizes.raw)}`;
        if (previous.gzip !== null || sizes.gzip !== null) {
          let previousGzip = previous.gzip !== null ? prettyBytes(previous.gzip) : '?';
          let currentGzip = sizes.gzip !== null ? prettyBytes(sizes.gzip) : '?';
          output += ` / gzip ${previousGzip} -> ${currentGzip}`;
        }

        output += ` (${prettyBytes(sizes.raw - previous.raw, { signed: true })}`;
        if (previous.gzip !== null && sizes.gzip !== null) {
          output += ` / gzip ${prettyBytes(sizes.gzip - previous.gzip, { signed: true })}`;
        }
        output += `)`;
      }

      console.log(output);
    }
  } else {
    reportSizes(result, { console });
  }
};
