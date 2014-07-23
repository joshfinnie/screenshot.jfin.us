var express = require('express');

// Constants
var PORT = 1337;

// App
var app = express();
app.get('/', function (req, res) {
  res.json({ status: 200 })
});

app.listen(PORT);
console.log('Running on http://localdocker:' + PORT);
