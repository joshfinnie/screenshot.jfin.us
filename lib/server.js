'use strict'
var restify = require("restify")
var plugins = require("restify-plugins")
var webshot = require("webshot")

var helpers = require("./helpers")
var version = require("../package.json").version
var port = process.env.PORT || 8080
let opt = {
    screenSize: {
        width: 1920,
        height: 1080
    },
    shotSize: {
        width: 1920,
        height: 1080
    },
    renderDelay: 3
}

// Server
var server = restify.createServer({
    name: "ScreenShot@jfin.us",
    versions: version
})
server.use(restify.plugins.queryParser())

// Routes
server.get("/", function(req, res, next) {
    return helpers.validate(req.query, function(err) {
        if (err) {
            return next(err)
        }
        webshot(req.query.url, opt, function(err, renderStream) {
            if (err) {
                console.log(err)
            }
            let img = undefined
            img = ""
            renderStream.on("data", data => img += data.toString("binary"))
            return renderStream.on("end", function() {
                res.setHeader("Content-Type", "image/png")
                res.writeHead(200)
                res.write(img, "binary")
                res.end()
            })
        })
        return next()
    })
})

// Export it for Tests.
module.exports = server

// Let's go!
server.listen(port, () => {
    console.log(`${server.name} listening on port ${port} using Version ${server.versions}.`)
})
