const path = require('path');

exports.VERSION = require('./package.json').version;

exports.DEFAULT_ARGS = {
	version: 'latest'
};

exports.MAP_FILE = path.resolve(__dirname, './map.json');

exports.CMD_ALIAS = {
	i: 'install',
	rm: 'remove'
};


exports.ARGV_ALIAS = {
	v: 'version'
};