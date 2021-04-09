const fs = require('fs');
const assert = require('assert');
const should = require('should');
const File = require('gulp-util').File;
const injectCSS = require('../');

describe('gulp-inject-css', function() {
  it('should produce expected file', function(done) {

    const srcFile = new File({
      path: 'test/fixtures/index.html',
      base: 'test/fixtures/',
      contents: fs.readFileSync('test/fixtures/index.html')
    });

    const expectedFile = new File({
      path: 'test/expected/index.html',
      base: 'test/expected/',
      contents: fs.readFileSync('test/expected/index.html')
    });

    const stream = injectCSS();

    stream.on('error', function(err) {
      should.exist(err);
      done(err);
    });

    stream.on('data', function(newFile) {

      should.exist(newFile);
      should.exist(newFile.contents);

      String(newFile.contents).should.equal(String(expectedFile.contents));
      done();
    });

    stream.write(srcFile);
    stream.end();
  });

  it('should error on stream', function(done) {

    const srcFile = new File({
      path: 'test/fixtures/index.html',
      cwd: 'test/',
      base: 'test/fixtures',
      contents: fs.createReadStream('test/fixtures/index.html')
    });

    const stream = injectCSS();

    stream.on('error', function(err) {
      should.exist(err);
      done();
    });

    stream.on('data', function(newFile) {
      newFile.contents.pipe(es.wait(function(err) {
        done(err);
      }));
    });

    stream.write(srcFile);
    stream.end();
  });
});