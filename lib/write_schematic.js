/**@file
 * @brief Write a KiCad schematic (.sch) based on a provided data structure.
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
 * Convert a schematic data structure to a KiCad readable file text.
 * @param  {Object}   schematic           Data structure
 * @param  {Function} content_manipulator Optional function to modify field
*                                         contents before quoting and writing.
 * @return {String}                       KiCad Schematic file content.
 */
function write_schematic(schematic, content_manipulator) {
    function proc_content(string) {
        if (typeof string === 'undefined') {
            string = "~";
        } if (string === true) {
            return quote("Y");
        } if (string === false) {
            return quote("N");
        } else {
            string = unquote(`${string}`);
            if (string.length < 1) string = "~";
        }
        if (typeof content_manipulator === 'function') {
            return quote(content_manipulator(string));
        }
        return quote(string);
    }

    var text = `EESchema Schematic File Version ${schematic.version}\n`;

    schematic.LIBS.forEach(lib => { text += `LIBS:${lib}\n`; });

    schematic.EELAYER.forEach(l => {
        text += `EELAYER ${l.dunno1} ${l.dunno2}\n`;
    });
    text += "EELAYER END\n";

    text += `$Descr ${schematic.Descr.sheetFormat} ${schematic.Descr.x} ${schematic.Descr.y}\n`;
    schematic.Descr.forEach(prop => { text += `${prop.property} ${prop.value.join(' ')}\n`; });
    text += `$EndDescr\n`;

    schematic.Comp.forEach(comp => {
        text += "$Comp\n";

        text += `L ${comp.Component_Name} ${comp.Reference}\n`;
        text += `U ${comp.dunno1} ${comp.dunno2} ${comp.Component_ID}\n`;
        text += `P ${comp.x} ${comp.y}\n`;

        var f;
        f = comp.Fields.Reference;
        text += `F ${0} ${proc_content(f.content)} ${f.orientation} ${f.x} ${f.y} ${f.Font_Size} ${f.dunno2} ${f.Horizontal_Position} ${f.Vertical_Position}\n`;
        f = comp.Fields.Value;
        text += `F ${1} ${proc_content(f.content)} ${f.orientation} ${f.x} ${f.y} ${f.Font_Size} ${f.dunno2} ${f.Horizontal_Position} ${f.Vertical_Position}\n`;
        f = comp.Fields.Footprint;
        text += `F ${2} ${proc_content(f.content)} ${f.orientation} ${f.x} ${f.y} ${f.Font_Size} ${f.dunno2} ${f.Horizontal_Position} ${f.Vertical_Position}\n`;
        f = comp.Fields.Datasheet;
        text += `F ${3} ${proc_content(f.content)} ${f.orientation} ${f.x} ${f.y} ${f.Font_Size} ${f.dunno2} ${f.Horizontal_Position} ${f.Vertical_Position}\n`;

        var i = 4;
        for (let prop in comp.Fields) {
            if (comp.Fields.hasOwnProperty(prop) && !(prop === "Reference" || prop === "Value" || prop === "Footprint" || prop === "Datasheet")) {
                f = comp.Fields[prop];
                text += `F ${i++} ${proc_content(f.content)} ${f.orientation} ${f.x} ${f.y} ${f.Font_Size} ${f.dunno2} ${f.Horizontal_Position} ${f.Vertical_Position} ${quote(prop)}\n`;
            }
        }

        comp.rest.forEach(item => {
            text += `    ${item.join(' ')}\n`;
        });

        text += "$EndComp\n";
    });


    schematic.Text.forEach(t => {
        text += `Text ${t.type} ${t.x} ${t.y} ${t.rotation} ${t.Font_Size} ${t.shape} ${t.dunno1} ${t.dunno2 || ""}\n${t.value}\n`;
    });

    schematic.Wire.forEach(w => {
        text += `Wire ${w.category} ${w.type}\n    ${w.x1} ${w.y1} ${w.x2} ${w.y2}\n`;
    });

    schematic.Connection.forEach(c => {
        text += `Connection ${c.dunno1} ${c.x} ${c.y}\n`;
    });

    schematic.NoConn.forEach(nc => {
        text += `NoConn ${nc.dunno1} ${nc.x} ${nc.y}\n`;
    });

    text += "$EndSCHEMATC\n";

    return text;
}

module.exports = write_schematic;
