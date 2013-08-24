module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg     : grunt.file.readJSON('package.json'),
        jshint  : {
            all     : ['Gruntfile.js', 'lib/pyx.js', 'test/**/*.spec.js']
        },
        'jasmine-node' : {
            options : {
                coffee  : false,
                noStack : false
            },
            run     : {
                spec    : "test/"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine-node');

    // Default task(s).
    grunt.registerTask('default', [
        'jshint',
        'jasmine-node'
    ]);

};

