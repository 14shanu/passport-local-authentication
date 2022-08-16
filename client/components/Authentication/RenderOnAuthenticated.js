import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Context } from "../../context";

const RenderOnAuthenticated = ({ children }) => {
  const {
    state: { user },
  } = useContext(Context);
  const router = useRouter();

  console.log("ROA User: ", user);

  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/expressapi/current-user");
      console.log("data", data);

      setHidden(false);
    } catch (err) {
      console.log("error 1", err);
      setHidden(true);
      router.push("/login");
    }
  };
  console.log(hidden);
  return <>{hidden ? <div>Loading...</div> : <>{children}</>}</>;
};

export default RenderOnAuthenticated;
