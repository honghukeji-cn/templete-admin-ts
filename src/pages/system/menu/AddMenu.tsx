import React, { forwardRef, useState, useEffect } from 'react';
import { Button, Form, Input, Select, Switch, App } from 'antd';
import * as req from '../../../util/request';
import icon from './icon.json';

const { Option } = Select;
const levelList = [
    { value: 1, label: '一级菜单' },
    { value: 2, label: '二级菜单' },
    { value: 3, label: '三级菜单' },
];

const Index = (_props: any, ref: any) => {
    const { message } = App.useApp();
    const [firMenu, setFirMenu] = useState([] as any[]);
    const [secMenu, setSecMenu] = useState([] as any[]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (_props.level > 1) {
            console.log(_props.data)
            getMenus(1, _props.data.sid);
            if (_props.level > 2) {
                getMenus(2, _props.data.fid)
            }
        }
    }, []);
    // 通过pid获取目录
    const getMenus = (type: number, pid: number = 0) => {
        req.post('menu/getMenusByPid', { pid }).then(res => {
            if (res.code === 1) {
                if (type === 1) {
                    setFirMenu(res.data);
                } else if (type === 2) {
                    setSecMenu(res.data);
                }
            }
        })
    }
    const onFinish = (data: any) => {
        setLoading(true);
        if (data.level === 2) {
            data.pid = data.fid;
            data.icon = '';
        } else if (data.level === 3) {
            data.pid = data.sid;
            data.icon = '';
        } else {
            data.pid = 0;
        }
        data.display = data.display ? 1 : 0;
        data.needLog = data.needLog ? 1 : 0;
        data.path = data.path || '';
        data.route = data.route || '';
        let url = 'menu/addMenu';
        if (_props.type == 'edit') {  //编辑
            url = 'menu/editMenu';
            data.id = _props.data.id;
        }
        req.post(url, data).then(res => {
            if (res.code === 1) {
                message.success(res.msg, 1.2)
                _props.onOk && _props.onOk();
            } else {
                message.error(res.msg, 1.2)
            }
            setLoading(false);
        })
    }
    return (
        <Form
            onFinish={onFinish}
            autoComplete="off"
            labelCol={{ flex: '82px' }}
            initialValues={{
                level: Number(_props.level),
                fid: _props.data.fid,
                sid: _props.data.sid,
                display: true,
                icon: _props.data.icon,
                name: _props.data.name,
                path: _props.data.path,
                route: _props.data.route,
                sort: _props.data.sort || 1,
            }}
        >
            <Form.Item label='菜单等级' name='level' required>
                <Select
                    options={levelList}
                    placeholder='请选择菜单等级'
                    disabled
                />
            </Form.Item>
            <Form.Item noStyle shouldUpdate={(prev, cur) => prev.level != cur.level}>
                {({ getFieldValue }) => (
                    <React.Fragment>
                        {getFieldValue('level') === 1 && <Form.Item label='图标' name='icon' required>
                            <Select placeholder='请选择图标'>
                                {icon.map((item, index) => (
                                    <Option value={item.value} key={String(index)}>
                                        <span className={`iconfont ${item.value}`}></span>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>}
                        {getFieldValue('level') > 1 && <Form.Item label='一级菜单' name='fid' required>
                            <Select options={firMenu} placeholder='请选择一级菜单' fieldNames={{ label: 'name', value: 'id' }} 
                            disabled={getFieldValue('level') >1} />
                        </Form.Item>}
                        {getFieldValue('level') > 2 && <Form.Item label='二级菜单' name='sid' required>
                            <Select options={secMenu} placeholder='请选择二级菜单' fieldNames={{ label: 'name', value: 'id' }} />
                        </Form.Item>}
                    </React.Fragment>
                )}
            </Form.Item>
            <Form.Item label="菜单名称" name="name" rules={[{ required: true, message: '请输入菜单名称！' }]}>
                <Input placeholder='请输入菜单名称' />
            </Form.Item>
            <Form.Item label="前端路由" name="path" >
                <Input placeholder='请输入前端路由' />
            </Form.Item>
            <Form.Item label="后端路由" name="route" >
                <Input placeholder='请输入后端路由' />
            </Form.Item>
            <Form.Item label="排序" name="sort">
                <Input placeholder='值越小越靠前' />
            </Form.Item>
            <div className='flexCenter'>
                <Form.Item name='display' label='显示状态：' valuePropName="checked" style={{ flex: 1 }}>
                    <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
                </Form.Item>
                <Form.Item name='needLog' label='打印日志：' valuePropName="checked">
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                </Form.Item>
            </div>
            <Button loading={loading} type="primary" htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
};

export default forwardRef(Index);