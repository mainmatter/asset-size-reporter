const path = require('path');
const assetSizesAsJSON = require('../src/asset-sizes-as-json');

const FIXTURE_PATH = path.join(__dirname, 'fixtures');

describe('assetSizesAsJSON', () => {
  test('resolves to JSON object with sizes for each path', async () => {
    let path1 = path.join(FIXTURE_PATH, 'default', 'dist', 'file-inside-dist.js');
    let path2 = path.join(FIXTURE_PATH, 'default', 'dist', 'foo', 'nested-file-inside-dist.js');

    let paths = [path1, path2];

    expect(await assetSizesAsJSON(paths, { gzip: true })).toEqual({
      [path1]: {
        size: 1855,
        gzip: 377,
      },
      [path2]: {
        size: 3075,
        gzip: 636,
      },
    });
  });
});
