'use strict';

const { basename, dirname } = require('path');
const chalk = require('chalk');

const prettyBytes = require('./pretty-bytes');
const sumSizes = require('./sum-sizes');

module.exports = (combined, { console }) => {
  let sumAfter = { raw: 0, gzip: null, brotli: null };
  let sumBefore = { raw: 0, gzip: null, brotli: null };

  for (let path of Object.keys(combined)) {
    let after = combined[path].after;
    let before = combined[path].before;

    if (after !== undefined) {
      sumAfter = sumSizes(sumAfter, after);
    }

    if (before !== undefined) {
      sumBefore = sumSizes(sumBefore, before);
    }

    let output = formatLine(path, before, after);

    console.log(output);
  }

  let output = formatLine('Total', sumBefore, sumAfter);
  console.log();
  console.log(output);
};

function formatLine(path, before, after) {
  let added = before === undefined;
  let deleted = after === undefined;

  let output = path === 'Total'
    ? chalk`{bold Total}{dim :} `
    : formatPathPrefix(path, { deleted });

  if (deleted) {
    // file was deleted
    output += `${prettyBytes(before.raw)}`;
    if (before.gzip !== null) {
      output += ` / gzip ${prettyBytes(before.gzip)}`;
    }
    output += ` (deleted file)`;

    output = chalk.gray(output);

  } else if (added) {
    // file was added
    output += prettyBytes(after.raw);
    if (after.gzip !== null) {
      output += ` / gzip ${prettyBytes(after.gzip)}`;
    }
    output += ` (new file)`;

    output = chalk.blue(output);

  } else {
    // file was modified
    output += prettyBytes(before.raw);
    if (before.raw !== after.raw) {
      output += ` -> ${prettyBytes(after.raw)} (${prettyBytes(after.raw - before.raw, { signed: true })})`;
    }

    if (before.gzip !== null && after.gzip !== null) {
      let previousGzip = before.gzip !== null ? prettyBytes(before.gzip) : '?';
      let currentGzip = after.gzip !== null ? prettyBytes(after.gzip) : '?';
      output += ` / gzip ${previousGzip}`;
      if (before.gzip !== after.gzip) {
        output += ` -> ${currentGzip} (${prettyBytes(after.gzip - before.gzip, { signed: true })})`;
      }
    }

    if (before.raw > after.raw) {
      output = chalk.green(output);
    } else if (before.raw < after.raw) {
      output = chalk.red(output);
    }
  }

  return output;
}

function formatPathPrefix(path, { deleted } = {}) {
  let dir = dirname(path);
  let base = basename(path);
  return chalk`${deleted ? '[' : ''}{dim ${dir}/}${base}${deleted ? ']' : ''}{dim :} `;
}
