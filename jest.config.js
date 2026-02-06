module.export = {
    testEnviroment: 'node',
    coveragePathIgnorePatterns: ['/node_modules'],
    testMatch: ['**/*.test.js', '**/?(*.)(spec|test).js'],
    collectCoverageFrom:[
        'scr/**/*.js',
        'scr/**/*.test.js',
        'scr/index.js'
    ],
    coverageThreshold:{
        global:{
            branches:70,
            functions:70,
            lines:70,
            statements:70
        }
    }
};