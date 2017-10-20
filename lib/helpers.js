'use strict'
const errs = require("restify-errors")

const checkUrl = function(str) {
    const pattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$", "i") // fragment locator
    return pattern.test(str)
}

const validate = function (queries, cb) {
    // Check if Access Token is correct
    const token = queries.access_token || ""
    if (token !== (process.env.ACCESS_TOKEN || "test")) {
        return cb(new errs.UnauthorizedError("Access Token is invalid."))
    }
    // Check if there is a URL in the query parameters.
    const url = queries.url
    if (!url) {
        return cb(new errs.BadRequestError("Please include a URL as a query parameter."))
    } else {
        if (!checkUrl(url)) {
            return cb(new errs.BadRequestError("The passed URL is malformed."))
        }
    }
    return cb(null)
}

module.exports.checkUrl = checkUrl
module.exports.validate = validate
