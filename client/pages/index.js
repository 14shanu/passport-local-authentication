import { useContext } from "react";
import styles from "../styles/Home.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { Context } from "../context";
import RenderOnAuthenticated from "../components/Authentication/RenderOnAuthenticated";

export default function Home() {
  const router = useRouter();

  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  const LogoutHandler = async () => {
    const { data } = await axios.get(`expressapi/logout`);
    dispatch({
      type: "LOGOUT",
    });
    localStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <RenderOnAuthenticated>
      <div className={styles.container}>
        <h1>Home page</h1>
        <pre>{JSON.stringify(user)}</pre>
        <button onClick={LogoutHandler}>Logout</button>
      </div>
    </RenderOnAuthenticated>
  );
}
