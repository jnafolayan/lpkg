const Package = require('../Package');
const { fetchMap, saveMap } = require('../util');

exports.regex = /^list$/gi;

exports.execute = (match, args) => {
	fetchMap()
		.then(grabEntries)
		.then(listEntries);

	function grabEntries(map) {
		return Object.entries(map);
	}

	function listEntries(entries) {
		entries.forEach(([name, versions]) => {
			versions.forEach(pkg => console.log(`${Package.toString(pkg)}`));
		});
	}
};