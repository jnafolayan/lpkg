const { saveMap } = require('../util');

exports.regex = /^clear$/gi;

exports.execute = () => {
	saveMap({})
		.then(() => console.log('Map cleared successfully'))
		.catch(() => console.log('Map could not be cleared'));
};