[![Build Status](https://travis-ci.org/mancontr/js.conf.d.svg?branch=master)](https://travis-ci.org/mancontr/js.conf.d)

# js.conf.d

A simple configuration manager, with directory hierarchy / overrides support.

Linux distributions' packages have had folder-based config for years. We're all used to easily adding files to a `nginx.conf.d` folder, and it being picked up automatically, in a predictable order. We're also used to having multiple paths where config will be searched, ordered by priority. But until now, on NPM we had to do this manually.

This package allows you to set a list of search folders, and any js files on them will be loaded and merged as a plain object, following configurable rules.

## Usage

Using config.d is very simple:

```js
const configd = require('js.conf.d')

// Load config from any of these 3 folders, with the latter overriding the former
const config = configd.load(['/etc/my-config', '~/.my-config', './config'])
```

By default, the files will be loaded on filename order (as defined by `sort()`), and the contents will be merged using `Object.assign`.
