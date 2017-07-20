'use strict'
var test = require("tape")
var helpers = require("../lib/helpers")

test("checkUrl", function(t) {
    t.same(helpers.checkUrl("aoeu"), false)
    t.same(helpers.checkUrl("test.com"), true)
    t.same(helpers.checkUrl("http://test.com"), true)
    t.same(helpers.checkUrl("http://www.test.com"), true)
    t.same(helpers.checkUrl("https://test.com"), true)
    t.same(helpers.checkUrl("https://www.test.com"), true)
    t.same(helpers.checkUrl("8.8.8.8"), true)
    t.same(helpers.checkUrl("test.com:1337"), true)
    t.same(helpers.checkUrl("8.8.8.8:1337"), true)
    t.same(helpers.checkUrl("test.com/?test=ok&foo=bar"), true)
    t.same(helpers.checkUrl("test.com/index.html"), true)
    t.same(helpers.checkUrl("test.com/index.html#fragment"), true)
    t.end()
})

test("validate", function(t) {
    // url, but no access_token parameter
    const expected1 = {
        code: 'Unauthorized',
        message: 'Access Token is invalid.'
    }
    helpers.validate({
        url: "test.com"
    }, (err) => {
        t.same(err.body, expected1)
    })

    // access_token, but no url parameter
    const expected2 = {
        code: 'BadRequest',
        message: 'Please include a URL as a query parameter.'
    }
    helpers.validate({
        access_token: "test"
    }, (err) => {
        t.same(err.body, expected2)
    })

    // bad URL
    const expected3 = {
        code: 'BadRequest',
        message: 'The passed URL is malformed.'
    }
   helpers.validate({
        access_token: "test",
        url: "aoeu"
    }, (err) => {
        t.same(err.body, expected3)
    }) 

    // everything a-okay
    helpers.validate({
        access_token: "test",
        url: "test.com"
    }, (err) => {
        t.same(err, null)
    })
    t.end()
})
