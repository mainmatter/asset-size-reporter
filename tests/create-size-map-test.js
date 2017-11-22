const createSizeMap = require('../src/create-size-map');

const FIXTURE_PATH = `${__dirname}/fixtures`;

test('`default` fixture: JS files in `dist`', async () => {
  let cwd = `${FIXTURE_PATH}/default`;

  let patterns = [
    'dist/**/*.js',
    '!dist/ignored-*.js',
  ];

  let sizeMap = await createSizeMap(patterns, { gzip: true, cwd });

  expect(sizeMap).toEqual({
    'dist/file-inside-dist.js': { raw: 1855, gzip: 377, brotli: null },
    'dist/foo/nested-file-inside-dist.js': { raw: 3075, gzip: 636, brotli: null },
  });
});
