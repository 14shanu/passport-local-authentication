import EmailVerification from "../../../components/Login/EmailVerification";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { Context } from "../../../context";
import RenderOnNotAuthenticated from "../../../components/Authentication/AuthenticationRoutesHandler";

export default function Emailverification() {
  return (
    <div>
      <RenderOnNotAuthenticated>
        <EmailVerification />
      </RenderOnNotAuthenticated>
    </div>
  );
}
