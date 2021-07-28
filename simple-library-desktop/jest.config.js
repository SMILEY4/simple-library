module.exports = config = {
	verbose: false,
	rootDir: "src",
	testEnvironment: 'jest-environment-node',
	transform: {
		"\\.(sql)$": "<rootDir>/common/sqlMocks.js",
		'^.+\\.ts?$': 'ts-jest',
	}
}


// module.exports = config = {
// 	verbose: false,
// 	rootDir: "src",
// 	testEnvironment: 'jest-environment-node',
// 	"moduleNameMapper": {
// 		"\\.(sql)$": "<rootDir>/common/sqlMocks.js"
// 	},
// }