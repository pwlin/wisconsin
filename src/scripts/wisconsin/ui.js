/*jslint browser: true, devel: true, node: true, sloppy: true, plusplus: true*/
/*global wisconsin */

window.wisconsin = window.wisconsin || {};

wisconsin.ui = {};

wisconsin.ui.dialog = {};

wisconsin.ui.dialog.alert = function (message, completeCallback, title, buttonLabel) {
    window.navigator.notification.alert(message, completeCallback, title, buttonLabel);
};

wisconsin.ui.dialog.confirm = function (message, resultCallback, title, buttonLabels) {
    window.navigator.notification.confirm(message, resultCallback, title, buttonLabels);
};