import jwt from "jsonwebtoken";
import cookie from "cookie";
import { signJWT, verifyJWT } from "../../utils/auth";
import { getSession, getUserSession } from "../sessions";
require("dotenv").config();

var localStorage = require("local-storage");

export const requireSignin = async (req, res, next) => {
  try {
    let { token, refreshToken } = cookie.parse(req.headers.cookie);
    // let token = localStorage.get('token')
    // console.log("req.headers.cookie", req.headers.cookie);
    // console.log("token", token);
    if (!token) {
      return res.json({ auth: false, message: "Token is invaild" });
    }

    token = token.replace("token=", "");
    // console.log("tokennew", token);
    const { payload, expired } = await verifyJWT(token);
    // var decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("payload", payload);
    if (payload) {
      req.user = payload;
      return next();
    }
    // expired but valid access token
    refreshToken = refreshToken.replace("refreshToken=", "");
    const { payload: refresh } =
      expired && refreshToken
        ? await verifyJWT(refreshToken)
        : { payload: null };
    // console.log("refreshToken", refreshToken);
    // console.log("refresh", refresh);

    if (!refresh) {
      return res.json({
        auth: false,
        message: "Session Expired. Please Login Again",
      });
    }
    const session = await getSession(refresh.session_id);
    console.log("session", session);
    if (!session) {
      return res.json({
        auth: false,
        message: "No session Found",
      });
    }

    const user = await getUserSession(session.email);
    if (!user) {
      return res.json({
        auth: false,
        message: "User Not Found",
      });
    }
    const sessionInfo = {
      _id: user.user_id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
      session_id: session.session_id,
    };
    const newAccessToken = await signJWT(
      sessionInfo,
      process.env.ACCESS_TOKEN_EXPIRE_TIME
    );
    res.cookie("token", newAccessToken, {
      maxAge: process.env.ACCESS_TOKEN_MAX_AGE, // 5 minutes
      httpOnly: true,
    });
    req.user = await verifyJWT(newAccessToken).payload;
    return next();
  } catch (error) {
    console.log("MiddleWare Error:", error);
    res.status(401).json({
      auth: false,
      message: "No token Founded please login again",
    });
  }
};
