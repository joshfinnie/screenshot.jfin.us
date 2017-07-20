'use strict'
var test = require("tape")
var request = require("supertest")
var server = require("../lib/server")

test.onFinish(() => process.exit(0))

test("GET /", function(t) {
    request(server).get("/")
        .expect(401)
        .end(function(err, res) {
            const expected = {
                code: "Unauthorized",
                message: "Access Token is invalid."
            }
            t.same(null, err)
            t.same(expected, res.body)
            t.end()
        })
})

test("GET /?token=test", function(t) {
    request(server).get("/?access_token=test")
        .expect(400)
        .end(function(err, res) {
            const expected = {
                code: "BadRequest",
                message: "Please include a URL as a query parameter."
            }
            t.same(null, err)
            t.same(expected, res.body)
            t.end()
        })
})

test("GET /?token=test&url=aoeu", function(t) {
    request(server).get("/?access_token=test&url=aoeu")
        .expect(400)
        .end(function(err, res) {
            const expected = {
                code: "BadRequest",
                message: "The passed URL is malformed."
            }
            t.same(null, err)
            t.same(expected, res.body)
            t.end()
        })
})

test("GET /?token=test&url=google.com", function(t) {
    request(server).get("/?access_token=test&url=google.com")
        .expect(200)
        .end(function(err, res) {
            t.same(null, err)
            t.end()
        })
})
