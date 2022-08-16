import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import LoginForm from "../../components/Login/LoginForm";
import axios from "axios";
import RenderOnNotAuthenticated from "../../components/Authentication/AuthenticationRoutesHandler";

export default function Login() {
  const router = useRouter();

  return (
    <div>
      <RenderOnNotAuthenticated>
        <LoginForm />
      </RenderOnNotAuthenticated>
    </div>
  );
}
