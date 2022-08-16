const passport = require("passport");
const LocalStrategy = require("passport-local");
const { getusersByEmail } = require("../src/queries/PLocalQueries");
const { comparePassword } = require("../utils/auth");
const pool = require("../utils/db");
const customFields = {
  usernameField: "email",
  passwordField: "password",
};

const verifyCallback = async (username, password, done) => {
  try {
    const user = await pool.query(getusersByEmail, [username]);
    if (!user.rows.length) {
      return done(null, false);
    }

    // check password
    const { password: hashedPassword, active } = user.rows[0];
    // console.log(active);

    if (!active) {
      return done(null, false);
    }

    const match = await comparePassword(password, hashedPassword);

    if (!match) {
      return done(null, false);
    } else {
      delete user.rows[0].password;
      delete user.rows[0].reset_password;
      delete user.rows[0].confirmation_otp;
      //   console.log(user.rows[0]);

      return done(null, user.rows[0]);
    }
  } catch (err) {
    done(err);
  }
};
const startegy = new LocalStrategy(customFields, verifyCallback);

passport.use(startegy);

passport.serializeUser((user, done) => {
  done(null, user.email);
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
