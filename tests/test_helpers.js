var tape = require('tape');
var _test = require('tape-promise').default; // <---- notice 'default'
var test = _test(tape); // decorate tape

const {checkUrl, validate} = require('../lib/helpers');

test('checkUrl', (t) => {
  t.same(checkUrl('aoeu'), false);
  t.same(checkUrl('test.com'), true);
  t.same(checkUrl('http://test.com'), true);
  t.same(checkUrl('http://www.test.com'), true);
  t.same(checkUrl('https://test.com'), true);
  t.same(checkUrl('https://www.test.com'), true);
  t.same(checkUrl('8.8.8.8'), true);
  t.same(checkUrl('test.com:1337'), true);
  t.same(checkUrl('8.8.8.8:1337'), true);
  t.same(checkUrl('test.com/?test=ok&foo=bar'), true);
  t.same(checkUrl('test.com/index.html'), true);
  t.same(checkUrl('test.com/index.html#fragment'), true);
  t.end();
});

test('validate no token', async (t) => {
  t.plan(1);
  const expected1 = 'Access Token is invalid.';
  try {
    await validate({
      url: 'test',
    });
  } catch (e) {
    t.same(e.message, expected1);
  }
  t.end();
});

test('validate no url', async (t) => {
  t.plan(1);
  const expected1 = 'Please include a URL as a query parameter.';
  try {
    await validate({
      access_token: 'test',
    });
  } catch (e) {
    t.same(e.message, expected1);
  }
  t.end();
});

test('validate malformed url', async (t) => {
  t.plan(1);
  const expected1 = 'The passed URL is malformed.';
  try {
    await validate({
      access_token: 'test',
      url: 'aoeu',
    });
  } catch (e) {
    t.same(e.message, expected1);
  }
  t.end();
});

test('validate everything okay', async (t) => {
  t.plan(1);
  try {
    const url = await validate({
      access_token: 'test',
      url: 'google.com',
    });
    t.same(url, 'google.com');
  } catch (e) {
  }
  t.end();
});
