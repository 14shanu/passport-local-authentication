const BadRequestError = require("./bad-request");
const CustomAPIError = require("./custom-error");
const NotFoundError = require("./not-found");
const UnauthenticatedError = require("./unauthenticated");
const UnauthorizedError = require("./unauthorized");

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  UnauthorizedError,
};
