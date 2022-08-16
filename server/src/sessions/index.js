import pool from "../../utils/db";
import { getusersByEmail, getusersSession } from "../queries/queries";
import {
  createSessionQuery,
  getSessionById,
  invalidateSessionQuery,
} from "../queries/sessionQueries";

export async function createSession(email, name) {
  try {
    const session = await pool.query(createSessionQuery, [email, name, true]);
    // console.log(session.rows[0].session_id);
    return session.rows[0];
  } catch (error) {
    console.log("Error in Create Session:", error);
  }
}

export async function getSession(session_id) {
  try {
    const session = await pool.query(getSessionById, [session_id, true]);
    console.log("session...", session);
    return session && session.rowCount ? session.rows[0] : null;
  } catch (error) {
    console.log("Error In Get Session", error);
  }
}

export async function invalidateSession(sessionId) {
  try {
    const session = await pool.query(invalidateSessionQuery, [
      sessionId,
      false,
    ]);

    //  console.log(session);
  } catch (error) {
    console.log("Error invalidate Session:", error);
  }
}

export async function getUser(email) {
  try {
    const user = await pool.query(getusersByEmail, [email]);
    return user;
  } catch (error) {
    console.log("Error in GetUser", error);
  }
}
export async function getUserSession(email) {
  try {
    const user = await pool.query(getusersSession, [email]);
    return user && user.rowCount ? user.rows[0] : null;
  } catch (error) {
    console.log("Error in GetUser", error);
  }
}
