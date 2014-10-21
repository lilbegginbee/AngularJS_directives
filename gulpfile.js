var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var path = require('path');
var clean = require('gulp-clean');
var glob = require('glob');
var fs = require('fs');
var docular = require('docular');

var plumber = require('./front/build/gulp/plugins/plumber');

gulp.task('css', function() {
	var dir = 'assets/templates/site/css/apps';
	var stream = gulp.src('**/*.scss', {cwd: dir});
	if (!gutil.env['strict-errors']) {
		stream = stream.pipe(plumber())
			.pipe(sass({errLogToConsole: true}));
	}
	else {
		stream = stream.pipe(sass());
	}
	if (gutil.env['css-autoprefix'] || typeof gutil.env['css-autoprefix'] == 'undefined') {
		stream = stream.pipe(autoprefixer('> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'Explorer 9', 'iOs 6'));
	}
	if (gutil.env['css-min'] || gutil.env['all-min']) {
		stream = stream.pipe(minifycss());
	}
	return stream.pipe(gulp.dest('', {cwd: dir}));
});



var taskJsAppFactory = function(app, files) {
	gulp.task('js.apps.'+app, function() {
		var stream = gulp.src(files, {cwd: 'assets/templates/site/js/modules'});
		if (!gutil.env['strict-errors']) {
			stream = stream.pipe(plumber());
		}
		stream = stream.pipe(concat(app+'.js'));
		if (gutil.env['js-min'] || gutil.env['all-min']) {
			stream = stream.pipe(uglify());
		}
		return stream.pipe(gulp.dest('', {cwd: 'assets/templates/site/js/apps'}));
	});
};

var ngTemplates = require('./front/build/gulp/plugins/ngTemplates');

var taskJsNgAppFactory = function(app) {
	gulp.task('js.ng.apps.'+app, function() {
		var files = ['module.prefix', 'module.js', '**/*.js', 'module.suffix'];
		if (!gutil.env['js-ng-debug'] && !gutil.env['js-debug']) {
			files.push('!debug/**/*');
		}
		var cwd = 'assets/templates/site/js/modules/ng/apps';
		var stream = gulp.src(files, {cwd: path.join(cwd, app)});
		if (!gutil.env['strict-errors']) {
			stream = stream.pipe(plumber());
		}
		return stream.pipe(concat(app+'.compiled.js'))
            .pipe(ngTemplates({
				cwd: path.join(cwd, app),
				path: 'templates',
				module: 'mif.apps.'+app,
				context: require('./front/build/ngTemplateContext')
			}))
			.pipe(gulp.dest('', {cwd: cwd}));
	});
};

var taskJsNgModuleFactory = function(module) {
	gulp.task('js.ng.modules.'+module, function() {
		var files = ['module.prefix', 'module.js', '**/*.js', 'module.suffix'];
		if (!gutil.env['js-ng-debug'] && !gutil.env['js-debug']) {
			files.push('!debug/**/*');
		}
		var cwd = 'assets/templates/site/js/modules/ng/modules';
		var stream = gulp.src(files, {cwd: path.join(cwd, module)});
		if (!gutil.env['strict-errors']) {
			stream = stream.pipe(plumber());
		}
		return stream.pipe(concat(module+'.compiled.js'))
            .pipe(ngTemplates({
				cwd: path.join(cwd, module),
				path: 'templates',
				module: 'mif.'+module,
				context: require('./front/build/ngTemplateContext')
			}))
			.pipe(gulp.dest('', {cwd: cwd}));
	});
};

taskJsNgAppFactory('default');
taskJsNgAppFactory('newBook');
taskJsNgAppFactory('liga');
taskJsNgAppFactory('account');
taskJsNgAppFactory('search');
taskJsNgModuleFactory('common');
taskJsNgModuleFactory('extensions');

gulp.task('js.ng', [
	'js.ng.apps.default',
	'js.ng.apps.newBook',
	'js.ng.apps.liga',
	'js.ng.apps.account',
	'js.ng.apps.search',
	'js.ng.modules.common',
	'js.ng.modules.extensions'
]);

glob('**/*.json', {cwd: 'assets/templates/site/js/apps/', sync: true},  function(err, files) {
	if (err) return;

	var deps = [];
	files.forEach(function(file) {
		var app = path.join( path.dirname(file), path.basename(file, path.extname(file)) );
		try {
			taskJsAppFactory(
				app,
				JSON.parse(fs.readFileSync(path.join('assets/templates/site/js/apps/', file), {encoding: 'utf8'}))
			);
		}
		catch (err) {
			console.error(gutil.colors.red(err.message));
		}
		deps.push('js.apps.'+app);
	});

	gulp.task('js.apps', deps);
});


gulp.task('js', ['js.ng'], function() {
	gulp.start('js.apps');
});

gulp.task('watch', function() {
	if (!gutil.env.watch) {
		return;
	}
	gulp.watch('**/*.scss', {cwd: 'assets/templates/site/css'}, ['css']);

	gulp.watch(['**/*', '!**/*.compiled.*'], {cwd: 'assets/templates/site/js/modules/ng'}, ['js.ng']);
	gulp.watch(['**/*', '!**/ng/**', '**/ng/*/*.compiled.*'], {cwd: 'assets/templates/site/js/modules'}, ['js.apps']);
	gulp.watch(['**/*.json'], {cwd: 'assets/templates/site/js/apps'}, ['js']);
});

gulp.task('build', ['css', 'js', 'watch']);





gulp.task('clean.build.js.apps', function() {
	return gulp.src('assets/templates/site/js/apps/**/*.js')
		.pipe(clean());
});
gulp.task('clean.build.js.ng', function() {
	return gulp.src('assets/templates/site/js/modules/ng/*/*.compiled.js')
		.pipe(clean());
});
gulp.task('clean.build.js', ['clean.build.js.apps', 'clean.build.js.ng']);
gulp.task('clean.build.css', function() {
	return gulp.src('assets/templates/site/css/apps/**/*.css')
		.pipe(clean());
});

gulp.task('clean', function() {
	if (gutil.env.build || gutil.env['build-css']) {
		gulp.start('clean.build.css');
	}
	if (gutil.env.build || gutil.env['build-js']) {
		gulp.start('clean.build.js');
	}
});




var taskImagesUnMinFactory = require('./front/build/gulp/tasks/imagesUnMin');
var taskImagesMinFactory = require('./front/build/gulp/tasks/imagesMin');

gulp.task('images.unmin', taskImagesUnMinFactory());
gulp.task('images.min', taskImagesMinFactory());

gulp.task('images', function() {
	if (gutil.env['min']) {
		gulp.start('images.min');
	}
	else if (gutil.env['unmin']) {
		gulp.start('images.unmin');
	}
});

/**
 * Автогенерация документация для FrontEnd
 */
gulp.task('generate-doc', function() {

	options = {
		baseUrl: 'http://frontdoc.local/',
		docAPIOrder : ['doc', 'angular'],
		groups: [
			{
				groupTitle: 'MIF Front Docs',
				groupId: 'mif',
				sections: [
					{
						id: "common",
						title:"Common module",
						scripts: ["assets/templates/site/js/modules/ng/modules/common"]
					},
					{
						id: "extensions",
						title:"Extension module",
						scripts: ["assets/templates/site/js/modules/ng/modules/extensions"]
					}
				]
			}
		]
	};

	docular.genDocs(options);
});

