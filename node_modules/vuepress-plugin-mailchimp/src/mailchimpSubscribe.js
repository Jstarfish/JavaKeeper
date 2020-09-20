import jsonp from 'jsonp';
import queryString from 'query-string';
import _debug from 'debug';

const debug = _debug('plugin-mailchimp');

/**
 * If developers make UI customiztion and offer users an option whether to enable.
 * It won't be able to import client dynamic modules if it's disabled.
 * Use commonJs because dynamic import cannot be caught https://github.com/webpack/webpack/issues/5360
 */
let endpoint;
try {
  const options = require('@dynamic/mailchimpOptions');
  endpoint = options.endpoint;
} catch (error) {
  debug('Fail to get options', error.message);
}

const subscribeToMailchimp = function addToMailchimp(email, fields) {
  const emailEncoded = encodeURIComponent(email);
  let url = endpoint.replace(/\/post/g, '/post-json');
  const listFields = fields ? '&' + queryString.stringify(fields) : '';
  const queryParams = `&EMAIL=${emailEncoded}${listFields}`;
  url = `${url}${queryParams}`;

  return new Promise((resolve, reject) =>
    jsonp(url, { param: 'c', timeout: 3500 }, (err, data) => {
      if (err) {
        debug('Request failed', err);
        reject(err);
      }
      if (data) {
        debug('Request success', data);
        resolve(data);
      }
    })
  );
};

export default subscribeToMailchimp;
