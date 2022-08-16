import bcrypt from "bcrypt";
// import jwt from "express-jwt";
import jwt from "jsonwebtoken";

require("dotenv").config();

export const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }

      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

export const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

// sign jwt
export async function signJWT(payload, expiresIn) {
  return await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
}

// verify jwt
export async function verifyJWT(token) {
  try {
    var decoded = await jwt.verify(token, process.env.JWT_SECRET);
    // var decoded = await jwt.verify(token, "process.env.JWT_SECRET");
    console.log(decoded);
    return { payload: decoded, expired: false };
  } catch (error) {
    // @ts-ignore
    return { payload: null, expired: error.message.includes("jwt expired") };
  }
}
