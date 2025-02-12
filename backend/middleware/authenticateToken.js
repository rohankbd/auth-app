const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // if no token, return unauthorized

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // if token is not valid, return forbidden
    req.user = user;
    next(); // proceed to the next middleware or route handler
  });
}

module.exports = authenticateToken;
