const {BadRequestError, UnauthorizedError} = require('restify-errors');

const checkUrl = (str) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return pattern.test(str);
};

const validate = ({access_token, url}) => {
  return new Promise((resolve, reject) => {
    if (access_token !== (process.env.ACCESS_TOKEN || 'test')) {
      reject(new UnauthorizedError('Access Token is invalid.'));
    }
    if (!url) {
      reject(new BadRequestError('Please include a URL as a query parameter.'));
    }
    if (!checkUrl(url)) {
      reject(new BadRequestError('The passed URL is malformed.'));
    }
    resolve(url);
  });
};

module.exports.checkUrl = checkUrl;
module.exports.validate = validate;
