# gulp-inject-css

[![Dependency Status](https://img.shields.io/david/alik0211/gulp-inject-css.svg?label=deps&style=flat-square)](https://david-dm.org/alik0211/gulp-inject-css)
[![devDependency Status](https://img.shields.io/david/dev/alik0211/gulp-inject-css.svg?label=devDeps&style=flat-square)](https://david-dm.org/alik0211/gulp-inject-css?type=dev)

Inject css file to html

## Install

```shell
npm install gulp-inject-css --save-dev
```

## Example

app/css/main.css
```css
* { box-sizing: border-box; }
```

app/index.html
```html
<!-- inject-css css/main.css -->
```

gulpfile.js
```javascript
const gulp = require('gulp');
const injectCSS = require('gulp-inject-css');

gulp.task('build', function() {
  gulp.src('app/*.html')
    .pipe(injectCSS())
    .pipe(gulp.dest('build'));
});
```

Result(build/index.html):
```html
<style>
* { box-sizing: border-box; }
</style>
```