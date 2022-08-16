import React from "react";
import RenderOnAuthenticated from "../../components/Authentication/RenderOnAuthenticated";

const index = () => {
   
  return (
    <>
     <RenderOnAuthenticated>
        <h1>
          <pre>Protected page</pre>
        </h1>
     </RenderOnAuthenticated>
     
    </>
  );
};

export default index;
