import React, { useEffect, useState } from 'react';
import {Button, Form, Input, theme, App, Modal} from 'antd';
import {
    useNavigate,
} from "react-router-dom";
import req from "../../util/request"
import Helper from "../../util/Helper";

const Login = () => {
    let navigate = useNavigate();
    const {
        token: {
            colorPrimary
        },
    } = theme.useToken();
    const { message } = App.useApp();
    const [codeUrl, setCodeUrl] = useState('');
    const [uuid, setUuid] = useState('');
    const [name, setName] = useState('鸿鹄科技管理后台');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        window.reset&&window.reset();
        if(localStorage.getItem("honghuToken")){
            navigate('/admin', { replace: true, })
            return;
        }
        getSystemName();
        getCodeUrl();
    }, [])
    // 获取系统名称
    const getSystemName = () => {
        req.POST('login/getSystemName', {}).then(res => {
            if (res.code === 1) {
                document.title = res.data.name;
                setName(res.data.name);
            }
        })
    }
    // 获取图片验证码
    const getCodeUrl = () => {
        req.POST('login/getCaptcha', {}).then(res => {
            if (res.code === 1) {
                setCodeUrl(res.data.img);
                setUuid(res.data.uuid);
            }
        })
    }
    const onFinish = (data) => {
        setLoading(true);
        data.uuid = uuid;
        req.POST('login/login', data).then(res => {
            if (res.code === 1) {
                localStorage.setItem("honghuToken", res.data.token)
                message.success("登录成功")
                navigate('/admin', { replace: true, })
            } else {
                getCodeUrl();
                var  sub=res.msg.substr(0,5);
                if(sub=="ALERT")
                {

                   var str=res.msg.replace("ALERT","");
                    Modal.confirm({
                        title: '提示',
                        content: str
                    })
                }else{
                    message.error(res.msg);
                }

            }
            setLoading(false);
        })
    }
    return (
        <div className='loginBox'>
            <h1 >登录到<br />{name}</h1>
            <p className='line' style={{ background: `linear-gradient(to right,${colorPrimary},transparent)` }}></p>
            <Form
                autoComplete="off"
                onFinish={onFinish}
            >
                <Form.Item name="username" rules={[{ required: true, message: '请输入账号!' }]}>
                    <Input
                        prefix={<span className='iconfont icon-yonghu'></span>}
                        placeholder="请输入账号"
                    />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
                    <Input.Password
                        prefix={<span className='iconfont icon-mima'></span>}
                        type="password"
                        placeholder="请输入密码"
                        autoComplete="new-password"
                    />
                </Form.Item>
                <div className='flex'>
                    <Form.Item name="code" className='rowFlex' rules={[{ required: true, message: '请输入图形验证码!' }]}>
                        <Input
                            prefix={<span className='iconfont icon-a-yanzhengmaanquan'></span>}
                            type="text"
                            placeholder="请输入图形验证码"
                            autoComplete="off"
                        />
                    </Form.Item>
                    <div className='code'>
                        <img onClick={getCodeUrl} className='verifyCodeImg' src={codeUrl} />
                    </div>
                </div>
                <Button loading={loading} className='dlbtn' type="primary" htmlType='submit'>登录</Button>
            </Form>
        </div>
    )
};

export default Login;