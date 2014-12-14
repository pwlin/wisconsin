/*jslint browser: true, devel: true, node: true, sloppy: true, plusplus: true*/
/*global wisconsin */

window.wisconsin = window.wisconsin || {};

wisconsin.utils = {};

wisconsin.utils.onDeviceReady = function (cb) {
    document.addEventListener('deviceready', cb, false);
};

wisconsin.utils.forEach = function (obj, cb) {
    var i,
        l,
        k;
    if (/String|Array/.test(Object.prototype.toString.call(obj))) {
        for (i = 0, l = obj.length; i < l; i++) {
            if (cb) {
                cb(i, obj[i]);
            }
        }
    } else {
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                if (cb) {
                    cb(k, obj[k]);
                }
            }
        }
    }
};

wisconsin.utils.base64Encode = function (str) {
    return btoa(str);
};

wisconsin.utils.base64Decode = function (str) {
    return atob(str);
};