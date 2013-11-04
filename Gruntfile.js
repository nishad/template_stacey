module.exports = function(grunt) {

	var banner_string = '/*! <%= pkg.name %> - <%= pkg.url %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd, h:MM:ss TT") %> */';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// grunt-contrib-watch
		watch: {
			// watches js from the concat task
			scripts: {
				files: ['<%= concat.dist.src %>'],
				// run concat and minify
				tasks: ['concat', 'uglify'],
				options: {
					spawn: false
				},
			},
			// watches any scss files in src/css/
			styles: {
				files: ['public/src/css/**/*.scss'],
				// run compass and minify
				tasks: ['compass', 'cssmin'],
				options: {
					spawn: false
				},
			}
		},
		// process sass files with compass using config
		compass: {
			dist: {
				options: {
					sassDir: 'public/src/css',
			        cssDir: 'public/dist/css',
			        imagesDir: 'public/src/img',
			        javascriptsDir: 'public/src/js',
			        fontsDir: 'public/src/fonts',
			        outputStyle: 'expanded',
				}
			}
		},
		// minify css
		cssmin: {
			options: {
				banner: banner_string
			},
			minify: {
				expand: true,
				cwd: 'public/dist/css/',
				src: ['*.css', '!*.min.css'],
				dest: 'public/dist/css/',
				ext: '.min.css'
			}
		},
		// concat js
		concat: {
			dist: {
				src: ['public/src/js/plugins.js', 'public/src/js/app.js'],
				dest: 'public/dist/js/<%= pkg.name %>.js'
			}
		},
		// lint js
		jshint: {
			beforeconcat: ['public/src/js/app.js']
		},
		// minify js
		uglify: {
			options: {
				banner: banner_string
			},
			dist: {
				files: {
					'public/dist/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		// replace variable to change environment
		replace: {
			dist: {
				options: {
					variables: {
						'env: dev': 'env: dist'
					},
					prefix: ''
				},
				files: [
					{expand: true, flatten: true, src: ['content/_shared.yml'], dest: 'content/'}
				]
			},
			dev: {
				options: {
					variables: {
						'env: dist': 'env: dev'
					},
					prefix: ''
				},
				files: [
					{expand: true, flatten: true, src: ['content/_shared.yml'], dest: 'content/'}
				]
			}
		}
	});

	// load plugins
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-replace');

	// the default task can be run just by typing "grunt" on the command line
	grunt.registerTask('default', ['compass', 'jshint', 'concat', 'replace:dev']);
	grunt.registerTask('dist', ['compass', 'cssmin', 'concat', 'uglify', 'replace:dist']);

}
