#!/usr/bin/env node

const { VERSION, CMD_ALIAS, ARGV_ALIAS, DEFAULT_ARGS } = require('./consts');
const { processArgs } = require('./util');

// registry
const r_add = require('./registry/add');
const r_remove = require('./registry/remove');
const r_clear = require('./registry/clear');
const r_install = require('./registry/install');
const r_list = require('./registry/list');

// Kickoff!
logic();


function greetUser() {
	return `Local package manager v${VERSION}`;
}

function logic() {
	console.log(`\n${greetUser()}\n`);

	const parsed = processArgs(ARGV_ALIAS, CMD_ALIAS);

	const commands = parsed.commands;
	const args = Object.assign({}, DEFAULT_ARGS, parsed.args);

	let match;

	if (args['help']) {
		console.log([
			'Usage: lpm [--help] <command> [<args>]',
			'',
			'Options:',
			'  -h, --help     Output usage information',
			'                 Specify the package version to install/register',
			'  -v, --version  Output the version number',
			'  --src          Output the version number',
			'',
			'Commands:',
			'  add, register  Add a new package to the store',
			'  rm, remove     Remove a packages form the store',
			'  clear          Remove all packages from the store',
			'  list           List all added packages',
			'  i, install     Install a package in the current directory'
		].join('\n'));
	} else if (args['version'] === true && !commands) {
		console.log(VERSION);
	} else {
		[r_add, r_remove, r_clear, r_install, r_list].some(({ regex, execute }) => {
			if (match = regex.exec(commands)) {
				execute(match, args);
				return true;
			}
			return false;
		});
	}
}