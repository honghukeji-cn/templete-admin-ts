import React, {useImperativeHandle, forwardRef, ReactNode} from 'react';
import { Button, theme } from 'antd';

interface TextProps extends React.ParamHTMLAttributes<any>{
    type?:string;
    children:ReactNode,
}
const Text = (_props: TextProps,ref:any) => {
    const {
        token: { colorPrimary, colorSuccess, colorWarning, colorError }
    } = theme.useToken();
    const type = _props.type || 'primary';
    return (
        <p
            style={{
                color: type === 'primary' ? colorPrimary : (
                    type === 'success' ? colorSuccess : (
                        type === 'warning' ? colorWarning : (
                            type === 'error' ? colorError : '#333'
                        )
                    )
                )
            }}
            {..._props}
        >{_props.children}</p>
    )
};

export default forwardRef(Text);