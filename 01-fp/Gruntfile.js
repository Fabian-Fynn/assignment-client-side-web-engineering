'use strict'

const fs = require('fs')
const serveStatic = require('serve-static')

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt)
  require('time-grunt')(grunt)

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      watch: {
        files: {
          './dist/main.js': ['./lib/main.js']
        },
        options: {
          transform: ['hbsfy', 'babelify']
        }
      },
      dist: {
        files: {
          './dist/main.js': ['./lib/main.js']
        },
        options: {
          transform: ['hbsfy', 'babelify', 'uglifyify']
        }
      }
    },
    
    clean: {
      dist: ['./dist']
    },
    
    watch: {
      static: {
        files: ['./lib/*.html'],
        tasks: ['copy'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['./lib/**/*.js', './lib/**/*.hbs'],
        tasks: ['browserify:watch'],
        options: {
          livereload: true
        }
      }
    }
  })

  grunt.registerTask('default', ['clean', 'browserify:dist'])
  grunt.registerTask('start', ['default', 'watch'])

}
