var path = require('path');

var stylesheetsDir = 'src/scss';
var javascriptDir = 'src/js';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 8888,
          base: './'
        }
      }
    },

    // connect: {
    //   server: {
    //     options: {
    //       port: 8888,
    //       base: './',
    //       keepalive: true
    //     }
    //   }
    // },

    bgShell: {
      // runNode: {
      //   cmd: 'node ./node_modules/nodemon/nodemon.js index.js',
      //   bg: true
      // }
      cleanup: {
        cmd: 'rm images/icons/grunticon.loader.txt images/icons/preview.html js/main.js js/templates.js',
        bg: true
      }
    },

    uglify: {
      options: {
        banner: '/*! Created by Dragos Cifrea ' +
          '<%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      dist: {
        files: {
          'js/main.min.js': ['js/main.js'],
          'js/require.min.js': ['src/managed/requirejs/require.js']
        }
      }
    },

    jshint: {
      // define the files to lint
      files: ['gruntfile.js', 'src/js/app/**/*.js', 'test/js/app/**/*.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
          // more options here if you want to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },

    template: {
        options: {
            // Task-specific options go here
        },
        dist: {
            'options': {
                'data': {
                  'require': 'js/main.min',
                  'requirePath': 'js/require.min.js',
                  'jasminePath': 'jasmine/libs/',
                  'jasmineRequirePath': 'js/require.min.js',
                  'jasmineRequireDataMain': 'js/main.min',
                }
            },
            'files': {
                'index.html': ['src/index.html.tpl'],
                'jasmine.html': ['src/jasmine.html.tpl'],
                'jasmine/libs/jasmine.css' : ['src/managed/jasmine/lib/jasmine-core/jasmine.css'],
                'jasmine/libs/jasmine.js' : ['src/managed/jasmine/lib/jasmine-core/jasmine.js'],
                'jasmine/libs/jasmine-html.js' : ['src/managed/jasmine/lib/jasmine-core/jasmine-html.js']
            }
        },
        dev: {
            'options': {
                'data': {
                  'require': 'src/js/main',
                  'requirePath': 'src/managed/requirejs/require.js',
                  'jasminePath': 'src/managed/jasmine/lib/jasmine-core/',
                  'jasmineRequirePath': 'src/managed/requirejs/require.js',
                  'jasmineRequireDataMain': 'src/js/main',
                }
            },
            'files': {
                'index.html': ['src/index.html.tpl'],
                'jasmine.html': ['src/jasmine.html.tpl']
            },
            'jsfiles': [

            ]
        }
    },

    sass: {
      options: {
        includePaths: [
                        'src/managed/foundation/scss',
                        'src/managed/bourbon/app/assets/stylesheets',
                        'src/managed/neat/app/assets/stylesheets'
                      ]
      },
      dev: {
        options: {
          outputStyle: 'expanded'
        },
        files: {
          'css/main.css': 'src/scss/main.scss'
        }
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'css/main.css': 'src/scss/main.scss'
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          baseUrl: "src/js",
          name: "app/init",
          mainConfigFile: "src/js/config.js",
          out: "js/main.js"
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },
      grunt: {
        files: ['Gruntfile.js']
      },
      js: {
        files: ['src/js/**/*.js']
      },
      templates: {
        files: 'src/*.tpl',
        tasks: ['template:dev']
      },
      sass: {
        files: stylesheetsDir + '/**/*.scss',
        tasks: ['sass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bg-shell');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-template');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('compile', ['jshint', 'sass:dist', 'requirejs', 'template:dist', 'uglify:dist', 'bgShell:cleanup']);

  grunt.registerTask('dev', ['sass:dev', 'template:dev']);

  // Run the server and watch for file changes
  grunt.registerTask('monitor', ['dev', 'connect', 'watch']);
  grunt.registerTask('server', ['connect']);

  // Default task(s).
  grunt.registerTask('default', ['monitor']);
};
