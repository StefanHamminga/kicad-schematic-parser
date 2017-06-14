/**@file
 * @brief Field generation functions.
 * @author Stefan Hamminga <stefan@prjct.net>
 * @copyright Copyright 2017 - Permission is hereby granted to redistribute this
 *            project according to the terms of the LGPL version 3 or higher.
 */

const { set_field, add_field, toggle_list_field, has_list_field } = require('./field_manipulation');

module.exports = { generate_footprint };

/**
 * Combine several `comp` Fields into the `Footprint` field.
 * @param  {Object} comp Component data structure
 */
function generate_footprint(comp) {
    function s(string, prefix, postfix, unset) {
        if (typeof string === 'undefined' || string === "" || string === "~") return `${unset || ""}`;
        return (prefix || "") + string + (postfix || "");
    }
    if (has_list_field(comp, "Generate_Fields", "Footprint") &&
        comp.Fields.Footprint_Library &&
        comp.Fields.Footprint_Library.content !== "~" &&
        comp.Fields.Package &&
        comp.Fields.Package.content !== "~") {
        set_field(comp, "Footprint",
            comp.Fields.Footprint_Library.content + ":"
            + s(comp.Fields.Footprint_Prefix.content, "", "_")
            + comp.Fields.Package.content
            + s(comp.Fields.Footprint_Density.content, "_")
            + s(comp.Fields.Height.content, "-")
            + s(comp.Fields.Footprint_Postfix.content, "_")
        );
        // inspect(comp);
    }
}
