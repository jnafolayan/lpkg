const { fetchMap, saveMap, grabSrcStats, handleDirectoryOrFile } = require('../util');

exports.regex = /^install (\S+)/gi;

exports.execute = (match, args) => {
	const key = match[1];
	const version = args['version'];

	fetchMap()
		.then(map => {
			const pkg = map[key];

			if (!pkg) {
				throw new ReferenceError(`There was no ${key} package found.`);
			}

			const pkgv = pkg.filter(p => p.version === version)[0];

			if (!pkgv) {
				throw new ReferenceError(`There was no ${key}@${version} package found.`);
			}

			const promise = Promise.resolve();
			const {src} = pkgv;

			console.log(version)

			return grabSrcStats(src)
				.then(stats => { return { stats, src, key } })
				.then(handleDirectoryOrFile);
		})
		.catch(err => console.log(`An error occured while installing ${key}:`, err.message || err));
};