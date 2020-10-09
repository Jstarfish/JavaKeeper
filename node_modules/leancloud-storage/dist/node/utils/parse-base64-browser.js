'use strict';

var dataURItoBlob = function dataURItoBlob(dataURI, type) {
  var byteString;

  // 传入的 base64，不是 dataURL
  if (dataURI.indexOf('base64') < 0) {
    byteString = atob(dataURI);
  } else if (dataURI.split(',')[0].indexOf('base64') >= 0) {
    type = type || dataURI.split(',')[0].split(':')[1].split(';')[0];
    byteString = atob(dataURI.split(',')[1]);
  } else {
    byteString = unescape(dataURI.split(',')[1]);
  }
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], { type: type });
};

module.exports = dataURItoBlob;