const path = require('path');
const report = require('../src/asset-size-reporter');

const FIXTURE_PATH = path.join(__dirname, 'fixtures');

class FakeConsole {
  constructor() {
    this.messages = [];
  }

  log(message) {
    this.messages.push(message);
  }

  get output() {
    return this.messages.join('\n');
  }
}

describe('asset-size-reporter', () => {
  test('reports results as JSON if `json` option is used', async () => {
    let cwd = path.join(FIXTURE_PATH, 'default');

    let paths = [
      'dist/**/*.js',
      '!dist/ignored-*.js',
    ];

    let fakeConsole = new FakeConsole();

    await report({ paths, json: true, cwd, console: fakeConsole });

    let path1 = path.join('dist', 'file-inside-dist.js');
    let path2 = path.join('dist', 'foo', 'nested-file-inside-dist.js');

    expect(JSON.parse(fakeConsole.output)).toEqual({
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
