'use strict';

module.exports = {
	client: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css',
				'public/lib/normalize-css/normalize.css',
				'public/lib/components-font-awesome/css/font-awesome.min.css',
				'public/lib/nouislider/distribute/nouislider.css',
				'public/lib/ion-rangeslider/css/ion.rangeSlider.min.css',
				'public/lib/datatables.net-dt/css/jquery.dataTables.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/bootstrap/dist/js/bootstrap.min.js',
				'public/lib/bootstrap-datepicker/dist/js/boostrap-datepicker.min.js',
				'public/lib/angular/angular.min.js',
				'public/lib/angular-sanitize/angular-sanitize.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
				'public/lib/nouislider/distribute/nouislider.js',
				'public/lib/ion-rangeslider/js/ion.rangeSlider.min.js',
				'public/lib/datatables.net/js/jquery.dataTables.js'
			]
		},
		css: [
			'modules/*/client/css/*.css',
		],
		less: [
			'modules/*/client/less/*.less'
		],
		sass: [
			'modules/*/client/scss/*.scss'
		],
		js: [
			'modules/core/client/app/config.js',
			'modules/core/client/app/init.js',
			'modules/*/client/*.js',
			'modules/*/client/**/*.js'
		],
		img: [
			'modules/**/*/img/*.jpg',
			'modules/**/*/img/*.png',
			'modules/**/*/img/*.gif',
			'modules/**/*/img/*.svg'
		],
		views: ['modules/*/client/views/**/*.html'],
		templates: ['build/templates.js']
	},
	server: {
		gruntConfig: ['gruntfile.js'],
		gulpConfig: ['gulpfile.js'],
		allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
		routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
		views: ['modules/*/server/views/*.html']
	}
};
