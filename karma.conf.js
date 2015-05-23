// Karma configuration
// Generated on Wed Oct 22 2014 13:02:49 GMT-0500 (Central Daylight Time)

module.exports = function(config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [
			'dist/vendor/vendor.js',
			'app/app.js',
			'app/common/services/*.js',
			'app/common/directives/*.js',
			'app/partials/**/*.js',
			'app/test/unit/**/*.js',
			'app/template/**/*.html'
		],

		// list of files to exclude
		exclude: [
		],

		ngHtml2JsPreprocessor: {
			stripPrefix: 'app/',
			//prependPrefix: 'template/ngCart/',
			moduleName: 'templates'
		},

		plugins : [
			'karma-coverage',
			'karma-phantomjs-launcher',
			'karma-jasmine',
			'karma-ng-html2js-preprocessor'
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'app/partials/**/*.js': 'coverage',
			'app/common/**/*.js': 'coverage',
			'app/template/**/*.html': ['ng-html2js']
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['progress', 'coverage'],

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['PhantomJS'],

		junitReporter: {
			outputFile: 'TEST-shopping_cart.unit_test_report.xml',
			suite: 'shopping_cart'
		},

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,

		coverageReporter: {
			type: 'lcov',
			dir: 'coverage'
		}
	});
};

