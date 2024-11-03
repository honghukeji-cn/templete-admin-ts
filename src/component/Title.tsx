import React, { forwardRef } from 'react';
import { theme } from 'antd';
interface TitleProps {
    title:string;
}
const Title = (props:TitleProps,ref:any) => {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    return (
        <div className='flexCenter'>
            <p className='pline' style={{background: colorPrimary}}></p>
            <h2 className='pubTit'>{props.title}</h2>
        </div>
    )
}

export default forwardRef(Title);