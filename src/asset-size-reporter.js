const path = require('path');
const globby = require('globby');
const prettyBytes = require('pretty-bytes');

const pathSizes = require('./path-sizes');

module.exports = async ({ patterns, json, compare, gzip, console, cwd }) => {
  if (gzip === undefined) {
    gzip = true;
  }

  if (json) {
    let actualPaths = await globby(patterns, { cwd });

    let result = {};

    for (let _path of actualPaths) {
      let resolvedPath = path.resolve(cwd, _path);
      result[_path] = await pathSizes(resolvedPath, { gzip });
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
      let sizes;
      if (actualPaths.indexOf(_path) !== -1) {
        let resolvedPath = path.resolve(cwd, _path);
        sizes = await pathSizes(resolvedPath, {gzip});
      }

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
    let actualPaths = await globby(patterns, { cwd });

    for (let _path of actualPaths) {
      let resolvedPath = path.resolve(cwd, _path);
      let sizes = await pathSizes(resolvedPath, { gzip });

      let output = `${_path}: ${prettyBytes(sizes.raw)}`;
      if (sizes.gzip !== null) {
        output += ` / gzip ${prettyBytes(sizes.gzip)}`;
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
