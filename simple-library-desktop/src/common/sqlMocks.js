module.exports = {
	process: (content) => {
		return "module.exports = " + JSON.stringify(content)
	},
};