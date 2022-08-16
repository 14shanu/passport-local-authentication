const P_LocalRegisterOtpHtmlTemplate = (otp) => {
  const html = `Hi there,
  <br/>
  Thank you for registering!
  <br/><br/>
  Please verify your email by typing the following Otp:
  <br/>
  Otp: <b>${otp}</b>
  <br/>
  On the following page:
  <a href="${process.env.BASE_URL}/user/emailverification">${process.env.BASE_URL}/user/emailverification</a>
  <br/><br/>
  Have a pleasant day.`;
  return html;
};

const P_LocalResetPasswordHtmlTemplate = (otp) => {
  const html = `Hi there,
  <br/>
  Reset Your Password!
  <br/><br/>
  Please verify your email by typing the following Otp:
  <br/>
  otp: <b>${otp}</b>
  <br/>
  On the following page:
  <a href=${process.env.BASE_URL}/user/resetpassword/>${process.env.BASE_URL}/user/resetpassword/</a>
  <br/><br/>
  Have a pleasant day.`;

  return html;
};

module.exports = {
  P_LocalRegisterOtpHtmlTemplate,
  P_LocalResetPasswordHtmlTemplate,
};
