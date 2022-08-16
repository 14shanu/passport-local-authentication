import React, { useContext, useEffect } from "react";
import ResetPassword from "../../../components/Login/ResetPassword";
import RenderOnNotAuthenticated from "../../../components/Authentication/AuthenticationRoutesHandler";

export default function resetpassword() {
  return (
    <div>
      <RenderOnNotAuthenticated>
        <ResetPassword></ResetPassword>
      </RenderOnNotAuthenticated>
    </div>
  );
}
