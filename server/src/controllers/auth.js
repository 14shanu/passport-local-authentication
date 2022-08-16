import {
  hashPassword,
  comparePassword,
  verifyJWT,
  signJWT,
} from "../../utils/auth";
import cookie from "cookie";
import pool from "../../utils/db";
const mailer = require("../../utils/mailer");
import {
  addUser,
  checkEmailExists,
  getusersByEmail,
  updatePassword,
  updateUserAsActive,
  updateNewPassword,
} from "../queries/queries";
import { createSession, getUser, invalidateSession } from "../sessions";
require("dotenv").config();

import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors/";

export const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  if (!first_name || !last_name || !email || !password) {
    throw new BadRequestError("Please provide all the details..!");
  }

  //check if email exists
  const result = await pool.query(checkEmailExists, [email]);
  if (result.rows.length) {
    // return res.json({ message: "Email is Taken already" });
    throw new BadRequestError("Email Already Exists..!");
  }

  var otp = Math.floor(100000 + Math.random() * 900000);
  console.log(otp);

  const hashedPassword = await hashPassword(password);
  const user = await pool.query(addUser, [
    first_name,
    last_name,
    email,
    hashedPassword,
    otp,
  ]);

  const html = `Hi there,
      <br/>
      Thank you for registering!
      <br/><br/>
      Please verify your email by typing the following Otp:
      <br/>
      Otp: <b>${otp}</b>
      <br/>
      On the following page:
      <a href="http://localhost:3000/user/emailverification">http://localhost:3000/user/emailverification</a>
      <br/><br/>
      Have a pleasant day.`;

  // Send email

  await mailer.sendEmail(
    "subhaschandra.bodakiyavar@veneratesolutions.com",
    email,
    "Verify Your Email!",
    html
  );
  // console.log(user);
  return res.json({ message: "Otp sent to Your Email", success: true });
};

export const verifyemail = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new BadRequestError("email or otp is missing..!");
  }

  // check if our db has user with that email
  const user = await pool.query(getusersByEmail, [email]);

  if (!user.rows.length) {
    // return res.json({ message: "No user found", verified: false });
    throw new UnauthenticatedError("No user found with that email..!");
  }

  const { confirmation_otp } = user.rows[0];
  console.log(confirmation_otp);

  if (confirmation_otp != otp) {
    throw new BadRequestError("Invalid Otp Try Again ..!");
    // return res.json({ message: "Invalid OTP Try Again..!", verified: false });
  }

  const result = await pool.query(updateUserAsActive, [email]);
  return res.json({
    message: "Your email has been verifed You can now login",
    verified: true,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("password", typeof password);
  // check if our db has user with that email
  // const user = await pool.query(getusersByEmail, [email]);
  const user = await getUser(email);
  // console.log(user.rows[0]);
  if (!user.rows.length) {
    throw new BadRequestError("User does not exist..!");
  }

  // check password
  const {
    password: hashedPassword,
    id: user_id,
    role,
    first_name,
    last_name,
    active,
    fullname,
  } = user.rows[0];
  // console.log(active);

  if (!active) {
    throw new UnauthenticatedError(
      "Email is not Verified, Please verify your email..!"
    );
    // return res.json({
    //   message: "Email is not verified You need to verify your mail..!",
    //   auth: false,
    // });
  }

  const match = await comparePassword(password, hashedPassword);
  // create signed jwt
  if (!match) {
    throw new UnauthenticatedError("Invalid Password..!");
  }

  const session = await createSession(email, fullname);
  // console.log(session);

  // console.log(session);
  const payload = {
    _id: user_id,
    email: email,
    fullname: fullname,
    role: role,
    session_id: session.session_id,
  };

  const token = await signJWT(payload, process.env.ACCESS_TOKEN_EXPIRE_TIME);

  const refreshPayload = {
    session_id: session.session_id,
  };

  const refreshToken = await signJWT(
    refreshPayload,
    process.env.REFRESH_TOKEN_EXPIRE_TIME
  );

  // return user and token to client, exclude hashed password
  // send token in cookie
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: process.env.ACCESS_TOKEN_MAX_AGE,
    // secure: true, // only works on https
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: process.env.REFRESH_TOKEN_MAX_AGE,
    // secure: true, // only works on https
  });

  user.rows[0].password = undefined;
  user.rows[0].reset_password = undefined;

  // send user as json response
  res.json({
    user: { id: user_id, role, first_name, last_name, active },
    auth: true,
  });
};

export const logout = async (req, res) => {
  let { token } = cookie.parse(req.headers.cookie);
  if (!token) {
    return res.json({ auth: false, message: "Token is invaild" });
  }
  token = token.replace("token=", "");
  const { payload, expired } = await verifyJWT(token);
  if (!payload) {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    return res.json({
      auth: false,
      message: "Session Expired. Please Login Again",
    });
  }
  const session = await invalidateSession(payload.session_id);
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  return res.json({ message: "Signout success" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("Please provide email..!");
  }

  //check if email exists
  const user = await pool.query(checkEmailExists, [email]);
  if (!user.rows.length) {
    throw new NotFoundError("Email does not exist..!");
    // return res.json({ message: "Email is not registered", status: false });
  }

  var otp = Math.floor(100000 + Math.random() * 900000);
  console.log(otp);

  const html = `Hi there,
      <br/>
      Reset Your Password!
      <br/><br/>
      Please verify your email by typing the following Otp:
      <br/>
      otp: <b>${otp}</b>
      <br/>
      On the following page:
      <a href=http://localhost:3000/user/resetpassword/>http://localhost:3000/user/resetpassword/</a>
      <br/><br/>
      Have a pleasant day.`;

  //send mail
  await mailer.sendEmail(
    "subhaschandra.bodakiyavar@veneratesolutions.com",
    email,
    "Reset Your Password!",
    html
  );

  await pool.query(updatePassword, [email, otp]);

  return res.json({
    message: "otp has been sent to your registered email",
    status: true,
  });
};

export const resetPassword = async (req, res) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    throw new BadRequestError("Please provide all the details ..!");
  }

  //check if email exists
  const user = await pool.query(getusersByEmail, [email]);
  if (!user.rows.length) {
    throw new NotFoundError("Email does not exist..!");
    // return res.json({ message: "Email is not registered", isReset: false });
  }
  const { reset_password } = user.rows[0];

  if (otp === reset_password) {
    const hashedPassword = await hashPassword(password);
    await pool.query(updateNewPassword, [email, hashedPassword]);
    return res.json({
      message: "password updated succesfully You can now login",
      isReset: true,
    });
  } else {
    throw new UnauthenticatedError("Invalid Otp, Try Again");
    // return res.json({
    //   message: "otp didn't matched. Please Try again.",
    //   isReset: false,
    // });
  }
};

export const currentUser = async (req, res) => {
  return res.json({ auth: true, user: req.user });
};

export const page1 = async (req, res) => {
  return res.json({ auth: true, user: req.user });
};
