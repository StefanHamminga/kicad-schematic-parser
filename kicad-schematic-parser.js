#!/usr/bin/node

const fs = require('fs');

const reader = require('./lib/read_schematic');
const writer = require('./lib/write_schematic');

const { inspect } = require('./lib/util');

const { set_defaults } = require('./lib/set_defaults');
const { generate_footprint } = require('./lib/generate_fields');

// The filename is the first and only argument to the script.
const schematic = reader(
    fs.readFileSync(process.argv[2], 'utf-8'));

// Loop over all components and set default fields and values:
schematic.Comp.forEach(set_defaults);

// Some components support generating footprint names from attributes:
schematic.Comp.forEach(generate_footprint);

// Dump the whole thing to stdout:
console.log(writer(schematic));

// inspect(schematic.Comp);
// inspect(default_fields);
