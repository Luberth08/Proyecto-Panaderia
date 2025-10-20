const requestIp = require("request-ip");

const getClientIp = (req, res, next) => {
  const clientIp = requestIp.getClientIp(req);
  req.clientIp = clientIp;
  next();
};

module.exports = getClientIp;