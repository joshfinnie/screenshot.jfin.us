express = require('express')
bodyParser = require('body-parser')
methodOverride = require('method-override')
logfmt = require("logfmt")
webshot = require('webshot')

validURL = (str) ->
  pattern = new RegExp('^(https?:\\/\\/)?'+ # protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ # domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ # OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ # port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ # query string
  '(\\#[-a-z\\d_]*)?$','i') # fragment locator
  unless pattern.test(str)
    false
  else
    true

PORT = Number(process.env.PORT or 1337)
API_KEY = "8bff0124-7f8b-4345-8a39-da9ba703973e"
opt =
  shotSize:
    width: "all"
    height: "all"
  renderDelay: 15

# App
app = express()
app.use bodyParser.json()
app.use methodOverride()
app.use logfmt.requestLogger()
app.get "/", (req, res) ->
  unless req.query.token is API_KEY
    res.json
      status: 401
      error: "Unauthorized"
    return res.end()
  unless req.query.url?
    res.json
      status: 400
      error: "Bad Request"
      data: "Please include a url."
    return res.end()
  if validURL(req.query.url)
    webshot req.query.url, opt, (err, renderStream) ->
      console.log err  if err
      img = undefined
      img = ""
      renderStream.on "data", (data) ->
        img += data.toString("binary")
      renderStream.on "end", ->
        res.setHeader "Content-Type", "image/png"
        res.writeHead 200
        res.write img, "binary"
        res.end()
  else
    res.json
      status: 400
      error: "Bad Request"
      data: "The URL you provided in not valid."
    res.end()
app.listen PORT, ->
  console.log "Running on port: " + PORT
