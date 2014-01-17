'use strict';

module.exports = function(grunt) {
    // Load used tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');



    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        app: {
            files: {
                jsSrc: ['statics/src/**/*.js'],
                templateSrc: ['statics/src/**/*.js'],
                buildCommonJs: ['app/build/*']
            }
        },
        watch: {
            common: {
                files: [
                    'Gruntfile.js',
                    '.jshintrc',
                    '<%= app.files.jsSrc %>',
                    '<%= app.files.templateSrc %>'
                ],
                tasks: ['clean:buildTmp', 'concat:libs', 'concat:common', 'concat:template', 'concat:assemble']
            },
            component: {
                files: [
                    'Gruntfile.js'
                ],
                tasks: ['concat:component']
            }
        },
        concat: {
            options: {
                separator: ';\n',
                stripBanners: false
            },
            libs: {
                options: {
                    banner: '/*! Lib */\n'
                },
                src: [
                    'bower_components/jquery/jquery.js',
                    'bower_components/underscore/underscore.js',
                    'bower_components/backbone/backbone.js',
                    'bower_components/backbone.marionette/lib/core/backbone.marionette.js',
                    'bower_components/backbone.babysitter/lib/core/backbone.babysitter.js',
                    'bower_components/backbone.wreqr/lib/backbone.wreqr.js',
                ],
                dest: 'statics/build/tmp/libs.js'
            },
            common: {
                options: {
                    banner:
                            '/*! Common */\n'
                          + '',
                    footer: '',
                    process: function(src, filepath) {
                        if (false) {
                            var srcByLine = src.split('\n');
                            for (var i = 0; i < srcByLine.length; i++) {
                                srcByLine[i] = '/* l. ' + (i + 1) + ' */ ' + srcByLine[i];
                            }
                            var srcnumeroted = srcByLine.join('\n');
                        }

                        return    '// start of file: "' + filepath + '"\n'
//                                + src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1')
                                + src
                                + '\n'
                                + '// end of file: "' + filepath + '"\n';
                    }
                },
                src: [
                    'statics/src/common/js/core/application.js',
                    'statics/src/common/js/core/ioc.js',
                    'statics/src/components/header/dfp.js'
                ],
                dest: 'statics/build/tmp/common.js'
            },
            template: {
                options: {
                    banner: '/*! Templates */\n',
                    process: function(src, filepath) {
                        var echapedSrc = src.replace(/"/g, '\\"').replace(/\n/g, '\\n');
                        var templateName = filepath.replace('statics/src/templates/', '').replace('.tpl.html', '');
                        var templateContent = '';

                        templateContent += '// source: ' + filepath + '\n';
                        templateContent += 've.templates["' + templateName + '"] = "' + echapedSrc + '";';

                        return templateContent;
                    }

                },
                src: ['statics/src/**/*.tpl.html'],
                dest: 'statics/build/tmp/templates.js'
            },
            assemble: {
                options: {
                    banner: '/*! <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today("dd-mm-yyyy HH:mm:ss") %>) */\n'
                            + '\'use strict\';\n'
                            + '\n'
                },
                src: [
                    'statics/build/tmp/libs.js',
                    'statics/build/tmp/common.js',
                    'statics/build/tmp/templates.js'
                ],
                dest: 'statics/build/common.js'
            }
        },
        clean: {
            buildTmp: {
                src: ['statics/build/tmp/*']
            }
        },
        jshint: {
            files: [
//                'Gruntfile.js',
                'statics/src/common/**/*.js',
                'statics/src/components/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc',
                force: true
            }
        }
    });




    // Génère les statiques pour le dev.
//    grunt.registerTask('watchDev', ['watch:common']);
};