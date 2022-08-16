const express = require("express");
const passport = require("passport");
const {
  register,
  verifyemail,
  forgotPassword,
  resetPassword,
} = require("../controllers/passport-local/p-LocalRegister");
const router = express.Router();

router.post("/plocal/register", register);

router.post("/plocal/verifyemail", verifyemail);

router.patch("/plocal/forgotpassword", forgotPassword);

router.patch("/plocal/resetpassword", resetPassword);

router.get("/plocal", (req, res) => {
  res.send("/plocal-home");
});

router.post("/plocal/login", passport.authenticate("local"), (req, res) => {
  console.log("plocal login route");
  res.send("you are logged in");
});

router.get("/plocal/logout", (req, res) => {
  //   console.log("plocal logout route", req.session);
  req.logout();

  res.send(`you are logged out`);
});

router.get("/plocal/protected-route", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.send(
      '<h1>You are authenticated</h1><p><a href="/plocal/logout">Logout and reload</a></p>'
    );
  } else {
    res.send(
      '<h1>You are not authenticated</h1><p><a href="/plocal/login">Login</a></p>'
    );
  }
});

module.exports = router;
