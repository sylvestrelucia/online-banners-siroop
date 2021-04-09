const fs = require('fs');
const through = require('through2').obj;
const PluginError = require('gulp-util').PluginError;

const PLUGIN_NAME = 'gulp-inject-css';

module.exports = function() {
  'use strict';

  const PATTERN = /<\!--\s*inject-css\s*(.*?)\s*-->/gi;

  function styleInject(file, enc, callback) {

    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Stream not supported'));
      return callback();
    }

    if (file.isBuffer()) {
      let contents = String(file.contents);

      contents = contents.replace(PATTERN, function(match, src) {
        return '<style>\n' + fs.readFileSync(file.base + src) + '\n</style>';
      });

      file.contents = new Buffer(contents);
      this.push(file);
      return callback();
    }

    return callback();
  }

  return through(styleInject);
};