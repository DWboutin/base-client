require('babel-register')({
  presets: ["es2015", "react", "stage-2"]
});

process.env.ROOT_FOLDER = __dirname;

require('./src/server');