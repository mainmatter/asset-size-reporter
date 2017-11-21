const path = require('path');
const calculateAssetSize = require('../src/calculate-asset-size');

const FIXTURE_PATH = path.join(__dirname, 'fixtures');

describe('calculateAssetSize', () => {
  test('resolves to object containing the file size', () => {
    let filepath = path.join(FIXTURE_PATH, 'default', 'dist', 'file-inside-dist.js');

    return expect(calculateAssetSize(filepath)).resolves.toEqual({
      size: 1855,
    });
  });

  test('supports a `gzip` option', () => {
    let filepath = path.join(FIXTURE_PATH, 'default', 'dist', 'file-inside-dist.js');

    return expect(calculateAssetSize(filepath, { gzip: true })).resolves.toEqual({
      size: 1855,
      gzip: 377,
    });
  });
});
