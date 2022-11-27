 module.exports = {
  
	input: './src/index.ts',
	// Environment
	env: "development" , 
  rollup(config, options) {
    return config;
  },
};