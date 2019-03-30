class Package {
  static create(key, src, version) {
    return {
      key,
      src,
      version,
      installs: 0
    };
  }

  static toString({ key, version, installs }) {
    return `${key} (${version}) - ${installs}f`;
  }
}

module.exports = Package;