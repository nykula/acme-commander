#!/usr/bin/gjs
/* global imports */
// Sets up the environment and runs the tests.

const path = /^.*?@(.*):/.exec(new Error().stack)[1]
const dirname = imports.gi.Gio.File.new_for_path(path).get_parent().get_parent().get_path()
imports.searchPath.push(dirname)
imports.src.utils.require.require()

imports.gi.Gtk.init(null)
require('../src/utils/GtkDom').require()
require('../src/utils/Test').require()

const Worker = require('../src/utils/Worker').default
const data = new Worker().flatten(imports.gi.Gio.File.new_for_path(dirname + '/src'))

const scripts = data.files.map(x => x.relativePath).filter(x => (
  !!x &&
  x.slice(-3) === '.js' &&
  x !== 'App.test.js' && // Broken.
  x !== 'index.js'
)).map(x => '../src/' + x)

const tests = scripts.filter(x => /\.test\.js$/.test(x))
tests.forEach(x => {
  require(x)
})

// Make sure the report shows uncovered modules.
const modules = scripts.filter(x => !/\.test\.js$/.test(x))
modules.forEach(x => {
  require(x)
})
