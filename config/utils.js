const jwt = require("jsonwebtoken");
const APP_SECRET = "GraphQL-secret";

function getUserId(context) {
  const authorizationHeader = context.request.get("Authorization");

  if (authorizationHeader) {
    const token = authorizationHeader.replace("Bearer ", "");
    const { userId } = jwt.verify(token, APP_SECRET);

    return userId;
  }

  throw new Error("Not authenticated");
}

module.exports = {
  APP_SECRET,
  getUserId
};
