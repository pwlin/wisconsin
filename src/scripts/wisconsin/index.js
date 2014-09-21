/*jslint browser: true, devel: true, node: true, sloppy: true, plusplus: true*/
/*global wisconsin, $, localStore, FileTransfer, fries, cordova */

window.wisconsin = window.wisconsin || {};

wisconsin.index = {};

wisconsin.index.pageUri = './index.html';

wisconsin.index.localXMLUri = 'cdvfile://localhost/persistent/wisconsin/index.xml';

wisconsin.index.init = function () {
    if (!localStore.get('repoUrl')) {
        document.location.replace(wisconsin.repo.pageUri);
    }
    $.ajax({
        url: wisconsin.index.localXMLUri,
        type: 'GET',
        dataType: 'text',
        success: function (response) {
            wisconsin.index.list(response);
        },
        error: function (xhr, t, msg) {
            document.location.replace(wisconsin.repo.pageUri);
        }
    });
};

/**
 * List APKs on main page
 * @param {XML} indexDoc content of index.xml file
 */
wisconsin.index.list = function (indexXML) {
    indexXML = $($.parseXML(indexXML));
    var txt = '',
        apkIcon,
        apkTitle,
        apkData,
        items = indexXML.find('application');
    txt += '<li class="list-divider">Your Raccoon Archive</li>';
    $.each(items, function () {
        apkIcon = $('icon', this).text();
        apkTitle = $('name', this).text();
        $('package', this).each(function () {
            apkData = {
                'title': apkTitle,
                'version': $('version', this).text(),
                'downloadUri': localStore.get('repoUrl').replace(/index\.xml$/i, '').replace(/\/$/ig, '') + '/' + $('apkname', this).text(),
                'saveUri': wisconsin.index.localXMLUri.replace(/\/index\.xml$/i, '').replace(/\/$/ig, '') + '/data/' + (apkTitle).replace(/\W/g, '_') + '_' + $('version', this).text() + '.apk'
            };
            apkData = JSON.stringify(apkData);
            txt += '<li class="list-item-single-line selectable index-list"><a href=\'javascript:wisconsin.index.fetchApkConfirmation(' + apkData + ');\' data-ignore="true">';
            txt += '<div class="index-list-container">';
            txt += '<div class="apk-icon"><img src="' + apkIcon + '" /></div><div class="apk-info"><h4 class="apk-title">' + apkTitle + '</h4><p class="apk-version">Version: ' + $('version', this).text() + ' (' + (parseInt($('size', this).text(), 10) / 1000000.0).toFixed(2) + ' MB)</p></div>';
            txt += '<div class="sep"></div>';
            txt += '</div>';
            txt += '</a></li>';
        });

    });
    $('div.page div.content ul.list').html(txt);
};

wisconsin.index.refresh = function () {
    $('#button-refresh').hide();
    $('#content-main').hide();
    $('#content-loading header.dialog-title-region .title').html('Please Wait ...');
    $('#content-loading div.dialog-content div.inset p').html('Fetching ' + localStore.get('repoUrl') + '/index.xml');
    $('#content-loading').show();
    wisconsin.repo.fetchIndex(function () {
        $('#content-loading header.dialog-title-region .title').html('100% Completed');
        $('#content-loading div.dialog-content div.inset p').html('Successfully Fetched index.xml File.');
        setTimeout(function () {
            $('#content-loading').hide();
            $('#content-loading header.dialog-title-region .title').html('');
            $('#content-loading div.dialog-content div.inset p').html('');
            $('#content-main').show();
            wisconsin.index.init();
        }, 1000);
        setTimeout(function () {
            $('#button-refresh').show();
            $('#button-refresh').focus().blur();
        }, 5000);
    }, function (error) {
        wisconsin.ui.dialog.alert('There was an Error. Please try again.', function () {
            $('#content-loading').hide();
            $('#content-loading header.dialog-title-region .title').html('');
            $('#content-loading div.dialog-content div.inset p').html('');
            $('#content-main').show();
        }, 'Error', 'Close');
        setTimeout(function () {
            $('#button-refresh').show();
            $('#button-refresh').focus().blur();
        }, 2000);
    }, function (progressEvent) {
        $('#content-loading header.dialog-title-region .title').html(Math.floor((progressEvent.loaded / progressEvent.total) * 100) + '% Please Wait ...');
    });
};

wisconsin.index.exitApp = function () {
    setTimeout(function () {
        navigator.app.exitApp();
    }, 50);
};

wisconsin.index.fetchApkConfirmation = function (apk) {
    wisconsin.ui.dialog.confirm('Do You Want To Install ' + apk.title + ' (v. ' + apk.version + ')', function (buttonIndex) {
        if (buttonIndex === 1) {
            wisconsin.index.fetchApk(apk);
        }
    }, 'APK Installation', ['Install', 'Cancel']);
};

wisconsin.index.fetchApk = function (apk) {
    var toast,
        fileTransfer;
    toast = new fries.Toast({
        content: 'Downlading ' + apk.title + ' (v. ' + apk.version + ') ...',
        duration: fries.Toast.duration.SHORT
    });
    fileTransfer = new FileTransfer();
    fileTransfer.onprogress = function () {};
    fileTransfer.download(
        apk.downloadUri,
        apk.saveUri,
        function () {
            cordova.plugins.fileOpener2.open(
                apk.saveUri,
                'application/vnd.android.package-archive'
            );
        },
        function (error) {
            wisconsin.ui.dialog.alert('There was an Error While Installing ' + apk.title + ' (v. ' + apk.version + '). Please try again.', null, 'APK Installation', 'Close');
        },
        false
    );
};