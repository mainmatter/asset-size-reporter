const globSizes = require('./glob-sizes');
const reportSizes = require('./report-sizes');
const combineSizes = require('./combine-sizes');
const reportComparedSizes = require('./report-compared-sizes');

module.exports = async ({ patterns, json, compare, gzip, brotli, console, cwd }) => {
  if (gzip === undefined) {
    gzip = true;
  }

  let result = await globSizes(patterns, { gzip, brotli, cwd });

  if (json) {
    console.log(JSON.stringify(result, null, 2));

  } else if (compare) {
    let combined = combineSizes(compare, result);
    reportComparedSizes(combined, { console });

  } else {
    reportSizes(result, { console });
  }
};
