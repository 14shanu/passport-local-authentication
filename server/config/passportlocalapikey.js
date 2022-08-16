const passport = require("passport");
const LocalAPIKeyStrategy = require("passport-localapikey").Strategy;
const { getusersByEmail } = require("../src/queries/PLocalApikeyQueries");
const { comparePassword } = require("../utils/auth");
const pool = require("../utils/db");
const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const verifyCallback = async (apikey, done) => {
  try {
    // console.log({ apikey });
    const user = await pool.query(getusersByEmail, [apikey]);
    // console.log({ user: user.rows });
    if (!user.rows.length) {
      return done(null, false);
    }

    // check password
    const { active } = user.rows[0];
    // console.log(active);

    if (!active) {
      return done(null, false);
    }

    delete user.rows[0].password;
    delete user.rows[0].reset_password;
    delete user.rows[0].confirmation_otp;
    // console.log(user.rows[0]);

    return done(null, user.rows[0]);
  } catch (err) {
    console.log(err);
    done(err);
  }
};
const apiKeystartegy = new LocalAPIKeyStrategy(customFields, verifyCallback);

passport.use(apiKeystartegy);

passport.serializeUser((user, done) => {
  // console.log({ user });
  try {
    done(null, user.email);
  } catch (error) {
    console.log({ error123: error });
  }
});

passport.deserializeUser(async (userEmail, done) => {
  try {
    const user = await pool.query(getusersByEmail, [userEmail]);
    // console.log(user.rows[0]);
    delete user.rows[0].password;
    delete user.rows[0].reset_password;
    delete user.rows[0].confirmation_otp;
    done(null, user);
  } catch (err) {
    done(err);
  }
});
