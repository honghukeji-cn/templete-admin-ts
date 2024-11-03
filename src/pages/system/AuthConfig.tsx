import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {Button, Form, Input, App, Row, Col, Switch} from 'antd';
import * as req from '../../util/request';
import Helper from "../../util/Helper";
import Title from "../../component/Title";

const Index = (_props: any, ref: any) => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);
    useImperativeHandle(ref, () => ({
        refresh,
    }))
    const refresh = () => {
        getAuthConfig();
    }
    useEffect(()=>{
        //获取密码正则表达式
        getAuthConfig();
    },[])
    const getAuthConfig=()=>{
        req.post("admin/getPwdRule", {}).then((res:any) => {
            if (res.code === 1) {
                res.data.auto_backup=res.data.auto_backup==1;
                // console.log(res.data)
                form.setFieldsValue(res.data)
            } else {
                message.error(res.msg, 1.2)
            }
        })
    }
    const onFinish = (data: any) => {
        setLoading(true);
        data.auto_backup=data.auto_backup?1:0;
        req.post("setting/setAuthConfig", data).then((res:any) => {
            setLoading(false)
            if (res.code === 1) {
               message.success(res.msg)
            } else {
                message.error(res.msg, 1.2)
            }
        }).catch((error:any)=>{
            setLoading(false)

        })
    }
    return (
       <>
           <Title title='登录安全配置' />
          <div style={{paddingLeft:20}}>
              <Row gutter={12}>
                  <Col span={6} xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
                      <Form
                          form={form}
                          name="validateOnly"
                          layout={"vertical"}
                          autoComplete="off"
                          onFinish={onFinish}
                      >
                          <Form.Item label='登录密码正则' name='pwd_reg' rules={[{ required: true, message: '请输入登录密码正则' }]}>
                              <Input placeholder='请输入登录密码正则规则' />
                          </Form.Item>
                          <Form.Item label='登录密码规则描述' name='pwd_reg_desc' rules={[{ required: true, message: '请输入登录密码规则描述' }]}>
                              <Input placeholder='请输入登录密码规则描述' />
                          </Form.Item>
                          <Form.Item   label='连续密码错误次数后冻结账号' name='fail_num'
                                     rules={[{ required: true, message: '请输入连续密码错误多少次数后冻结账号' }]}>
                              <Input type={"number"} placeholder='请输入连续密码错误多少次数后冻结账号' />
                          </Form.Item>
                          <Form.Item  label='清除密码错误记录的时间(秒)' name='fail_num_time'
                                     rules={[{ required: true, message: '请输入清除密码错误记录的时间(秒)' }]}>
                              <Input type={"number"} placeholder='请输入清除密码错误记录的时间(秒)' />
                          </Form.Item>
                          <Form.Item  label='静默多久后登录失效(秒)' name='timeout'
                                      rules={[{ required: true, message: '请输入静默多久后登录失效(秒)' }]}>
                              <Input type={"number"} placeholder='请输入静默多久后登录失效(秒)' />
                          </Form.Item>
                          <Form.Item  label='密码多少天后必须强制更换' name='pass_max'
                                      rules={[{ required: true, message: '请输入密码多少天后必须强制更换' }]}>
                              <Input type={"number"} placeholder='请输入密码多少天后必须强制更换' />
                          </Form.Item>
                          <Form.Item  label='多少天未修改密码开始提示用户修改密码' name='pass_wran'
                                      rules={[{ required: true, message: '请输入多少天未修改密码开始提示用户修改密码' }]}>
                              <Input type={"number"} placeholder='请输入多少天未修改密码开始提示用户修改密码' />
                          </Form.Item>
                          <Form.Item  label='是否开启自动备份' name='auto_backup' valuePropName="checked"
                                      rules={[{ required: true, message: '请选择' }]}>
                             <Switch  checkedChildren={"开启"} unCheckedChildren={"关闭"} />
                          </Form.Item>
                          <Form.Item  label='备份数据库规则' name='bakup_db_cron'
                                      rules={[{ required: true, message: '请输入备份数据库时机的cron表达式' }]}>
                              <Input  placeholder='请输入备份数据库时机的cron表达式' />
                          </Form.Item>
                          <Button loading={loading} type="primary" htmlType='submit' className='marglauto block '>确定</Button>
                      </Form>
                  </Col>
              </Row>
          </div>
       </>
    )
}

export default forwardRef(Index);;