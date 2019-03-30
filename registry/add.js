const path = require('path');
const { fetchMap, saveMap } = require('../util');
const Package = require('../Package');

exports.regex = /^add (\S+)/gi;

exports.execute = (match, args) => {
	const key = match[1];
	const version = args['version'];
	let src = args['src'];

	if (!src) {
		console.error('error: An src option is required!');
	} else {
		src = path.resolve(src);

		fetchMap()
			.then(map => {
				const pkg = map[key] || (map[key] = []);
				pkg.push(Package.create(key, src, version));
				return map;
			})
			.then(saveMap)
			.then(() => console.log(`${key} ${
				version != 'latest' 
				? '('+version+') '
				: '' 
			}has been added successfully.`))
			.catch(err => console.log(`error: An error occured while registering ${key}: ${err.message}`));
	}
};