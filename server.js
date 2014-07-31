var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logfmt = require("logfmt");
var webshot = require('webshot');

// Constants
var PORT = Number(process.env.PORT || 1337);
var API_KEY = '8bff0124-7f8b-4345-8a39-da9ba703973e'

var opt = {
  shotSize: {
    width: "all",
    height: "all"
  },
  renderDelay: 15,
};

function validUrl(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  if(!pattern.test(str)) {
    return false;
  } else {
    return true;
  }
}

// App
var app = express();
app.use(bodyParser.json())
app.use(methodOverride());
app.use(logfmt.requestLogger());

app.get('/', function (req, res) {
  if(req.query.token != API_KEY) {
    res.json({ status: 401, error: "Unauthorized" })
    return res.end()
  }
  if(req.query.url == null) {
    res.json({ status: 400, error: "Bad Request", data: "Please include a url."})
    return res.end()
  }
  if(validUrl(req.query.url)){
    webshot(req.query.url, opt, function(err, renderStream) {
      if(err) {
        console.log(err);
      }
      var img;
      img = "";
      renderStream.on("data", function(data) {
        return img += data.toString("binary");
      });
      return renderStream.on("end", function() {
        res.setHeader("Content-Type", "image/png");
        res.writeHead(200);
        res.write(img, "binary");
        return res.end();
      });
    });
  } else {
    res.json({ status: 400, error: "Bad Request", data: "The URL you provided in not valid."})
    return res.end()
  }
});

app.listen(PORT, function () {
  console.log('Running on port: ' + PORT);
});
