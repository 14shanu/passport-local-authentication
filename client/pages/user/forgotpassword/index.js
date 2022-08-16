import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import ForgotPassword from "../../../components/Login/ForgotPassword";
import RenderOnNotAuthenticated from "../../../components/Authentication/AuthenticationRoutesHandler";

export default function forgotpassword() {
  return (
    <div>
      <RenderOnNotAuthenticated>
        <ForgotPassword />
      </RenderOnNotAuthenticated>
    </div>
  );
}
