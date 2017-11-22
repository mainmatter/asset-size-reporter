const path = require('path');
const globby = require('globby');
const prettyBytes = require('pretty-bytes');

const calculateAssetSize = require('./calculate-asset-size');

module.exports = async ({ patterns, json, compare, gzip, console, cwd }) => {
  if (gzip === undefined) {
    gzip = true;
  }

  if (json) {
    let actualPaths = await globby(patterns, { cwd });

    let result = {};

    for (let _path of actualPaths) {
      let resolvedPath = path.resolve(cwd, _path);
      result[_path] = await calculateAssetSize(resolvedPath, { gzip });
    }

    console.log(JSON.stringify(result, null, 2));

  } else if (compare) {
    let actualPaths = await globby(patterns, { cwd });

    let previousPaths = Object.keys(compare);

    let allPaths = actualPaths
      .concat(previousPaths)
      .filter((value, index, array) => array.indexOf(value) === index)
      .sort();

    for (let _path of allPaths) {
      let size;
      if (actualPaths.indexOf(_path) !== -1) {
        let resolvedPath = path.resolve(cwd, _path);
        size = await calculateAssetSize(resolvedPath, {gzip});
      }

      let previous = compare[_path];

      let output = `${_path}: `;
      if (size === undefined) {
        // file was deleted
        output += prettyBytes(previous.size);
        if ('gzip' in previous) {
          output += ` / gzip ${prettyBytes(previous.gzip)}`;
        }
        output += ` (deleted file)`;

      } else if (previous === undefined) {
        // file was added
        output += prettyBytes(size.size);
        if ('gzip' in size) {
          output += ` / gzip ${prettyBytes(size.gzip)}`;
        }
        output += ` (new file)`;

      } else {
        // file was modified
        output += `${prettyBytes(previous.size)} -> ${prettyBytes(size.size)}`;
        if ('gzip' in previous || 'gzip' in size) {
          let previousGzip = 'gzip' in previous ? prettyBytes(previous.gzip) : '?';
          let currentGzip = 'gzip' in size ? prettyBytes(size.gzip) : '?';
          output += ` / gzip ${previousGzip} -> ${currentGzip}`;
        }

        output += ` (${prettyBytesDiff(previous.size, size.size)}`;
        if ('gzip' in previous && 'gzip' in size) {
          output += ` / gzip ${prettyBytesDiff(previous.gzip, size.gzip)}`;
        }
        output += `)`;
      }

      console.log(output);
    }
  } else {
    let actualPaths = await globby(patterns, { cwd });

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

function prettyBytesDiff(a, b) {
  let delta = b - a;
  let pretty = prettyBytes(delta);
  return (delta < 0) ? pretty : `+${pretty}`;
}
