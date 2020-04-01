const test = require('tape');
const request = require('supertest');
const server = require('../lib/server');

test.onFinish(() => process.exit(0));

test('GET /', (t) => {
  request(server)
    .get('/')
    .expect(401)
    .end((err, res) => {
      const expected = {
        code: 'Unauthorized',
        message: 'Access Token is invalid.',
      };
      t.same(expected.message, res.body.message);
      t.end();
    });
});

test('GET /?access_token=test', (t) => {
  request(server)
    .get('/?access_token=test')
    .expect(400)
    .end((err, res) => {
      const expected = {
        code: 'BadRequest',
        message: 'Please include a URL as a query parameter.',
      };
      t.same(expected.message, res.body.message);
      t.end();
    });
});

test('GET /?access_token=test&url=aoeu', (t) => {
  request(server)
    .get('/?access_token=test&url=aoeu')
    .expect(400)
    .end((err, res) => {
      const expected = {
        code: 'BadRequest',
        message: 'The passed URL is malformed.',
      };
      t.same(expected.message, res.body.message);
      t.end();
    });
});

test('GET /?access_token=test&url=google.com', (t) => {
  request(server)
    .get('/?access_token=test&url=google.com')
    .expect(200)
    .end((err, res) => {
      t.same(null, err);
      t.notSame(null, res);
      t.end();
    });
});
