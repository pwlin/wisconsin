/*jslint browser: true, devel: true, node: true, sloppy: true, plusplus: true*/
/**
 * A wrapper around HTML5's sessionStorage object
 * @constructor
 */
var sessionStore = {

    /**
     * Get a key
     * @param {String} key
     * @return {String}
     * @public
     */
    get: function (key) {
        return sessionStorage.getItem('wisconsin-' + key);
    },

    /**
     * Set a key
     * @param {String} key
     * @param {String} val
     * @return {Void}
     * @public
     */
    set: function (key, val) {
        sessionStorage.setItem('wisconsin-' + key, val);
    },

    /**
     * Remove a key
     * @param {String} key
     * @return {Void}
     * @public
     */
    remove: function (key) {
        sessionStorage.removeItem('wisconsin-' + key);
    },

    /**
     * Clear local storage
     * @return {Void}
     * @public
     */
    clear: function () {
        sessionStorage.clear();
    }

};