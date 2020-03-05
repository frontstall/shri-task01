import {
  src, series, dest, parallel, watch,
} from 'gulp';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';
import del from 'del';

const server = browserSync.create();

const reload = (cb) => {
  server.reload();
  cb();
};

const clean = (cb) => del('build', cb);

const html = () => src('src/*.html').pipe(dest('build'));

const css = () => src('src/scss/style.scss')
  .pipe(sass({ outputStyle: 'expanded' }))
  .pipe(dest('build'))
  .pipe(server.stream());

const copy = () => src('src/img/**', { base: 'src' })
  .pipe(dest('build'));

export const build = series(clean, copy, parallel(html, css));

const serve = () => {
  server.init({
    server: 'build',
    notify: false,
    open: true,
    ui: false,
  });

  watch('src/scss/**/*.scss', css);
  watch('src/*.html').on('change', series(build, reload));
  watch('src/img/**', series(build, reload));
};

export const start = series(build, serve);
