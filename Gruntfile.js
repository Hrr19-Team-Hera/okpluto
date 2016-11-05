module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

// Opens up mongod on local machine
    shell: {
      mongo: {
        command: 'mongod',
        options: {
          async: true
        }
      }
    },


// Allows nodemon and browserify watch to run simultaneously
// in the same terminal tab/window
    concurrent: {
      target: {
         tasks: ['nodemon', 'watch'],
         options: {
             logConcurrentOutput: true
         }
       }
     },

// Watches all files in src for changes
// rebuilds bundle.js file on change
    watch: {
      browserify: {
        files: ['src/**/*.jsx'],
        tasks: ['browserify']
      }
    },

// Allows for es6, jsx through babel,
// concats everything into bundle.js
    browserify: {
      dist: {
        options: {
          debug: true,
          transform: [
            ['babelify', {
              presets: ['es2015', 'react']
            }]
          ],
          watch: true,
          browserifyOptions: {
            debug: true,
            insertGlobals: true
          }
        },
        src: ['src/**/*.jsx'],
        dest: 'public/bundle.js'
      }
    },

// Opens a new browser window each time nodemon starts up
    // nodemon: {
    //   dev: {
    //     script: 'server.js',
    //     options: {
    //       ignore: ['node_modules/**'],
    //       callback: function (nodemon) {
    //         nodemon.on('log', function (event) {
    //           console.log(event.colour);
    //         });

    //         nodemon.on('config:update', function () {
    //         // Delay before server listens on port
    //         setTimeout(function() {
    //           require('open')('http://localhost:8080');
    //         }, 1000);
    //         });
    //       }
    //     }
    //   }
    // },

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-shell-spawn');

// Running grunt will open mongo connection, create bundle.js,
// open a browser window with the site and watch for changes
  grunt.registerTask('default', ['build']);
  grunt.registerTask('kill', ['shell:mongo:kill'])
  grunt.registerTask('build', ['browserify']);
}
