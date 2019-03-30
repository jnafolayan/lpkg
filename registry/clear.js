const { saveMap } = require('../util');

exports.regex = /^clear$/gi;

exports.execute = () => {
	saveMap({})
		.then(() => console.log('Packages cleared from store'))
		.catch(() => console.log('error: An error occured while clearing packages'));
};