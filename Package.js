class Package {
	static create(name, src, version) {
		const pkg = {
			name,
			src,
			version,
			dateAdded: new Date().toLocaleString()
		};
		return pkg;
	}

	static toString({ name, src, version, dateAdded }) {
		return `${name}@${version}: ${src} [${dateAdded}]`;
	}
}

module.exports = Package;