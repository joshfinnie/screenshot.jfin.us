const test = require('tape');
const request = require('supertest');

const server = require('../src/app');

test.onFinish(() => process.exit(0));

test('GET /', (t) => {
  request(server).get('/')
    .expect(401)
    .end((err, res) => {
      const expected = {
        code: 'Unauthorized',
        error: 'Access Token is invalid.',
      };
      t.same(null, err);
      t.same(res.body, expected);
      t.end();
    });
});

test('GET /?token=test', (t) => {
  request(server).get('/?token=test')
    .expect(400)
    .end((err, res) => {
      const expected = {
        code: 'BadRequest',
        message: 'Please include a URL as a query parameter.',
      };
      t.same(null, err);
      t.same(expected, res.body);
      t.end();
    });
});

test('GET /?token=test&url=aoeu', (t) => {
  request(server).get('/?token=test&url=aoeu')
    .expect(400)
    .end((err, res) => {
      const expected = {
        code: 'BadRequest',
        message: 'The passed URL is malformed.',
      };
      t.same(null, err);
      t.same(expected, res.body);
      t.end();
    });
});

test('GET /?token=test&url=google.com', (t) => {
  request(server).get('/?token=test&url=google.com')
    .expect(200)
    .end((err) => {
      t.same(null, err);
      t.end();
    });
});
