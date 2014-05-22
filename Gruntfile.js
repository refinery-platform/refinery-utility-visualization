module.exports = function(grunt) {
    grunt.initConfig({
        
        uglify: {
            options: {

            },
            dist: {
                src: [
                    "src/js/pre.js",
                    "src/js/charts/genericplain.js",
                    "src/js/charts/genericsvg.js",
                    "src/js/charts/genericaxis.js",
                    "src/js/charts/simpleplain.js",
                    "src/js/charts/group.js",
                    "src/js/charts/layer.js",
                    "src/js/charts/stack.js",
                    "src/js/draw.js"
                ],
                dest: "res.js"
            }
        },

        concat: {
            options: {

            }, 
            dist: {
                src: [
                    "src/js/wrap/header.foo",
                    "res.js",
                    "src/js/wrap/footer.foo"
                ],
                dest: "res.js"
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify")
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask("default", ["uglify", "concat"])
};