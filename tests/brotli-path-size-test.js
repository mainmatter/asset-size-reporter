const execa = require('execa');
const brotliPathSize = require('../src/brotli-path-size');

const FIXTURE_PATH = `${__dirname}/fixtures`;

const BROTLI_AVAILABLE = isBrotliAvailable();

let tests = [
  ['default/dist/file-inside-dist.js', 357],
  ['default/dist/file-inside-dist.js', 357, 'Z'],
  ['default/dist/file-inside-dist.js', 365, 9],
  ['default/dist/file-inside-dist.js', 383, 1],
  ['default/dist/file-inside-dist.js', 423, 0],
  ['default/dist/text-file-in-dist.txt', 596],
  ['default/dist/foo/nested-file-inside-dist.js', 605],
];

tests.forEach(([fixturePath, expectedSize, level]) => {
  let testName = fixturePath;
  if (level !== undefined) {
    testName += ` (level: ${level})`;
  }

  (BROTLI_AVAILABLE ? test : test.skip)(testName, async () => {
    expect(await brotliPathSize(`${FIXTURE_PATH}/${fixturePath}`, { level })).toEqual(expectedSize);
  });
});

(BROTLI_AVAILABLE ? test : test.skip)('rejects for missing files', async () => {
  try {
    await brotliPathSize(`${FIXTURE_PATH}/does-not-exist.txt`);
    expect(true).toBeFalsy();
  } catch (e) {
    expect(() => { throw e }).toThrowError('No such file or directory');
  }
});

function isBrotliAvailable() {
  try {
    return execa.sync('brotli', ['--version'], { preferLocal: false }).status === 0

  } catch (e) {
    if (e.code === 'ENOENT') {
      return false
    } else {
      throw e;
    }
  }
}
