const restify = require('restify');
const webshot = require('webshot-node');

const {validate} = require('./helpers');
const {version} = require('../package.json');

const port = process.env.PORT || 8080;
const opt = {
  screenSize: {
    width: 1920,
    height: 1080,
  },
  shotSize: {
    width: 1920,
    height: 1080,
  },
  renderDelay: 3,
};

// Server
const server = restify.createServer({
  name: 'ScreenShot@jfin.us',
});
server.use(restify.plugins.queryParser());

// Routes
server.get('/', async (req, res, next) => {
  try {
    const url = await validate(req.query);
    webshot(url, opt, (err, renderStream) => {
      if (err) {
        console.log(err);
        return next();
      }
      let img = '';
      renderStream.on('data', (data) => {
        img += data.toString('binary');
      });
      return renderStream.on('end', () => {
        res.setHeader('Content-Type', 'image/png');
        res.writeHead(200);
        res.write(img, 'binary');
        res.end();
      });
    });
  } catch (err) {
    next(err);
  }
});

// Export it for Tests.
module.exports = server;

// Let's go!
server.listen(port, () => {
  console.log(
    `${server.name} listening on port ${port} using Version ${version}.`,
  );
});
