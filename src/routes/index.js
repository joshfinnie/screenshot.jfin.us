const express = require('express');
const webshot = require('webshot');

const { authentication, opt } = require('../helpers');

const router = express.Router();

/* GET home page. */
router.get('/', authentication, (req, res) => {
  webshot(req.query.url, opt, (err, renderStream) => {
    if (err) throw new Error(err);
    let img = '';
    renderStream.on('data', (data) => { img += data.toString('binary'); });
    return renderStream.on('end', () => {
      res.setHeader('Content-Type', 'image/png');
      res.writeHead(200);
      res.write(img, 'binary');
      res.end();
    });
  });
});

module.exports = router;
