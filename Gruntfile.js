/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'lib/**/*.js', 'app.js', "package.json", "config.js"]
    },
    watch: {
      dev: {
        files: ['Gruntfile.js', 'lib/**/*.js', 'app.js', "package.json", "config.js"],
        tasks: ['jshint'],
        options: {
          livereload: true,
        },
      },
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', "watch:dev"]);

};
