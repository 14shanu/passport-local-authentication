import RegisterForm from "../../components/Login/RegisterForm";
import React, { useContext, useEffect } from "react";
import RenderOnNotAuthenticated from "../../components/Authentication/AuthenticationRoutesHandler";

export default function Register() {
  return (
    <div>
      {/* <RenderOnNotAuthenticated> */}
      <RegisterForm />
      {/* </RenderOnNotAuthenticated> */}
    </div>
  );
}
