'use strict';

const prettyBytes = require('./pretty-bytes');

module.exports = (combined, { console }) => {
  for (let _path of Object.keys(combined)) {
    let after = combined[_path].after;
    let before = combined[_path].before;

    let output = `${_path}: `;
    if (after === undefined) {
      // file was deleted
      output += `[${prettyBytes(before.raw)}`;
      if (before.gzip !== null) {
        output += ` / gzip ${prettyBytes(before.gzip)}`;
      }
      output += `] (deleted file)`;

    } else if (before === undefined) {
      // file was added
      output += prettyBytes(after.raw);
      if (after.gzip !== null) {
        output += ` / gzip ${prettyBytes(after.gzip)}`;
      }
      output += ` (new file)`;

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
    }

    console.log(output);
  }
};
