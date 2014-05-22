module.exports = function(grunt) {
	grunt.initConfig({
		
		uglify: {
			options: {
				banner: "var rfnry = { vis: { util: (function() {"
			},
			dist: {
				src: [
					"<banner>",
					"js/include.js",
					"js/charts/genericplain.js",
					"js/charts/genericsvg.js",
					"js/charts/genericaxis.js",
					"js/charts/simpleplain.js",
					"js/charts/group.js",
					"js/charts/layer.js",
					"js/charts/stack.js",
					"js/main.js"
				],
				dest: "res.js"
			}
		},

		concat: {
			options: {
				separator: "",
			}, dist: {
				src: ["res.js", "js/footer.foo"],
				dest: "final.js"
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-uglify")
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask("default", ["uglify", "concat"])
};