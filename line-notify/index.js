var fs = require('fs');
var rp = require('request-promise');
var config = require('./config.js');

function send(formData) {
    var options = {
        method: 'POST',
        uri: 'https://notify-api.line.me/api/notify',
        formData,
        headers: {
            Authorization: `Bearer ${config.accessToken}`
        }
    };

    rp(options)
        .then(function () {
            console.log('Sent');
        })
        .catch(function (err) {
            console.log('Error:', err.message);
        });
}

function sendText() {
    var formData = {
        message: 'เราจะทำตามสัญญา', // 1000 characters max
    };
    send(formData);
}

function sendImageUrl() {
    var formData = {
        message: 'เราจะทำตามสัญญา', // 1000 characters max
        imageThumbnail: 'https://site-assets.mediaoxide.com/workpointnews/2018/09/03092841/1535941719_76412_.jpg', // Maximum size of 240×240px JPEG
        imageFullsize: 'https://site-assets.mediaoxide.com/workpointnews/2018/09/03092841/1535941719_76412_.jpg', // Maximum size of 1024×1024px JPEG
    };
    send(formData);
}

function sendImageFile() {
    var formData = {
        message: 'เราจะทำตามสัญญา', // 1000 characters max
        imageFile: {
            value: fs.createReadStream('image.png'),
            options: {
                filename: 'image.png',
                contentType: 'image/png'
            }
        }
    };
    send(formData);
}

function sendSticker() {
    var formData = {
        message: 'เราจะทำตามสัญญา', // 1000 characters max
        stickerPackageId: 1,
        stickerId: 5, // https://devdocs.line.me/files/sticker_list.pdf
    };
    send(formData);
}

sendText();
// sendImageUrl();
// sendImageFile();
// sendSticker();