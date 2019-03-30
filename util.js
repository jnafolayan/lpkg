const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const { exec, spawn } = require('child_process');
const { MAP_FILE } = require('./consts');

const fsp_stat = promisify(fs.stat);
const fsp_readdir = promisify(fs.readdir);
const fsp_mkdir = promisify(fs.mkdir);
const fsp_readFile = promisify(fs.readFile);
const fsp_writeFile = promisify(fs.writeFile);

function grabSrcStats(src) {
	return fsp_stat(src);
}

function handleDirectoryOrFile({ stats, src, key }) {
	if (stats.isDirectory()) {
		return installDirectory(src, key);
	} else if (stats.isFile()) {
		return installFile(src, getLastSrcDir(src));
	}
	throw new TypeError(`${src} is neither a file nor directory!`);
}

function getRelativeSrc(...args) {
	return path.resolve(...args);
}

function getLastSrcDir(src) {
	return src.split(/[\\\/]/g).pop();
}

function installDirectory(rootSrc, key, rename) {
	const sourceRoot = getLastSrcDir(rootSrc);

	// Gather directories and files
	let directoryList = [rootSrc];
	let fileList = [];

	readDirectory(rootSrc, Promise.resolve())
		.then(() => directoryList)
		.then(convertSourceToDest)
		.then(createDirectories) 
		.then(() => fileList)
		.then(convertSourceToDest)
		.then(createFiles)
		.then(() => console.log(`success: \n${key} package was successfully installed.`))
		.then(() => execPromise(`rename ${getLastSrcDir(rootSrc)} ${key}`).catch(() => Promise.resolve())); 

	function readDirectory(src, promise) {
		return promise.then(() => fsp_readdir(src))
			.then(list => {
				const singulars = list.map(item => {
					const relativeSrc = getRelativeSrc(src, item);
					
					const singular = Promise.resolve();
					return singular.then(() => grabSrcStats(relativeSrc))
						.then(stats => {
							if (stats.isFile()) {
								fileList.push(relativeSrc);
							} else if (stats.isDirectory()) {
								directoryList.push(relativeSrc);
								return readDirectory(relativeSrc, singular);
							}
						});
				});

				return Promise.all(singulars);
			});
	}

	function convertSourceToDest(list) {
		return list.map(src => src.substr(src.indexOf(sourceRoot)));
	}

	function createDirectories(list) {
		let promiseAccum = Promise.resolve();
		list.forEach(src => {
			promiseAccum = promiseAccum.then(() => {
				return execPromise(`rm -rf ${src}`)
					.then(() => fsp_mkdir(src));
			});
		});
		return promiseAccum;
	}

	function createFiles(list) {
		const promises = list.map((dest, i) => {
			const source = fileList[i];
			return installFile(source, dest);
		});
		return Promise.all(promises);
	}
}

function installFile(source, dest) {
	return new Promise((resolve, reject) => {
		const readStream = fs.createReadStream(source);
		const writeStream = fs.createWriteStream(dest);

		writeStream.on('error', reject);
		writeStream.on('finish', () => {
			console.log(`Installed ${dest}`);
			resolve(true);
		});

		readStream.pipe(writeStream);
	});
}

function processArgs(aliasMap={}, cmdAlias={}) {
	const argv = [...process.argv].slice(2);
	const result = {
		commands: [],
		args: {}
	};

	for (let i = 0; i < argv.length; i++) {
		const item = argv[i];
		if (!/^\-/.test(item)) {
			const cmd = cmdAlias[item] || item;
			// it is a command
			result.commands.push(cmd);
 		} else {
 			let stripped;

 			if (item.charAt(1) === '-') {
 				stripped = item.substr(2);
 			} else {
 				stripped = item.substr(1);
 				if (aliasMap[stripped]) {
 					stripped = aliasMap[stripped];
 				}
 			}

 			result.args[stripped] = argv[++i] || true;
 		}
	}

	result.commands = result.commands.join(' ');

	return result;
}

function fetchMap() {
	return fsp_readFile(MAP_FILE, 'utf-8')
		.then(map => { return map || '{}'; })
		.then(JSON.parse);
}

function saveMap(map) {
	return fsp_writeFile(MAP_FILE, JSON.stringify(map), 'utf-8');
}

function execPromise(cmd) {
	return new Promise((resolve, reject) => {
		exec(cmd, (err, stdout, stderr) => {
			if (err)
				reject(err);
			else 
				resolve(true);
		});
	});
}

module.exports = {
	grabSrcStats,
	handleDirectoryOrFile,
	getRelativeSrc,
	getLastSrcDir,
	installDirectory,
	installFile,
	processArgs,
	fetchMap,
	saveMap,
	execPromise
};