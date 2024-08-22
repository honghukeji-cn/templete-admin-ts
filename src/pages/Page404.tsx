import React, { forwardRef } from 'react';
import Text from "../component/Text";

const Page404 = (_props: any, ref: any) => {

    return (
       <div className={"h100"} style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
            <img style={{width:670,height:500,marginBottom:50}} src={require("../static/404.png")} />

       </div>
    )
};

export default forwardRef(Page404);