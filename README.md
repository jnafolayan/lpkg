# lpkg
A local package manager for your private workspace. Store your files - media, libraries, snippets,  etc - in a centralized store, and import them into any project at any time, easily. 

## Installation

Install globally using Node.js
```
npm install -g lpkg
```
or yarn
```
yarn global add lpkg
```

## Usage

For help with commands, or aliases, run
```
lpkg --help
```

To add a new package to the store
```
lpkg add <package-name> --src <path_to_package>
```

To remove a package from the store
```
lpkg remove <package-name>
```

To remove all packages from the store
```
lpkg clear
```

To list all packages in the store
```
lpkg list
```

To install a registered package in the current directory
```
lpkg install <package-name> 
```

Additionally, you can pass a version argument when running the add and install commands. By default, all packages are given a version number 1.0.0.
```
lpkg add <package-name> --version "0.5.0"
lpkg install <package-name> --version "0.5.0"
```
