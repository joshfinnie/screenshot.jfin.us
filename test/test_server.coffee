request = require('supertest')
express = require('express')

app = require("../server")

describe "GET /", ->
  it "respond with json, 'Unauthorized'", (done) ->
    request(app).get('/').expect(401).end (err, res) ->
      return done(err) if err
      done()

describe "GET /?token=test", ->
  it "should respond with a 400 error because of no URL", (done) ->
    request(app).get('/?token=test').expect(400).end (err, res) ->
      return done(err) if err
      done()

describe "GET /?token=test&url=google.com", ->
  it "should respond with a 200 error because it works", (done) ->
    request(app).get('/?token=test&url=google.com').expect(200).end (err, res) ->
      return done(err) if err
      done()

describe "GET /?token=test&url=aoeu", ->
  it "should respond with a 400 error because of no URL", (done) ->
    request(app).get('/?token=test&url=aoeu').expect(400).end (err, res) ->
      return done(err) if err
      done()
