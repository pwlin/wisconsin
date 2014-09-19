/*jslint browser: true, devel: true, node: true, sloppy: true*/
/*global FingerBlast, $, localStore */

var wisconsin = {};

wisconsin.init = function () {
    if (!navigator.userAgent.match(/Android/i)) {
        new FingerBlast('body');
    }

    if (!localStore.get('racoonRepo')) {
        console.log('add repo');
    }







};