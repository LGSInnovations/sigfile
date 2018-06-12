'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            js: {
                options: {
                    jshintrc: 'js/.jshintrc'
                },
                src: ['js/**/*.js', 'test/tests.js']
            },
        },
        qunit: {
            options: { '--web-security': 'no', '--local-to-remote-url-access': 'yes' },
            all: ['test/passfail.html']
        },
        'mochaTest': {
          test: {
            options: {
            },
            src: ['test/node-test.js']
          }
        },
        'closure-compiler': {
            bluefile_debug: {
                closurePath: 'support/google-closure-compiler',
                js: 'js/bluefile.js',
                jsOutputFile: 'dist/bluefile-debug.js',
		maxBuffer: 500,
                options: {
                    formatting: 'PRETTY_PRINT',
                    compilation_level: 'WHITESPACE_ONLY'
                }
            },
            matfile_debug: {
                closurePath: 'support/google-closure-compiler',
                js: 'js/matfile.js',
                jsOutputFile: 'dist/matfile-debug.js',
		maxBuffer: 500,
                options: {
                    formatting: 'PRETTY_PRINT',
                    compilation_level: 'WHITESPACE_ONLY'
                }
            },
            bluefile_minimized: {
                closurePath: 'support/google-closure-compiler',
                js: 'js/bluefile.js',
                jsOutputFile: 'dist/bluefile-minimized.js',
		maxBuffer: 500,
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS'
                }
            },
            matfile_minimized: {
                closurePath: 'support/google-closure-compiler',
                js: 'js/matfile.js',
                jsOutputFile: 'dist/matfile-minimized.js',
		maxBuffer: 500,
                options: {
                    compilation_level: 'SIMPLE_OPTIMIZATIONS'
                }
            }
        },
        jsdoc: {
            sigfile: {
                src: ['js/*.js'],
                options: {
                    destination: 'doc',
                    template: 'docstrap-master/template',
                    configure: 'docstrap-master/conf.json'
                }
            }
        },
        clean: {
            build: ["dist/**/*", "!dist/*.zip"],
            doc: ["doc/**/*", "!doc/*.png"]
        },
        compress: {
            main: {
                options: {
                    archive: "dist/sigfile-<%= pkg.version %>-<%= grunt.template.today('yyyy-mm-dd') %>.zip",
                },
                files: [
                    {expand: true, cwd: 'dist/', src: ['*-debug.js'], dest: 'sigfile-<%= pkg.version %>'},
                    {expand: true, cwd: 'dist/', src: ['*-minimized.js'], dest: 'sigfile-<%= pkg.version %>'},
                    {src: ['doc/**/*'], dest: 'sigfile-<%= pkg.version %>'}
                ]
            }
        },
        replace: {
            version: {
                src: ["dist/*.js"],
                overwrite: true,
                replacements: [{
                    from: /version-PLACEHOLDER/g,
                    to: "<%= pkg.version %>",
                }],
            },
        },
        browserify: {
            bluefile: {
                src: 'js/sigfile.js',
                dest: 'dist/sigfile.js',
                options: {
                    browserifyOptions: {
                        standalone: 'sigfile'
                    }
                }
            },
        },
        jsbeautifier: {
            check: {
                // Only check a subset of the files
                src: [
                        'js/bluefile.js',
                        'js/matfile.js',
                        'js/sigfile.js',
                        'test/tests.js'
                ],
                options: {
                    mode: "VERIFY_ONLY",
                    eol: "\n"
                }
            },
            cleanup: {
                // Only cleanup a subset of the files
                src: [
                        'js/bluefile.js',
                        'js/matfile.js',
                        'js/sigfile.js',
                        'test/tests.js'
                ],
                options: {
                    indentSize: 4,
                    indentWithTabs: false,
                    wrapLineLength: 0,
                    eol: "\n"
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-closure-compiler');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('build', ['jsbeautifier:check', 'jshint', 'browserify', 'replace']);

    // Check everything is good
    grunt.registerTask('test', ['build', 'qunit', 'mochaTest']);
    
    // Build a distributable release
    grunt.registerTask('dist', ['clean', 'test', 'closure-compiler', 'jsdoc', 'compress']);
    
    // Default task.
    grunt.registerTask('default', 'test');

    // Benchmark in browsers.
    grunt.registerTask('benchtest', ['express:test', 'karma:bench']);
    grunt.registerTask('build_and_test', ['build', 'benchtest']);
    
};
