import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const RenderOnNotAuthenticated = ({ children }) => {
  const router = useRouter();

  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/expressapi/current-user");
      if (data) {
        setHidden(true);
        router.push("/");
      }
      return data;
    } catch (err) {
      setHidden(false);
      console.log("error 1", err);
    }
  };

  return <>{hidden ? <div>Loading...</div> : <>{children}</>}</>;
};

export default RenderOnNotAuthenticated;
