/*jslint browser: true, devel: true, node: true, sloppy: true, plusplus: true*/
/*global wisconsin, $, localStore, FileTransfer */

window.wisconsin = window.wisconsin || {};

wisconsin.repo = {};

wisconsin.repo.pageUri = './repo.html';

wisconsin.repo.init = function () {
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
        $('#addRepoUrlForm').hide();
        $('#addRepoUrlLoading header.dialog-title-region .title').html('Please Wait ...');
        $('#addRepoUrlLoading div.dialog-content div.inset p').html('Fetching ' + repoUrl);
        $('#addRepoUrlLoading').show();
        wisconsin.repo.fetchIndex(function () {
            $('#addRepoUrlLoading header.dialog-title-region .title').html('100% Completed');
            $('#addRepoUrlLoading div.dialog-content div.inset p').html('Successfully Fetched index.xml File.');
            setTimeout(function () {
                document.location.replace(wisconsin.index.pageUri);
            }, 500);
        }, function (error) {
            localStore.remove('repoUrl');
            wisconsin.ui.dialog.alert('There was an Error. Please try again.', function () {
                $('#addRepoUrlLoading').hide();
                $('#addRepoUrlLoading header.dialog-title-region .title').html('');
                $('#addRepoUrlLoading div.dialog-content div.inset p').html('');
                $('#addRepoUrlForm').show();
            }, 'Error', 'Close');
        }, function (progressEvent) {
            $('#addRepoUrlLoading header.dialog-title-region .title').html(Math.floor((progressEvent.loaded / progressEvent.total) * 100) + '% Please Wait ...');
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