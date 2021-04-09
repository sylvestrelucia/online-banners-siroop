# file-fixture

Generate temporary file/directory names and temporary file/directory structures for writing tests.

## Installation

    npm install --save file-fixture

## API / examples

Preamble:

    var fixture = require('file-fixture');

`.dirname()`: create a temporary directory

    var tmpDir = fixture.dirname();

Returns the full path to the file.

`.filename(opts)`: generate a temporary file name.

    var tmpFile = fixture.filename({ ext: '.js' });

Returns the full path to the directory.

Use the optional `{ ext: '...' }` argument if you want a specific extension.

`.dir(spec)`: generate a temporary directories with specific file names and contents:

    var tmpDir = fixture.dir({
      'index.js': 'module.exports = require("./foo/second.js");',
      'foo/second.js': 'module.exports = true;'
    });

Note how the keys can also contain full paths.

Returns the path to root of the directory. The directory will contain two files with the given file names and content.

You can also pass an array of strings as the content - it will be joined with newlines before being written:

    var tmpDir = fixture.dir({
      'index.html': [
        '<html>',
        '  <p>Hello World</p>',
        '</html>'
      ]
    });


`.file(data, opts)`: write a temporary file with a specific content:

    var tmpFile = fixture.file('<html>Hello world</html>', { ext: '.html'});

or:

    var tmpFile = fixture.file([
      '<html>',
      '  Hello world',
      '</html>'
    ], { ext: '.html'});

Returns the path to the file.

## Creating values in a subdirectory under /tmp

If you want to ensure that you start with a pristine directory (e.g. `/tmp/ab12ff/` rather than just `/tmp/`), create a new instance of the fixture generator. This applies a prefix to the directories which ensures that things like `fs.readdir` on `fixture.file()` works correctly.

For example:

    var Fixture = require('file-fixture'),
        fixture = new Fixture();

    var tmpFile = fixture.filename();
    console.log(tmpFile);
