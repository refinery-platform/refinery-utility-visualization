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
                dest: "rfnry.vis.util.js"
            }
        },

        concat: {
            options: {

            }, 
            dist: {
                src: [
                    "src/js/wrap/header.foo",
                    "rfnry.vis.util.js",
                    "src/js/wrap/footer.foo"
                ],
                dest: "rfnry.vis.util.js"
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-uglify")
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask("default", ["uglify", "concat"])
};