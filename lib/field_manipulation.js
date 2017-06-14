/**@file
 * @brief Field manipulation functions.
 * @author Stefan Hamminga <stefan@prjct.net>
 * @copyright Copyright 2017 - Permission is hereby granted to redistribute this
 *            project according to the terms of the LGPL version 3 or higher.
 */

module.exports = { set_field, add_field, toggle_list_field, has_list_field };

/**
 * Set component `comp` Field `name` to `content`. Create field if needed.
 * Overwrites any existing `content`.
 * @param {Object} comp    Component data structure
 * @param {String} name    Field name
 * @param {any}    content Field content
 */
function set_field(comp, name, content) {
    if (comp.Fields[name]) {
        if (content !== null || typeof content !== 'undefined') {
            comp.Fields[name].content = (content instanceof Array) ? content.join('; ') : content;
        }
        return;
    }
    comp.Fields[name] = {
        content:  (content instanceof Array) ? content.join('; ') : (content || "~"),
        orientation: "H",
        x: comp.x,
        y: comp.y,
        Font_Size: 10,
        dunno2: "0001",
        Horizontal_Position: "C",
        Vertical_Position: "CNN"
    };
}

/**
 * Only add Field `name` if it's not currently present in `comp`.
 * @param {Object} comp    Component data structure
 * @param {String} name    Field name
 * @param {any}    content Field content
 */
function add_field(comp, name, content) {
    if (typeof comp.Fields[name] === 'undefined') {
        set_field(comp, name, content);
    }
}

/**
 * Set (default) or unset a value in a list stored in a Field `content`
 * @param  {Object}  comp    Component data structure
 * @param  {String}  name    Field name
 * @param  {String}  content List value to add or remove
 * @param  {Boolean} state   Add (default) or remove?
 */
function toggle_list_field(comp, name, content, state) {
    if (comp.Fields[name]) {
        var f = comp.Fields[name].split(";");
        f.forEach(s => { s.trim(); });
        var i = f.indexOf(content);
        if (i > -1) {
            if (state === false) {
                f.splice(i, 1);
            }
        } else {
            if (state !== false) {
                f.push(content);
            }
        }
        set_field(comp, name, f);
    } else {
        if (state !== false) {
            set_field(comp, name, content);
        }
    }
}

/**
 * Check if a list item, stored in Field `name`, is present.
 * @param  {Object}  comp    Component data structure
 * @param  {String}  name    Field name
 * @param  {String}  content List value to check for
 * @return {Boolean}         `content` present?
 */
function has_list_field(comp, name, content) {
    if ((comp) && (comp.Fields[name])) {
        var temp = comp.Fields[name].content.split(';');
        temp.forEach(s => { s.trim(); });
        return (temp.indexOf(content) > -1);
    }
    return false;
}
