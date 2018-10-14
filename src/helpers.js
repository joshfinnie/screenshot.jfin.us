const authentication = (req, res, next) => {
  const authToken = process.env.AUTH_TOKEN || 'test';
  const { token } = req.query;
  if (token === authToken) {
    next();
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.status(401);
    res.send(JSON.stringify({
      code: 'Unauthorized',
      error: 'Access Token is invalid.',
    }));
    res.end();
  }
};

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

module.exports = {
  authentication,
  opt,
};
