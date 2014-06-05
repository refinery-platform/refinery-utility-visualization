/*
    1. JShint the files
    2. Uglify
    3. Concat / Inject header and footer
    4. Copy finished library to the example folder

    Also generate docs separately
*/

module.exports = function(grunt) {
    grunt.initConfig({
        
        pkg: grunt.file.readJSON("package.json"),
        
        source_dir: "src",
        vendor_dir: "bower_components", 

        source_files: {
            js: ["src/js/**/*.js"],
            css: ["src/style/**/*.css"]
        },

        jshint: {
            files: [
                "Gruntfile.js",
                "src/**/*.js"
            ]
        },

        uglify: {
            options: {
                banner: "/*! <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> */\n"
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
            dist: {
                src: [
                    "src/js/wrap/header.foo",
                    "rfnry.vis.util.js",
                    "src/js/wrap/footer.foo"
                ],
                dest: "rfnry.vis.util.js"
            }
        },

        copy: {
            main: {
                src: "rfnry.vis.util.js",
                dest: "example/rfnry.vis.util.js"
            }
        },

        jsdoc: {
            dist: {
                option: {
                    destination: "doc"
                },
                src: [
                    "src/js/charts/genericsvg.js",
                    "src/js/charts/genericplain.js",
                    "src/js/charts/simpleplain.js",
                    "src/js/charts/genericaxis.js",
                    "src/js/charts/group.js",
                    "src/js/charts/stack.js",
                    "src/js/charts/layer.js",
                    "src/js/draw.js",
                    "src/js/pre.js"
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-jsdoc");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.registerTask("default", ["jshint", "uglify", "concat", "copy"]);
    grunt.registerTask("doc", ["jsdoc"]);
};