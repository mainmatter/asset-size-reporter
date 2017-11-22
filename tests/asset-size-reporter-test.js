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
  describe('text reporter', () => {
    test('reports results as text by default', async () => {
      let cwd = path.join(FIXTURE_PATH, 'default');

      let patterns = [
        'dist/**/*.js',
        '!dist/ignored-*.js',
      ];

      let fakeConsole = new FakeConsole();

      await report({ patterns, cwd, console: fakeConsole });

      let path1 = path.join('dist', 'file-inside-dist.js');
      let path2 = path.join('dist', 'foo', 'nested-file-inside-dist.js');

      expect(fakeConsole.messages).toEqual([
        `${path1}: 1.85 kB / gzip 377 B`,
        `${path2}: 3.08 kB / gzip 636 B`,
      ]);
    });

    test('supports `gzip: false`', async () => {
      let cwd = path.join(FIXTURE_PATH, 'default');

      let patterns = [
        'dist/**/*.js',
        '!dist/ignored-*.js',
      ];

      let fakeConsole = new FakeConsole();

      await report({ patterns, cwd, gzip: false, console: fakeConsole });

      let path1 = path.join('dist', 'file-inside-dist.js');
      let path2 = path.join('dist', 'foo', 'nested-file-inside-dist.js');

      expect(fakeConsole.messages).toEqual([
        `${path1}: 1.85 kB`,
        `${path2}: 3.08 kB`,
      ]);
    });
  });

  describe('JSON reporter', () => {
    test('reports results as JSON if `json` option is used', async () => {
      let cwd = path.join(FIXTURE_PATH, 'default');

      let patterns = [
        'dist/**/*.js',
        '!dist/ignored-*.js',
      ];

      let fakeConsole = new FakeConsole();

      await report({ patterns, json: true, cwd, console: fakeConsole });

      let path1 = path.join('dist', 'file-inside-dist.js');
      let path2 = path.join('dist', 'foo', 'nested-file-inside-dist.js');

      expect(JSON.parse(fakeConsole.output)).toEqual({
        [path1]: { size: 1855, gzip: 377 },
        [path2]: { size: 3075, gzip: 636 },
      });
    });

    test('supports `gzip: false`', async () => {
      let cwd = path.join(FIXTURE_PATH, 'default');

      let patterns = [
        'dist/**/*.js',
        '!dist/ignored-*.js',
      ];

      let fakeConsole = new FakeConsole();

      await report({ patterns, json: true, gzip: false, cwd, console: fakeConsole });

      let path1 = path.join('dist', 'file-inside-dist.js');
      let path2 = path.join('dist', 'foo', 'nested-file-inside-dist.js');

      expect(JSON.parse(fakeConsole.output)).toEqual({
        [path1]: { size: 1855 },
        [path2]: { size: 3075 },
      });
    });
  });

  describe('compare reporter', () => {
    test('reports results as text by default', async () => {
      let cwd = path.join(FIXTURE_PATH, 'default');

      let patterns = [
        'dist/**/*.{js,txt}',
        '!dist/ignored-*.js',
      ];

      let path1 = path.join('dist', 'file-inside-dist.js');
      let path2 = path.join('dist', 'foo', 'nested-file-inside-dist.js');
      let path3 = path.join('dist', 'text-file-inside-dist.js');
      let path4 = path.join('dist', 'deleted-file-inside-dist.js');

      let compare = {
        [path1]: { size: 1275, gzip: 144 },
        [path2]: { size: 32075, gzip: 7636 },
        [path4]: { size: 4242, gzip: 42 },
      };

      let fakeConsole = new FakeConsole();

      await report({ patterns, compare, cwd, console: fakeConsole });

      expect(fakeConsole.output).toMatchSnapshot();
    });

    test('supports `gzip: false`', async () => {
      let cwd = path.join(FIXTURE_PATH, 'default');

      let patterns = [
        'dist/**/*.js',
        '!dist/ignored-*.js',
      ];

      let path1 = path.join('dist', 'file-inside-dist.js');
      let path2 = path.join('dist', 'foo', 'nested-file-inside-dist.js');

      let compare = {
        [path1]: { size: 1275 },
        [path2]: { size: 32075 },
      };

      let fakeConsole = new FakeConsole();

      await report({ patterns, compare, gzip: false, cwd, console: fakeConsole });

      expect(fakeConsole.output).toMatchSnapshot();
    });
  });
});
