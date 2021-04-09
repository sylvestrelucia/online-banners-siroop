var os = require('os'),
    fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    rimraf = require('rimraf');

var tmpDir = (os.tmpdir || os.tmpDir)();

function Fixture() {
  this.root = this.filename({
    path: tmpDir
  });
  fs.mkdirSync(this.root);
}

Fixture.filename = function(opts) {
  var filename,
      basePath = (opts && opts.path ? opts.path : tmpDir);
  do {
    filename = path.normalize(basePath + '/' +
      Math.random().toString(36).substring(2) +
      (opts && opts.ext ? opts.ext : ''));
  } while(fs.existsSync(filename));
  return filename;
};

Fixture.file = function(data, opts) {
  var filename = Fixture.filename(opts);
  fs.writeFileSync(filename, (Array.isArray(data) ? data.join('\n') : data));
  return filename;
};

Fixture.dirname = function(opts) {
  var filename = Fixture.filename(opts);
  fs.mkdirSync(filename);
  return filename;
};

Fixture.dir = function(spec, opts) {
  // generate a new directory
  var outDir = Fixture.filename(opts);
  fs.mkdirSync(outDir);
  // create each file under the directory
  Object.keys(spec).forEach(function(name) {
    var data = spec[name];
    var fullname = path.normalize(outDir + '/' + name);

    if (path.dirname(fullname) != outDir) {
      mkdirp.sync(path.dirname(fullname));
    }
    fs.writeFileSync(fullname, (Array.isArray(data) ? data.join('\n') : data));
  });
  return outDir;
};

['filename',  'dirname'].forEach(function(key) {
  Fixture.prototype[key] = function(opts) {
    if(!opts) { opts = {}; }
    if(!opts.path) { opts.path = this.root; }
    return Fixture[key](opts);
  };
});

['dir',  'file'].forEach(function(key) {
  Fixture.prototype[key] = function(first, opts) {
    if(!opts) { opts = {}; }
    if(!opts.path) { opts.path = this.root; }
    return Fixture[key](first, opts);
  };
});

Fixture.prototype.clean = function() {
  // ensure that this is under os.tmpdir()
  if (this.root.substr(tmpDir.length) == tmpDir) {
    rimraf.sync(this.root);
  }
};

module.exports = Fixture;
