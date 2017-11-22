const prettyBytes = require('pretty-bytes');

const sumSizes = require('./sum-sizes');

module.exports = (sizes, { console }) => {
  let sum = { raw: 0, gzip: null, brotli: null };

  for (let path of Object.keys(sizes)) {
    let fileSizes = sizes[path];

    sum = sumSizes(sum, fileSizes);

    let output = `${path}: ${prettyBytes(fileSizes.raw)}`;
    if (fileSizes.gzip !== null) {
      output += ` / gzip ${prettyBytes(fileSizes.gzip)}`;
    }

    console.log(output);
  }

  let output = `Total: ${prettyBytes(sum.raw)}`;
  if (sum.gzip !== null) {
    output += ` / gzip ${prettyBytes(sum.gzip)}`;
  }
  console.log();
  console.log(output);
};
