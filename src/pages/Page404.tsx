import React, { forwardRef } from 'react';
import Text from "../component/Text";

const Page404 = (_props: any, ref: any) => {

    return (
       <div className={"h100"} style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
            <img style={{width:670,height:500,marginBottom:50}} src={require("../static/404.png")} />
            <p style={{fontSize:24,fontWeight:"bold"}}>页面不存在</p>
       </div>
    )
};

export default forwardRef(Page404);