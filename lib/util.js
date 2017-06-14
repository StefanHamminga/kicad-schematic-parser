/**@file
 * @brief Some random non-project specific utility functions.
 * @author Stefan Hamminga <stefan@prjct.net>
 * @copyright Copyright 2017 - Permission is hereby granted to redistribute this
 *            project according to the terms of the LGPL version 3 or higher.
 */

const util = require('util');

module.exports = {
    unquote: function (string) {
        if (typeof string !== 'string') return string;
        string = string.replace(/(^[ \t]+|[ \t\r\n]+$)/g, '');
        string = string.replace(/(^["']+|["']+$)/g, '');
        return string;
    },

    quote: function (string, qchar = '"') {
        if (typeof string === 'undefined') return string;
        return `${qchar}${string}${qchar}`;
    },

    inspect: function (...items) {
        if (!items) return;
        [...items].forEach(item => {
            console.error(
                util.inspect(item, {
                    colors: true,
                    depth: 12,
                    breakLength: process.stdout.columns - 4
                })
            );
        });
    },

    for_each_prop: function (obj, fn) {
        if (obj instanceof Object) {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    fn(obj[key], key);
                }
            }
        }
    },

    onoff: function (item) {
        if (item === true) return true;
        if (item === false) return false;
        if (item === 1) return true;
        if (item === 0) return false;
        if (typeof item === 'string') {
            if (/^(On|Enabled|Yes|Checked)$/i.test(item)) return true;
            if (/^(Off|Disabled|No|Unchecked)$/i.test(item)) return false;
        }
        return !!(item);
    }
};
