const createSessionQuery =
  "insert into sessions (email, name , valid) VALUES ($1, $2, $3) RETURNING session_id";
const invalidateSessionQuery =
  "UPDATE sessions set valid =$2 WHERE session_id = $1";
const getSessionByEmail =
  "select session_id , email , valid, name  from sessions where email = $1 and valid = $2";
const getSessionById =
  "select session_id , email , valid, name   from sessions where session_id = $1 and valid = $2";

module.exports = {
  createSessionQuery,
  invalidateSessionQuery,
  getSessionByEmail,
  getSessionById,
};
