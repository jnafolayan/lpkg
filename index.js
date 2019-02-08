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
	return `Local package manager [ lpm v${VERSION} ]`;
}

function logic() {
	console.log(`\n${greetUser()}\n`);

	const parsed = processArgs(ARGV_ALIAS, CMD_ALIAS);

	const commands = parsed.commands;
	const args = Object.assign({}, DEFAULT_ARGS, parsed.args);

	let match;

	[r_add, r_remove, r_clear, r_install, r_list].some(({ regex, execute }) => {
		if (match = regex.exec(commands)) {
			execute(match, args);
			return true;
		}
		return false;
	});
}