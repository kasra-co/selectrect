# FEMbot

A seed project for front end modules, with automated build.

To create a new project based on this, fork this repository and optionally transfer it to menapost-team. After cloning it, add this repo as an upstream remote so that you can retrieve updates and contribute fixes back here.

```
git add remote upstream <your git url for this repo>
```

When there is an upstream change that you want to incorporate, e.g. a new feature in the demo build script, you can merge from upstream:

```
git merge upsream/master demo/gulpfile.js
```

To make an improvement to this repo, push your changes to an upstream feature branch:

```
git push -u upstream feature-branch
```

Then submit a pull request.

## Usage

**Install**:

`npm install --save <git-url>`. Will only work on machines that have an SSH key to the repo, if the repo is private.

**Require**:

`var ExampleComponent = require( 'fembot' ).ExampleComponent;` where `fembot` is the name specified in the module's package.json. The exported object is defined in index.js.

## Structure

```
.
├── demo # Demo area, for experimenting and demonstrating module usage by example
│   ├── dist
│   │   ├── index.html
│   │   └── index.min.js
│   ├── src
│   │   ├── index.html
│   │   └── index.js
│   └── gulpfile.js
├── lib # Module source. If there are dozens of files here and you are feeling the need to get creative with subdirectory structure, then it is probably time to factor something out into another module.
│   └── example-component.js
├── test # Tests go here
├── index.js # Interface specification
├── package.json
└── readme.md
```

## Demo

From `demo/dist`, run `gulp watch` to start the build. It will rebuild whenever there are changes.

Start a simple webserver in the demo dir to view the demo:

```
$ pythom -m SimpleHTTPServer
Serving HTTP on 0.0.0.0 port 8000 ...
```

Open a browser at localhost:8000.

## Tooling

**jshint** [sublime module](https://github.com/victorporof/Sublime-JSHint) - Flag common JS errors.

**jscs** [sublime module](https://github.com/SublimeLinter/SublimeLinter-jscs/) - Editor support for code style conventions. (Not currently working with JSX, do not use)
