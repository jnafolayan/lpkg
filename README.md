# lpm
A local package manager for your private workspace

## Installation

Install globally using Node.js
```
npm install -g lpm
```
or yarn
```
yarn global add lpm
```

## Usage

For help with commands, or aliases, run
```
lpm --help
```

To add a new package to the store
```
lpm add <package-name> --src <path_to_package>
```

To remove a package from the store
```
lpm remove <package-name>
```

To remove all packages from the store
```
lpm clear
```

To list all packages in the store
```
lpm list
```

To install a registered package in the current directory
```
lpm install <package-name> 
```

Additionally, you can pass a version argument when running the add and install commands. By default, all packages are given a version number 1.0.0.
```
lpm add <package-name> --version "0.5.0"
lpm install <package-name> --version "0.5.0"
```
