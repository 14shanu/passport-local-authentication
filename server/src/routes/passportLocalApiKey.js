const express = require("express");
const passport = require("passport");
const {
  register,
  verifyemail,
  forgotPassword,
  resetPassword,
} = require("../controllers/passport-local-apikey/p-Local-Apikey-register");

const router = express.Router();
//-----Register Routes--------//
router.post("/plocalapikey/register", register);
router.post("/plocalapikey/verifyemail", verifyemail);
router.patch("/plocalapikey/forgotpassword", forgotPassword);
router.patch("/plocalapikey/resetpassword", resetPassword);

//----------unprotected checking api route----//
router.get("/plocalapikey", (req, res) => {
  res.send("/plocalapikey");
});

//--------login-logout routes----------//
router.post(
  "/plocalapikey/login",
  passport.authenticate("localapikey"),
  (req, res) => {
    console.log("plocalapikey login route");
    res.send("you are logged in");
  }
);
router.get("/plocalapikey/logout", (req, res) => {
  //   console.log("plocalapikey logout route", req.session);
  req.logout();

  res.send(`you are logged out`);
});

//--------------Protected Routes------------------//
router.get("/plocalapikey/protected-route", (req, res, next) => {
  if (req.isAuthenticated()) {
    res.send(
      '<h1>You are authenticated</h1><p><a href="/plocalapikey/logout">Logout and reload</a></p>'
    );
  } else {
    res.send(
      '<h1>You are not authenticated</h1><p><a href="/plocalapikey/login">Login</a></p>'
    );
  }
});

module.exports = router;
