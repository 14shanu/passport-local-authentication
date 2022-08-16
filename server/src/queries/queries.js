// const getUsers = 'select * from users'
const getusersByEmail =
  "select email, first_name, last_name,concat(first_name,' ', last_name) as fullname, password, role, id,reset_password, active ,confirmation_otp  from users where email = $1";
const getusersSession = 
  "select email, concat(first_name,' ', last_name) as fullName , role, id, active  from users where email = $1";

const getUserById = "select id, first_name, last_name from users where id = $1";
const checkEmailExists = "select u from users u where u.email = $1";
const addUser =
  "insert into users (first_name, last_name, email, password, confirmation_otp) VALUES ($1, $2, $3, $4, $5)";
const removeUsers = "DELETE FROM users where id = $1";
const updatePassword = "UPDATE users set reset_password =$2 WHERE email = $1";
// const getOtp = 'SELECT reset_password from users  WHERE email =$1'
const updateNewPassword =
  "UPDATE users set reset_password = null ,password = $2 WHERE email=$1 ";
const updateUserAsActive =
  "update users set active=true, confirmation_otp=null where email = $1";
module.exports = {
  // getUsers,
  getusersByEmail,
  getUserById,
  checkEmailExists,
  addUser,
  removeUsers,
  updatePassword,
  getusersSession,
  updateNewPassword,
  updateUserAsActive,
};
