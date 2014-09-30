/*jslint browser: true, devel: true, node: true, sloppy: true, plusplus: true*/
/*global wisconsin, $, localStore, FileTransfer, fries, cordova */

window.wisconsin = window.wisconsin || {};

wisconsin.init = function () {
    $('html').click(function () {
        if (!$(event.target).is('li.action-overflow') && !$(event.target).parents().is('li.action-overflow')) {
            $('ol.action-overflow-list').removeClass('active').hide();
        }
    });
};

wisconsin.index = {};

wisconsin.index.pageUri = './index.html';

wisconsin.index.localXMLUri = 'cdvfile://localhost/persistent/wisconsin/index.xml';

wisconsin.index.init = function () {
    if (!localStore.get('repoUrl')) {
        document.location.replace(wisconsin.repo.pageUri);
        return true;
    }

    wisconsin.init();

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
        apkSize,
        apkData,
        items = indexXML.find('application');
    txt += '<li class="list-divider">Your Raccoon Archive</li>';
    $.each(items, function () {
        apkIcon = $('icon', this).text();
        apkTitle = $('name', this).text();
        apkSize = (parseInt($('size', this).text(), 10) / 1000000.0).toFixed(2);
        $('package', this).each(function () {
            apkData = {
                title: apkTitle,
                version: $('version', this).text(),
                size: apkSize,
                downloadUri: localStore.get('repoUrl').replace(/index\.xml$/i, '').replace(/\/$/ig, '') + '/' + $('apkname', this).text(),
                saveUri: wisconsin.index.localXMLUri.replace(/\/index\.xml$/i, '').replace(/\/$/ig, '') + '/data/' + (apkTitle).replace(/\W/g, '_') + '_' + $('version', this).text() + '.apk'
            };
            apkData = JSON.stringify(apkData);
            txt += '<li class="list-item-single-line selectable index-list"><a href=\'javascript:wisconsin.index.fetchApkConfirmation(' + apkData + ');\' data-ignore="true">';
            txt += '<div class="index-list-container">';
            txt += '<div class="apk-icon"><img src="' + apkIcon + '" /></div><div class="apk-info"><h4 class="apk-title">' + apkTitle + '</h4><p class="apk-version">Version: ' + $('version', this).text() + ' [' + apkSize + ' MB]</p></div>';
            txt += '<div class="sep"></div>';
            txt += '</div>';
            txt += '</a></li>';
        });

    });
    $('div.page div.content ul.list').html(txt);
};

wisconsin.index.refresh = function () {
    $('ol.action-overflow-list').toggleClass('active').toggle();
    cordova.plugins.pDialog.init({
        title: 'Please Wait ...',
        message: 'Fetching ' + localStore.get('repoUrl') + '/index.xml',
        progressStyle: 'HORIZONTAL',
        cancelable: false,
        theme: 'DEVICE_DARK'
    }).setProgress(0);

    wisconsin.repo.fetchIndex(function () {
        cordova.plugins.pDialog.setTitle('100% Completed').setMessage('Successfully Fetched index.xml File.');
        setTimeout(function () {
            cordova.plugins.pDialog.dismiss();
            wisconsin.index.init();
        }, 1000);
    }, function (error) {
        cordova.plugins.pDialog.dismiss();
        wisconsin.ui.dialog.alert('There was an Error. Please try again.', function () {}, 'Error', 'Close');
    }, function (progressEvent) {
        cordova.plugins.pDialog.setProgress(Math.floor((progressEvent.loaded / progressEvent.total) * 100));
    });
};

wisconsin.index.exitApp = function () {
    setTimeout(function () {
        navigator.app.exitApp();
    }, 50);
};

wisconsin.index.fetchApkConfirmation = function (apk) {
    wisconsin.ui.dialog.confirm('Do You Want To Install ' + apk.title + ' (v. ' + apk.version + ') [' + apk.size + ' MB]?', function (buttonIndex) {
        if (buttonIndex === 1) {
            wisconsin.index.fetchApk(apk);
        }
    }, 'APK Installation', ['Install', 'Cancel']);
};

wisconsin.index.fetchApk = function (apk) {
    var fileTransfer;
    cordova.plugins.pDialog.init({
        title: 'Please Wait ...',
        message: 'Downlading ' + apk.title + ' (v. ' + apk.version + ') [' + apk.size + ' MB]',
        progressStyle: 'HORIZONTAL',
        cancelable: false,
        theme: 'DEVICE_DARK'
    }).setProgress(0);

    fileTransfer = new FileTransfer();
    fileTransfer.onprogress = function (progressEvent) {
        cordova.plugins.pDialog.setProgress(Math.floor((progressEvent.loaded / progressEvent.total) * 100));
    };
    fileTransfer.download(
        apk.downloadUri,
        apk.saveUri,
        function () {
            cordova.plugins.pDialog.dismiss();
            cordova.plugins.fileOpener2.open(
                apk.saveUri,
                'application/vnd.android.package-archive'
            );
        },
        function (error) {
            cordova.plugins.pDialog.dismiss();
            wisconsin.ui.dialog.alert('There was an Error While Installing ' + apk.title + ' (v. ' + apk.version + '). Please try again.', null, 'APK Installation', 'Close');
        },
        false
    );
};