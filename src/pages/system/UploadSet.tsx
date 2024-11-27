import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { FC } from 'react';
import {App, Button, Col, Form, Input, Row, Switch} from 'antd';
import Title from '../../component/Title';
import * as req from '../../util/request';
import type { FormInstance } from 'antd/es/form';

const Index = (_props: any, ref: any) => {
    const { message } = App.useApp();
    const [info, setInfo] = useState<any>({
        qiniu: {},
    });
    const qnFormRef = React.useRef<FormInstance>(null);
    const aliFormRef = React.useRef<FormInstance>(null);
    const txFormRef = React.useRef<FormInstance>(null);
    const localFormRef = React.useRef<FormInstance>(null);

    useEffect(() => {
        refresh();
    }, [])
    useImperativeHandle(ref, () => ({
        refresh,
    }))
    //
    const refresh = () => {
        req.post('setting/getUploadConfig', {}).then(res => {
            if (res.code === 1) {
                res.data.qiniu.visible = false;
                res.data.alioss.visible = false;
                res.data.txcos.visible = false;

                if (res.data.visible == 1) {
                    res.data.qiniu.visible = true;
                } else if (res.data.visible == 2) {
                    res.data.alioss.visible = true;
                } else if (res.data.visible == 3) {
                    res.data.txcos.visible = true;
                }
                setInfo(res.data);
                // 七牛云
                qnFormRef.current?.setFieldsValue({
                    qiniu: res.data.qiniu,
                });
                // 阿里os
                aliFormRef.current?.setFieldsValue({
                    alioss: res.data.alioss
                })
                // 腾讯云
                txFormRef.current?.setFieldsValue({
                    txcos: res.data.txcos,
                })
                // 本地
                localFormRef.current?.setFieldsValue({
                    local: {
                        visible:res.data.visible == 4 ? true : false
                    },
                })
            }
        })
    }
    const onFinish = (data: any) => {
        console.log(data);
        let key = Object.keys(data)[0];
        let obj: any = data[key];
        let url = 'setting/saveLocal';
        console.log(obj);

        if (key === 'qiniu') {
            url = "setting/saveQiniu";
            obj.visible = obj.visible ? 1 : 0;
        } else if (key === 'alioss') {
            url = "setting/saveAlioss";
            obj.visible = obj.visible ? 2 : 0;
        } else if (key === 'txcos') {
            url = "setting/saveTxcos";
            obj.visible = obj.visible ? 3 : 0;
        } else {
            obj.visible = obj.visible ? 4 : 0;
        }
        req.post(url, obj).then(res => {
            if (res.code === 1) {
                message.success(res.msg, 1.2);
                refresh();
            } else {
                message.error(res.msg, 1.2)
            }
        })
    }
    // 重置
    const reset = (key: string) => {
        if (key === 'qiniu') {
            qnFormRef.current?.setFieldsValue({
                qiniu: info.qiniu,
            });
        } else if (key === 'alioss') {
            aliFormRef.current?.setFieldsValue({
                alioss: info.alioss,
            });
        } else if (key === 'txcos') {
            txFormRef.current?.setFieldsValue({
                txcos: info.txcos,
            });
        } else if (key === 'local') {
            txFormRef.current?.setFieldsValue({
                local: info.local,
            });
            // localFormRef.current?.setFieldsValue({
            //     visible: info.visible === 4 ? true : false,
            // })
        }
    }
    return (
        <div className={"uploadSetItem container"}>
        <Row gutter={[16, 16]} >
            <Col span={6} xs={24} sm={24} md={24} lg={12} xl={12} xxl={6}>
                <div className=' bgbai  '>
                    <Title title='七牛云配置' />
                    <Form
                        autoComplete='off'
                        labelCol={{ flex: '70px' }}
                        onFinish={onFinish}
                        ref={qnFormRef}
                        initialValues={{
                            qiniu: info.qiniu,
                        }}
                    >
                        <Form.Item label='AK' name={['qiniu', 'ak']} className='paddh'>
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item label='SK' name={['qiniu', 'sk']} className='paddh'>
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item label='仓库名称' name={['qiniu', 'bucket']} className='paddh'>
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item label='七牛域名' name={['qiniu', 'domain']} className='paddh'>
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item label='使用状态' name={['qiniu', 'visible']} className='paddh' valuePropName='checked'>
                            <Switch checkedChildren='开启' unCheckedChildren='关闭' />
                        </Form.Item>
                        <div className='paddh flex flex_end paddb20' style={{ marginTop: 80 }}>
                            <Button type='primary' className='huibtn marginr12' onClick={() => reset('qiniu')}>重置</Button>
                            <Button type='primary' htmlType='submit'>保存</Button>
                        </div>
                    </Form>
                </div>
            </Col>
            <Col span={6} xs={24} sm={24} md={24} lg={12} xl={12} xxl={6}>
                <div className=' bgbai uploadSetItem'>
                    <Title title='阿里OSS配置' />
                    <Form
                        autoComplete='off'
                        labelCol={{ flex: '100px' }}
                        ref={aliFormRef}
                        name='alioss'
                        onFinish={onFinish}
                    >
                        <Form.Item label='AccessKeyID' name={['alioss', 'ak']} className='paddh'>
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item label='AccessKey' name={['alioss', 'sk']} className='paddh'>
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item label='仓库名称' name={['alioss', 'bucket']} className='paddh'>
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item label='endpoint' name={['alioss', 'endpoint']} className='paddh'>
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item label='自定义域名' name={['alioss', 'domain']} className='paddh'>
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item label='使用状态' name={['alioss', 'visible']} className='paddh' valuePropName='checked'>
                            <Switch checkedChildren='开启' unCheckedChildren='关闭' />
                        </Form.Item>
                        <div className='paddh flex flex_end paddb20'>
                            <Button type='primary' className='huibtn marginr12' onClick={() => reset('alioss')}>重置</Button>
                            <Button type='primary' htmlType='submit'>保存</Button>
                        </div>
                    </Form>
                </div>
            </Col>
            <Col span={6}  xs={24} sm={24} md={24} lg={12} xl={12} xxl={6}>
                <div className=' bgbai uploadSetItem' >
                    <Title title='腾讯云配置' />
                    <Form
                        autoComplete='off'
                        labelCol={{ flex: '100px' }}
                        ref={txFormRef}
                        onFinish={onFinish}
                    >
                        <Form.Item label='AccessKeyID' name={['txcos', 'ak']} className='paddh'>
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item label='SAccessKeyK' name={['txcos', 'sk']} className='paddh'>
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item label='仓库名称' name={['txcos', 'bucketName']} className='paddh'>
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item label='bucket' name={['txcos', 'bucket']} className='paddh'>
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item label='自定义域名' name={['txcos', 'domain']} className='paddh'>
                            <Input placeholder='请输入' />
                        </Form.Item>
                        <Form.Item label='使用状态' name={['txcos', 'visible']} className='paddh' valuePropName='checked'>
                            <Switch checkedChildren='开启' unCheckedChildren='关闭' />
                        </Form.Item>
                        <div className='paddh flex flex_end paddb20'>
                            <Button type='primary' className='huibtn marginr12' onClick={() => reset('txcos')}>重置</Button>
                            <Button type='primary' htmlType='submit'>保存</Button>
                        </div>
                    </Form>
                </div>
            </Col>
            <Col span={6} xs={24} sm={24} md={24} lg={12} xl={12} xxl={6}>
                <div className=' bgbai uploadSetItem'>
                    <Title title='本地配置' />
                    <Form
                        autoComplete='off'
                        ref={localFormRef}
                        onFinish={onFinish}
                    >
                        <Form.Item label='使用状态' name={['local', 'visible']}  className='paddh' valuePropName='checked'>
                            <Switch checkedChildren='开启' unCheckedChildren='关闭' />
                        </Form.Item>
                        <div className='paddh flex flex_end paddb20'>
                            <Button type='primary' className='huibtn marginr12' onClick={() => reset('local')}>重置</Button>
                            <Button type='primary' htmlType='submit'>保存</Button>
                        </div>
                    </Form>
                </div>
            </Col>
        </Row>
        </div>
    )
};

export default forwardRef(Index);