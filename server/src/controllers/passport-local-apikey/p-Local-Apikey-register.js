import pool from "../../../utils/db";
import mailer from "../../../utils/mailer";

import {
  addUser,
  checkEmailExists,
  getusersByEmail,
  updateNewPassword,
  updatePassword,
  updateUserAsActive,
} from "../../queries/PLocalApikeyQueries";
import { hashPassword } from "../../../utils/auth";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../../errors";
import {
  P_LocalRegisterOtpHtmlTemplate,
  P_LocalResetPasswordHtmlTemplate,
} from "../../../utils/EmailTemplates/passportLocal/PassportLocalHtmlTemplates";
require("dotenv").config();
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
  // console.log(otp);

  const hashedPassword = await hashPassword(password);
  const user = await pool.query(addUser, [
    first_name,
    last_name,
    email,
    hashedPassword,
    otp,
  ]);

  // Send email
  const html = await P_LocalRegisterOtpHtmlTemplate(otp);
  await mailer.sendEmail(
    process.env.OUTLOOK_USER,
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
  //   console.log(confirmation_otp);

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
  // console.log(otp);

  //send mail
  const html = await P_LocalResetPasswordHtmlTemplate(otp);
  await mailer.sendEmail(
    process.env.OUTLOOK_USER,
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
  // require("./config/passportlocal");
  // console.log("otp", otp);

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
  // console.log("user", user.rows[0]);
  if (otp == reset_password) {
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
