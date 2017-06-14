/**@file
 * @brief Function to set default fields and values.
 * @author Stefan Hamminga <stefan@prjct.net>
 * @copyright Copyright 2017 - Permission is hereby granted to redistribute this
 *            project according to the terms of the LGPL version 3 or higher.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const { for_each_prop } = require('./util');
const { set_field, add_field, toggle_list_field, has_list_field } = require('./field_manipulation');

module.exports = { set_defaults };

const default_fields = yaml.safeLoad(
    fs.readFileSync(
        path.resolve(__dirname, '../default_fields.yml'), 'utf8'));

/**
 * Set default fields and values based on the default_fields object read from a
 * YAML file.
 * @param  {Object} comp Component data structure
 */
function set_defaults(c) {
    if (c.Reference[0] === '#') return;

    var R = c.Reference.replace(/[0-9]+$/,'');

    for_each_prop(default_fields.Fields, (item, key) => {
        add_field(c, key, item);
    });

    for_each_prop(default_fields.Reference, (item, key) => {
        var expr;
        if (key[0] === '/') {
            expr = key.split('/');
            expr = new RegExp(expr[1], expr[2]);
        } else {
            expr = new RegExp("^" + key + "$");
        }
        if (expr.test(R)) {
            for_each_prop(item.Fields, (item, key) => {
                add_field(c, key, item);
            });

            for_each_prop(item.Component_Name, (item, key) => {
                var expr;
                if (key[0] === '/') {
                    expr = key.split('/');
                    expr = new RegExp(expr[1], expr[2]);
                } else {
                    expr = new RegExp("^" + key + "$");
                }
                if (expr.test(c.Component_Name)) {
                    for_each_prop(item.Fields, (item, key) => {
                        add_field(c, key, item);
                    });
                }
            });
        }
    });
}
