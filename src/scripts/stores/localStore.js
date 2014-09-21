/*jslint browser: true, devel: true, node: true, sloppy: true, plusplus: true*/
/**
 * A wrapper around HTML5's localStorage object
 * @constructor
 */
var localStore = {

    /**
     * Get a key
     * @param {String} key
     * @return {String}
     * @public
     */
    get: function (key) {
        return localStorage.getItem('wisconsin-' + key);
    },

    /**
     * Set a key
     * @param {String} key
     * @param {String} val
     * @return {Void}
     * @public
     */
    set: function (key, val) {
        localStorage.setItem('wisconsin-' + key, val);
    },

    /**
     * Remove a key
     * @param {String} key
     * @return {Void}
     * @public
     */
    remove: function (key) {
        localStorage.removeItem('wisconsin-' + key);
    },

    /**
     * Clear local storage
     * @return {Void}
     * @public
     */
    clear: function () {
        localStorage.clear();
    }

};