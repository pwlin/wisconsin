/*jslint browser: true, devel: true, node: true, sloppy: true, plusplus: true*/
/*global wisconsin, $, localStore, FileTransfer, cordova */

window.wisconsin = window.wisconsin || {};

wisconsin.repo = {};

wisconsin.repo.pageUri = './repo.html';

wisconsin.repo.init = function () {
    wisconsin.init();
    $('#repoUrl').val(localStore.get('repoUrl'));
};

wisconsin.repo.addUrl = function () {
    var repoUrl = $.trim(String($('#repoUrl').val()));
    if (repoUrl === '') {
        wisconsin.ui.dialog.alert('Please Type Your Repository URL.', null, 'Missing Field Value', 'Close');
    } else if (!repoUrl.match(/^http/i)) {
        wisconsin.ui.dialog.alert('Please Start The URL With "HTTP" or "HTTPS".', null, 'Error', 'Close');
    } else {
        repoUrl = $.trim(String(repoUrl.replace(/index\.xml$/i, '').replace(/\/$/ig, '')));
        repoUrl = repoUrl + '/index.xml';
        localStore.set('repoUrl', repoUrl.replace(/index\.xml$/i, '').replace(/\/$/ig, ''));
        cordova.plugins.pDialog.init({
            title: 'Please Wait ...',
            message: 'Fetching ' + repoUrl,
            progressStyle: 'HORIZONTAL',
            cancelable: false,
            theme: 'DEVICE_DARK'
        }).setProgress(0);
        wisconsin.repo.fetchIndex(function () {
            cordova.plugins.pDialog.setTitle('100% Completed').setMessage('Successfully Fetched index.xml File.');
            setTimeout(function () {
                cordova.plugins.pDialog.dismiss();
                document.location.replace(wisconsin.index.pageUri);
            }, 500);
        }, function (error) {
            localStore.remove('repoUrl');
            cordova.plugins.pDialog.dismiss();
            wisconsin.ui.dialog.alert('There was an Error. Please try again.', function () {}, 'Error', 'Close');
        }, function (progressEvent) {
            cordova.plugins.pDialog.setProgress(Math.floor((progressEvent.loaded / progressEvent.total) * 100));
        });
    }
};

/**
 * Fetch index.xml file
 * @param {Function} cbSuccess  onSuccess Callback
 * @param {Function} cbFail onFail Callback
 * @param {Function} cbProgress onProgress Callback
 */
wisconsin.repo.fetchIndex = function (cbSuccess, cbFail, cbProgress) {
    var fileTransfer = new FileTransfer();
    fileTransfer.onprogress = cbProgress;
    fileTransfer.download(
        localStore.get('repoUrl') + '/index.xml?' + new Date().valueOf(),
        wisconsin.index.localXMLUri,
        cbSuccess,
        cbFail,
        false
    );
};