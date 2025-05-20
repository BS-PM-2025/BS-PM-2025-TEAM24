const jwt = require("jsonwebtoken");
const { SECRET } = require("../constants");

verifyToken = (req, res, next) => {
  let token = null;

  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.headers["x-access-token"]) {
    token = req.headers["x-access-token"];
  }

  if (!token) {
    return res.status(401).send({ message: "No token provided!" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = {
  verifyToken,
};
