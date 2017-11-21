const path = require('path');
const calculateAssetSize = require('../src/calculate-asset-size');

const FIXTURE_PATH = path.join(__dirname, 'fixtures');

describe('calculateAssetSize', () => {
  test('resolves to object containing the file size', async () => {
    let filepath = path.join(FIXTURE_PATH, 'default', 'dist', 'file-inside-dist.js');

    expect(await calculateAssetSize(filepath)).toEqual({
      size: 1855,
    });
  });

  test('supports a `gzip` option', async () => {
    let filepath = path.join(FIXTURE_PATH, 'default', 'dist', 'file-inside-dist.js');

    expect(await calculateAssetSize(filepath, { gzip: true })).toEqual({
      size: 1855,
      gzip: 377,
    });
  });

  test('supports a numeric `gzip` option', async () => {
    let filepath = path.join(FIXTURE_PATH, 'default', 'dist', 'file-inside-dist.js');

    expect(await calculateAssetSize(filepath, { gzip: 1 })).toEqual({
      size: 1855,
      gzip: 395,
    });
  });
});
