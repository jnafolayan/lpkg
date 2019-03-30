const { fetchMap, saveMap } = require('../util');

exports.regex = /^remove (\S+)/gi;

exports.execute = (match, args) => {
	const key = match[1];
	fetchMap()
		.then(map => {
			if (!map.hasOwnProperty(key)) {
				throw new ReferenceError(`${key} is not a package. Run 'lpm add' to add it.`);
			}
			delete map[key];
			return map;
		})
		.then(saveMap)
		.then(() => console.log(`${key} package has been removed successfully.`))
		.catch(err => console.log(`error: An error occured while removing ${key}: ${err.message || err}`));
};