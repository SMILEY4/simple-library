module.exports = config = {
	verbose: false,
	rootDir: "src",
	testEnvironment: 'jest-environment-node',
	"moduleNameMapper": {
		"\\.(sql)$": "<rootDir>/common/sqlMocks.js"
	},
}