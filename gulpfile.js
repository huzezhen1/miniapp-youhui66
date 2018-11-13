const gulp = require('gulp')
const rename = require('gulp-rename') // 重命名，这里主要是将 *.scss 改成符合小程序要求的 *.wxss
const postcss = require('gulp-postcss') 
const pxtorpx = require('postcss-px2rpx') // px转成rpx，rpx是小程序里面使用的长度单位
const base64 = require('postcss-font-base64') // base64处理，这里主要是用来将字体文件转成base64
const combiner = require('stream-combiner2') // 整合 streams 来处理错误   
const through = require('through2') // 用于处理node的stream
const sourcemaps = require('gulp-sourcemaps')

// minimist是轻量级的命令行参数解析引擎，process.argv 返回一个数组，第一个是node，第二个是所执行的脚本，第三个开始才是传的参数
const argv = require('minimist')(process.argv.slice(2)) 

const htmlmin = require('gulp-htmlmin') // html 文件压缩
const jsonminify = require('gulp-jsonminify') // json 文件压缩

const sass = require('gulp-sass') 
const cssnano = require('gulp-cssnano') // css压缩

const filter = require('gulp-filter') // 过滤器
const jdists = require('gulp-jdists') // 代码块预处理，通过注释
const babel = require('gulp-babel')
const uglify = require('gulp-uglify') // js压缩
const del = require('del')            // 删除
const runSequence = require('run-sequence')   // 同步执行任务，因为gulp的任务几乎都是同时执行，用这个插件来控制需要按照顺序执行的任务

const log = require('fancy-log') // 日志打印工具
const colors = require('ansi-colors') // 控制台颜色工具

const src = './client'
const cloudPath = './server/cloudfunctions'  // 云函数的路径
const dist = './dist'
const isProd = argv.type === 'prod'   // 在执行命令行时后面加上 --type prod 就表示是生产环境

/**
 * 控制台打印错误信息
 */
const handleError = (err) => {
  console.log('\n')
  log(colorsr.red('Error!'))
  log('fileName: ' + colors.red(err.fileName))
  log('lineNumber: ' + colors.red(err.lineNumber))
  log('message: ' + err.message)
  log('plugin: ' + colors.yellow(err.plugin))
}

/**
 * wxml task
 */
gulp.task('wxml', () => {
  return gulp
    .src(`${src}/**/*.wxml`)
    .pipe(
      isProd
        ? htmlmin({
          collapseWhitespace: false, //压缩HTML
          removeComments: true, // 清除HTML注释
          keepClosingSlash: true  // 保留尾部斜杠
        })
        : through.obj()
    )
    .pipe(gulp.dest(dist))
})

/**
 * wxss task
 * 1. px转rpx
 * 2, webfont转base64
 * 3. 重命名后缀为.wxss
 */
gulp.task('wxss', () => {
  const combined = combiner.obj([
    gulp.src(`${src}/**/*.{scss, wxss}`),
    sass().on('error', sass.logError),  // 编译sass并监听报错
    postcss([pxtorpx(), base64()]), // px转rpx，base64处理
    isProd
    ? cssnano({
        autoprefixer: false,  // 关闭自动加前缀，因为微信开发者工具可以选择自动加上
        discardComments: { removeAll: true }  // 移除注释
      })
    : through.obj(),
    rename((path) => (path.extname = '.wxss')), // 重命名处理
    gulp.dest(dist)
  ])
  combined.on('error', (e) => handleError)
})

/**
 * js task
 * 加入 sourcemap
 * ES6/7 转成 ES5
 */
gulp.task('js', () => {
  const f = filter((file) => !/mock/.test(file.path))
  gulp
    .src(`${src}/**/*.js`)
    .pipe(isProd ? f : through.obj())
    .pipe(
      isProd
        ? jdists({
          trigger: 'prod'
        })
        : jdists({
          trigger: 'dev'
        })
    )
    .pipe(isProd ? through.obj() : sourcemaps.init())
    .pipe(
      babel({
        presets: ['env']
      })
    )
    .pipe(
      isProd
        ? uglify({
          compress: true
        })
        : through.obj()
    )
    .pipe(isProd ? through.obj() : sourcemaps.write('./'))
    .pipe(gulp.dest(dist))
})

/**
 * json task
 */
gulp.task('json', () => {
  return gulp
    .src(`${src}/**/*.json`)
    .pipe((isProd ? jsonminify() : through.obj()))
    .pipe(gulp.dest(dist))
})

/**
 * images task
 * 不用处理，直接release到目标目录
 */
gulp.task('images', () => {
  return gulp
    .src(`${src}/images/**`)
    .pipe(gulp.dest(`${dist}/images`))
})

/**
 * wxs task
 * 不用处理，直接release到目标目录
 */
gulp.task('wxs', () => {
  return gulp
    .src(`${src}/**/*.wxs`)
    .pipe(gulp.dest(dist))
})

/**
 * 监听
 * gulp.watch 监听到第一个参数的文件发生变化，就自动执行第二个参数指定的task
 */
gulp.task('watch', () => {
  ['wxml', 'wxss', 'js', 'json', 'wxs'].forEach((v) => {
    gulp.watch(`${src}/**/*.${v}`, [v])
  })
  gulp.watch(`${src}/**/*`, ['images'])
  gulp.watch(`${src}/**/*.scss`, ['wxss'])
})

/**
 * 清除旧包
 */
gulp.task('clean', () => {
  return del(['./dist/**'])
})

/**
 * 小程序云函数的一些处理
 */
gulp.task('cloud', () => {
  return gulp
    .src(`${cloudPath}/**`)
    .pipe(
      isProd
        ? jdists({
          trigger: 'prod'
        })
        : jdists({
          trigger: 'dev'
        })
    )
    .pipe(gulp.dest(`${dist}/cloudfunctions`))
})

/**
 * 云函数的监听
 */
gulp.task('watch:cloud', () => {
  gulp.watch(`${cloudPath}/**`, ['cloud'])
})

/**
 * 开发环境下云函数的处理
 */
gulp.task('cloud:dev', () => {
  runSequence('cloud', 'watch:cloud')
})

/**
 * 开发环境下的task
 */
gulp.task('dev', ['clean'], () => {
  runSequence('json', 'images', 'wxml', 'wxss', 'js', 'wxs', 'cloud:dev', 'watch')
})

/**
 * 生产环境下的task
 */
gulp.task('build', ['clean'], () => {
  runSequence('json', 'images', 'wxml', 'wxss', 'js', 'wxs', 'cloud')
})