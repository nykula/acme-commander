#!/usr/bin/gjs
/* global imports, print, ARGV */
// Runs a task in a separate process.

const path = /^.*?@(.*):/.exec(new Error().stack)[1]
const dirname = imports.gi.Gio.File.new_for_path(path).get_parent().get_parent().get_path()
imports.searchPath.push(dirname)
imports.src.utils.require.require()

const Worker = require('../src/utils/Worker').default
const worker = new Worker()

worker.run(
  JSON.parse(ARGV[0]),
  (action) => {
    print(JSON.stringify(action))
  }
)
