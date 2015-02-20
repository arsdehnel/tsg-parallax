module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cacheBust: {
        options: {
            encoding: 'utf8',
            algorithm: 'md5',
            length: 16
        },
        assets: {
            files: [{
                src: ['index.html']
            }]
        }
    },
    svgstore: {
        options: {
            prefix : 'icon-', // This will prefix each ID
            cleanup : true,
            cleanupdefs : true
        },
        default : {
            files: {
                'svg/defs.svg': ['svg/symbols/*.svg'],
            }
        }
    },
    grunticon: {
        myIcons: {
            files: [{
                expand: true,
                cwd: 'img/sprite',
                src: ['*.png'],
                dest: './img'
            }],
            options: {

            }
        }
    },
    concat: {
        common: {
            src: [
                'js/dev/jquery.flexslider.js',
                'js/dev/jquery.numberSpinUp.js',
                'js/dev/main.js'
            ],
            dest: 'js/main.min.js',
        }
    },
    autoprefixer: {
        options: {
            browsers: ['last 2 version', "ie 9"]
        },
        dist: {
            files: [
                {
                    src: 'css/base/main.css',
                    dest: 'css/main.css'
                }
            ]
        },
    },
    sass: {
        dev: {
            options: {
                style: 'expanded'
            },
            files: {
                'css/base/main.css': 'scss/main.scss'
            }
        },
        dist: {
            options: {
                style: 'compressed'
            },
            files: {
                'css/base/main.css': 'scss/main.scss'
            }
        }
    },
    watch: {
        js: {
            files: ['js/dev/*.js','Gruntfile.js'],
            tasks: ['scripts']
        },
        scss: {
            files: ['scss/*.scss','scss/partials/*.scss','Gruntfile.js'],
            tasks: ['css']
        },
        svg: {
            files: ['svg/symbols/*.svg','Gruntfile.js'],
            tasks: ['svg']
        }
    }
  });

  // grunt.loadNpmTasks('grunt-contrib-sass');
  // grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-contrib-compress');
  // grunt.loadNpmTasks('grunt-autoprefixer');
  // grunt.loadNpmTasks('grunt-svgstore');
  // grunt.loadNpmTasks('grunt-grunticon');

  //by default (ie dev environment) we want to:
  // - compile handlebars
  // - concat js
  // - compile scss expanded
  grunt.registerTask('default', ['concat','sass:dev','autoprefixer','svgstore','watch']);

  //if we changed a scss file we can just do:
  // - compile scss expanded
  grunt.registerTask('css', ['sass:dev','autoprefixer']);

  grunt.registerTask('svg', ['svgstore']);

  //if we change a script file we can just do these ( we could break them out but seems like overkill ):
  // - compile handlebars
  // - concat js
  grunt.registerTask('scripts', ['concat']);

  //for the build command that we will run manually when we're all done we do some different things:
  // - compile handlebars
  // - uglify js
  // - compile css compressed
  // - build all that into a .zip for delivery
  grunt.registerTask('dist', ['concat','sass:dist','compress']);

};