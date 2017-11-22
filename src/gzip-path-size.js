const fs = require('fs');
const gzipSize = require('gzip-size');

module.exports = async (path, { level } = {}) => gzipSize.file(path, { level });
