require("dotenv").config();
require("express-async-errors");
import helmet from "helmet";
import express from "express";
import fs from "fs";
import cors from "cors";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import notFound from "./src/middleware/not-found";
import errorHandlerMiddleware from "./src/middleware/error-handler";
import pool from "./utils/db";
import passport from "passport";

const expressSession = require("express-session");
const pgSession = require("connect-pg-simple")(expressSession);

// const passportSetup = require("./utils/passport.config");
var path = require("path");
const morgan = require("morgan");

const csrfProtection = csrf({ cookie: true });

//create express app
const app = express();

//apply middlewares
app.use(cookieParser());

app.use(cors());

app.use(helmet());

////////---------Sessions------------------>>>>>>>>>
const sessionStore = new pgSession({
  pool: pool, //Connecting pool
  tableName: process.env.SESSION_TABLE_NAME,
  //Insert Pg-simple-connect options here
});
app.use(
  expressSession({
    store: sessionStore,
    secret: process.env.SESSION_COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, //1 day
    //Insert express-session options here
  })
);

////-------------------////
app.use(express.json());

//------------logging using morgan library----------------->
var accessLogStream = fs.createWriteStream(
  path.join(__dirname, "./logs/access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));

//------passport-common-setup------------>
app.use(passport.initialize());
app.use(passport.session());

//---------passport-local------------->
// require("./config/passportlocal");

//-------passport-localapikey------------------>
require("./config/passportlocalapikey");

// ---------Routing---------------->
fs.readdirSync("./src/routes").map((route) =>
  app.use("/expressapi", require(`./src/routes/${route}`))
);

//--------csrf-Token----------->

//csrf
// app.use(csrfProtection);

// app.get("/expressapi/csrf-token", (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });

//------------Error-Handling---------------->
app.use(notFound);
app.use(errorHandlerMiddleware);

//-----------server listening-port------------->
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
