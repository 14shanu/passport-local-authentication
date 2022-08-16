import React from 'react'
import RenderOnAuthenticated from '../../components/Authentication/RenderOnAuthenticated';



export default function page1() {
  
    return (
        <RenderOnAuthenticated>
 
        <h1>
          <pre>page 1</pre>
        </h1>
 
        </RenderOnAuthenticated>
    )
}
