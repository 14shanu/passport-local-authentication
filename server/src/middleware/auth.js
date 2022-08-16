import jwt from "jsonwebtoken";
import cookie from "cookie";
import { UnauthenticatedError, UnauthorizedError } from "../errors";
import { signJWT, verifyJWT } from "../../utils/auth";
import { getSession, getUserSession } from "../sessions";

const requireSignin = async (req, res, next) => {
  try {
    let { token, refreshToken } = cookie.parse(req.headers.cookie);
    if (!token) {
      throw new UnauthenticatedError("No token found..!");
    }

    token = token.replace("token=", "");
    const { payload, expired } = await verifyJWT(token);
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
      throw new UnauthenticatedError("Session Expired. Please Login Again..!");
      // return res.json({
      //   auth: false,
      //   message: "Session Expired. Please Login Again",
      // });
    }
    const session = await getSession(refresh.session_id);
    console.log("session", session);
    if (!session) {
      throw new UnauthenticatedError("No Session Found..!");

      // return res.json({
      //   auth: false,
      //   message: "No session Found",
      // });
    }

    const user = await getUserSession(session.email);
    if (!user) {
      throw new UnauthenticatedError("User does Not found..!");
      // return res.json({
      //   auth: false,
      //   message: "User Not Found",
      // });
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
    // console.log("error", error);
    throw new UnauthenticatedError(error.message);
  }
};
module.exports = {
  requireSignin,
};
