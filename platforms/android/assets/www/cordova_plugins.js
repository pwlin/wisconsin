cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/io.github.pwlin.cordova.plugins.fileopener2/www/plugins.FileOpener2.js",
        "id": "io.github.pwlin.cordova.plugins.fileopener2.FileOpener2",
        "clobbers": [
            "cordova.plugins.fileOpener2"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.statusbar/www/statusbar.js",
        "id": "org.apache.cordova.statusbar.statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "io.github.pwlin.cordova.plugins.fileopener2": "1.0.9",
    "org.apache.cordova.console": "0.2.10",
    "org.apache.cordova.statusbar": "0.1.7"
}
// BOTTOM OF METADATA
});