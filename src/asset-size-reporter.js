const path = require('path');
const globby = require('globby');
const prettyBytes = require('pretty-bytes');

const pathSizes = require('./path-sizes');
const sumSizes = require('./sum-sizes');

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
    let allPaths = Object.keys(result)
      .concat(Object.keys(compare))
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort();

    for (let _path of allPaths) {
      let sizes = result[_path];
      let previous = compare[_path];

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

        output += ` (${prettyBytesDiff(previous.raw, sizes.raw)}`;
        if (previous.gzip !== null && sizes.gzip !== null) {
          output += ` / gzip ${prettyBytesDiff(previous.gzip, sizes.gzip)}`;
        }
        output += `)`;
      }

      console.log(output);
    }
  } else {
    let sum = { raw: 0, gzip: null, brotli: null };

    for (let _path of Object.keys(result)) {
      let sizes = result[_path];

      sum = sumSizes(sum, sizes);

      let output = `${_path}: ${prettyBytes(sizes.raw)}`;
      if (sizes.gzip !== null) {
        output += ` / gzip ${prettyBytes(sizes.gzip)}`;
      }

      console.log(output);
    }

    let output = `Total: ${prettyBytes(sum.raw)}`;
    if (sum.gzip !== null) {
      output += ` / gzip ${prettyBytes(sum.gzip)}`;
    }
    console.log();
    console.log(output);
  }
};

function prettyBytesDiff(a, b) {
  let delta = b - a;
  let pretty = prettyBytes(delta);
  return (delta < 0) ? pretty : `+${pretty}`;
}
