'use strict';

var request = require('superagent');
var Promise = require('../promise');

var handleError = function handleError(error, res) {
  if (res) {
    error.statusCode = res.status;
    error.responseText = res.text;
    error.response = res.body;
  }
  return error;
};

module.exports = function upload(uploadInfo, data, file) {
  var saveOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  file.attributes.url = uploadInfo.url;
  file._bucket = uploadInfo.bucket;
  file.id = uploadInfo.objectId;
  return new Promise(function (resolve, reject) {
    // 海外节点，针对 S3 才会返回 upload_url
    var req = request('PUT', uploadInfo.upload_url).set(Object.assign({
      'Content-Type': file.get('mime_type'),
      'Cache-Control': 'public, max-age=31536000'
    }, file._uploadHeaders));
    if (saveOptions.onprogress) {
      req.on('progress', saveOptions.onprogress);
    }
    req.on('response', function (res) {
      if (res.ok) return resolve(file);
      reject(handleError(res.error, res));
    });
    req.on('error', function (err, res) {
      return reject(handleError(err, res));
    });
    /* NODE-ONLY:start */
    if (data instanceof require('stream')) {
      // data.pipe(req);
      throw new TypeError('Saving an AV.File from a Stream to S3 is not yet supported');
    }
    /* NODE-ONLY:end */
    req.send(data).end();
  });
};