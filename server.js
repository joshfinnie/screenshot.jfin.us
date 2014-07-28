var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var webshot = require('webshot');

// Constants
var PORT = 1337;
var API_KEY = '8bff0124-7f8b-4345-8a39-da9ba703973e'

var opt = {
  shotSize: {
    width: "all",
    height: "all"
  },
  renderDelay: 15,
};

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}
 

// App
var app = express();
app.use(bodyParser.json())
app.use(methodOverride());
app.use(logErrors);

app.get('/', function (req, res) {
  if(req.query.token != API_KEY) {
    res.json({ status: 401, error: "Unauthorized" })
  }
  var url = req.query.url || "www.google.com";
  webshot(url, opt, function(err, renderStream) {
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
});

app.listen(PORT);
console.log('Running on http://localdocker:' + PORT);
