/**@file
 * @brief Read a KiCad schematic (.sch) text and parse it into a data structure
 *        for editing.
 * @author Stefan Hamminga <stefan@prjct.net>
 * @copyright Copyright 2017 - Permission is hereby granted to redistribute this
 *            project according to the terms of the LGPL version 3 or higher.
 *
 * TODO: Replace all 'dunno' values.
 * TODO: Verify existing mappings.
 * TODO: Add hierargical sheet support
 */

const { quote, unquote } = require('./util');

/**
 * Read a schematic from a string and return a data structure.
 * @param  {String} text Schematic file content
 * @return {Object}      Schematic data structure
 */
function read_schematic(text) {
    var lines = text.replace(/[\r\n]+/, '\n').split('\n').filter(Boolean);

    // Basic structure
    const schematic = {
        version: null,
        LIBS: [],
        EELAYER: [],
        Descr: [],
        Comp: [],
        Text: [],
        Wire: [],
        Connection: [],
        NoConn: []
    };

    for (var i = 0; i < lines.length; i++) {
        // Chop lines in space separated tokens, minding quotes.
        var tokens = lines[i].match(/(?:[^\s"]+|"[^"]*")+/g);

        // Each if statement basically matches an opening token and consumes
        // extra lines if needed.
        if (/^EESchema/.test(tokens[0])) {
            schematic.version = tokens[4];
        } else if (/^LIBS/.test(tokens[0])) {
            schematic.LIBS.push(tokens[0].split(":")[1]);
        } else if (/^\$Descr/.test(tokens[0])) {
            inSection = 'Descr';
            schematic.Descr.sheetFormat = tokens[1];
            schematic.Descr.x = tokens[2];
            schematic.Descr.y = tokens[3];
            while (! /^\$EndDescr/.test(lines[++i])) {
                tokens = lines[i].match(/(?:[^\s"]+|"[^"]*")+/g);
                schematic.Descr.push({
                    property: tokens[0],
                    value: tokens.slice(1)
                });
                // schematic.Descr[tokens[0]] = tokens.slice(1);
            }
        } else if (/^\$Comp/.test(tokens[0])) {
            var comp = { Fields: {}, rest: [] };

            while (! /^\$EndComp/.test(lines[++i])) {
                tokens = lines[i].match(/(?:[^\s"]+|"[^"]*")+/g);
                switch (tokens[0]) {
                case 'L':
                    comp.Component_Name = tokens[1];
                    comp.Reference = tokens[2];
                    break;
                case 'U':
                    comp.dunno1 = tokens[1];
                    comp.dunno2 = tokens[2];
                    comp.Component_ID = tokens[3];
                    break;
                case 'P':
                    comp.x = tokens[1];
                    comp.y = tokens[2];
                    break;
                case 'F':
                    comp.Fields[tokens[1] == 0 ? "Reference" :
                            tokens[1] == 1 ? "Value" :
                            tokens[1] == 2 ? "Footprint" :
                            tokens[1] == 3 ? "Datasheet" :
                            unquote(tokens[10]).replace(/[ \t-\.]+/g, '_')] = {
                        content: unquote(tokens[2]),
                        orientation: tokens[3],
                        x: tokens[4],
                        y: tokens[5],
                        Font_Size: tokens[6],
                        dunno2: tokens[7], /* Visibility? */
                        Horizontal_Position: tokens[8],
                        Vertical_Position: tokens[9]
                    };
                    break;
                default:
                    comp.rest.push(tokens);
                }
            }

            schematic.Comp.push(comp);
        } else if (/^Connection/.test(tokens[0])) {
            schematic.Connection.push({
                dunno1: tokens[1],
                x: tokens[2],
                y: tokens[3]
            });
        } else if (/^NoConn/.test(tokens[0])) {
            schematic.NoConn.push({
                dunno1: tokens[1],
                x: tokens[2],
                y: tokens[3]
            });
        } else if (/^Text/.test(tokens[0])) {
            schematic.Text.push({
                type: tokens[1],
                x: tokens[2],
                y: tokens[3],
                rotation: tokens[4],
                Font_Size: tokens[5],
                shape: tokens[6],
                dunno1: tokens[7],
                dunno2: tokens[8],
                value: lines[++i]
            });
        } else if (/^Wire/.test(tokens[0])) {
            var wire = {};
            var points = lines[++i].match(/(?:[^\s"]+|"[^"]*")+/g);
            schematic.Wire.push({
                category: tokens[1],
                type: tokens[2],
                x1: points[0],
                y1: points[1],
                x2: points[2],
                y2: points[3]
            });
        } else if (/^EELAYER/.test(tokens[0])) {
            if (tokens[1] !== 'END') {
                schematic.EELAYER.push({
                    dunno1: tokens[1],
                    dunno2: tokens[2]
                });
            }
        }
    }
    return schematic;
}

module.exports = read_schematic;
