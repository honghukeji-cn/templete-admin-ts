import React, { useImperativeHandle, forwardRef, useEffect, useState, useRef } from 'react';
import { Button, Checkbox, Form, Input, App, Spin } from 'antd';
import * as req from '../../../util/request';

interface CheckBoxValue {
    ids?: [];
}
interface CustomCheckBoxProps {
    value?: CheckBoxValue;
    onChange?: (value: CheckBoxValue) => void;
}
const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({ value = {}, onChange }) => {
    const [menu, setMenu] = useState<Array<{ id: number, name: string, child?: [], checked?: false }>>([]);
    const [loading, setLoading] = useState(false);
    const triggerChange = (changedValue: { ids?: []; }) => {
        onChange?.(changedValue);
    };
    useEffect(() => {
        getMenus();
    }, [])
    const getMenus = () => {
        setLoading(false);
        req.post('role/addRoleGetMenus', {}).then(res => {
            if (res.code == 1) {
                let ids: any = value;
                let menu = res.data;
                // ids存在才改变数组数据
                if (ids.length > 0) {
                    menu.forEach((item: any) => {
                        item.child.forEach((row: any) => {
                            row.child.forEach((d: any) => {
                                // 三级
                                let index = ids.findIndex((r: number) => r == d.id);
                                if (index > -1) {
                                    d.checked = true;
                                }
                            });
                            // 二级
                            let index = ids.findIndex((r: number) => r == row.id);
                            if (index > -1) {
                                row.checked = true;
                            }
                        });
                        // 一级
                        let index = ids.findIndex((r: number) => r == item.id);
                        if (index > -1) {
                            item.checked = true;
                        }
                    });
                }
                setLoading(true);
                setMenu(menu);
            }
        })
    }
    // 一级选项切换
    const firstChange = (index: number) => {
        let list: any = JSON.parse(JSON.stringify(menu));
        if (list[index].checked) {  // 一级已全选
            // 改变所有子级为不选
            let secChild: any = list[index].child;
            for (let i in secChild) {
                // 改变二级
                secChild[i].checked = false;
                // 判断是否有三级
                if (secChild[i].child.length > 0) {
                    let thridChild: any = secChild[i].child;
                    // 循环改变所有三级
                    for (let j in thridChild) {
                        thridChild[j].checked = false;
                    }
                }
            }
            // 改变自己
            list[index].checked = false;
        } else {  // 一级未全选
            // 改变所有子级为选中
            let secChild: any = list[index].child;
            for (let i in secChild) {
                // 改变二级
                secChild[i].checked = true;
                // 判断是否有三级
                if (secChild[i].child.length > 0) {
                    let thridChild: any = secChild[i].child;
                    // 循环改变所有三级
                    for (let j in thridChild) {
                        thridChild[j].checked = true;
                    }
                }
            }
            // 改变自己
            list[index].checked = true;
        }
        setMenu(list)
        triggerChange(getIds(list))
    }
    // 二级选项切换
    const secChange = (index1: number, index2: number) => {
        let list: any = JSON.parse(JSON.stringify(menu));
        list[index1].child[index2].checked = !list[index1].child[index2].checked;
        let childs = list[index1].child[index2].child;
        for (let i in childs) {
            childs[i].checked = list[index1].child[index2].checked;
        }
        setMenu(list)
        triggerChange(getIds(list))
    }
    // 三级选项切换
    const thirdChange = (index3: number, index2: number, index1: number) => {
        let list: any = JSON.parse(JSON.stringify(menu));
        list[index1].child[index2].child[index3].checked = !list[index1].child[index2].child[index3].checked;
        if (!isSecCheckAll(index1, index2)) {
            list[index1].child[index2].checked = true;
        } else {
            list[index1].child[index2].checked = false;
        }
        setMenu(list)
        triggerChange(getIds(list))
    }
    // 判断一级是否全选
    function isFirstCheckAll(index: number): boolean {
        let list: any = JSON.parse(JSON.stringify(menu));
        let res = list[index].checked || true;
        let childs = list[index].child;
        if (childs.length > 0) {
            res = childs.every((item: any) => item.checked)
        } else {
            res = list[index].checked;
        }
        return res;
    }
    // 判断一级是否显示半选
    function isFirstIndeterminate(index: number): boolean {
        let list: any = JSON.parse(JSON.stringify(menu));
        let res = false;
        let childs: any = list[index].child;
        if (childs.length > 0) {
            res = childs.some((item: any) => item.checked);
            if (childs.every((item: any) => item.checked)) {
                res = false;
            }
        }
        return res;
    }
    // 判断二级是否全选
    function isSecCheckAll(index: number, index2: number): boolean {
        let list: any = JSON.parse(JSON.stringify(menu));
        let res = list[index].child[index2].checked || false;
        let childs: any = list[index].child[index2].child;
        if (childs.length > 0) {
            res = childs.every((item: any) => item.checked)
        } else {
            res = list[index].child[index2].checked;
        }
        return res
    }
    // 判断二级是否显示半选
    function isIndeterminate(index: number, index2: number): boolean {
        let list: any = JSON.parse(JSON.stringify(menu));
        let res = false;
        let childs: any = list[index].child[index2].child;
        if (childs.length > 0) {
            res = childs.some((item: any) => item.checked);
            if (childs.every((item: any) => item.checked)) {
                res = false;
            }
        }
        return res;
    }
    // 获取所有选中项的id
    function getIds(data: any) {
        let list: any = JSON.parse(JSON.stringify(data));
        // console.log(list)
        let ids: any = [];
        list.forEach((item: any) => {
            item.child.forEach((row: any) => {
                row.child.forEach((d: any) => {
                    if (d.checked) {
                        ids.push(d.id);
                    }
                });
                // 二级
                let secChecked = row.child.some((r: any) => r.checked);
                if (row.checked || (!row.checked && secChecked)) {
                    ids.push(row.id);
                }
            });
            // 一级
            let checked = item.child.some((row: any) => row.checked);
            if (item.checked || (!item.checked && checked)) {
                ids.push(item.id);
            }
        });
        return ids;
    }
    return (
        <div className='cklist'>
            {!loading && <Spin tip="加载中..." style={{ display: 'block', margin: '50px auto 0' }} />}
            {loading && menu.map((item: any, index: number) => (
                <div key={String(index)} className='flex checklist'>
                    {/* 一级选项 */}
                    <Checkbox
                        // checked={item.checked}
                        indeterminate={isFirstIndeterminate(index)}
                        checked={isFirstCheckAll(index)}
                        onChange={() => {
                            firstChange(index)
                        }}
                    >{item.name}</Checkbox>
                    {/* 二级 */}
                    {item.child && item.child.length > 0 && <div className='rowFlex'>
                        {item.child.map((row: any, k: number) => (
                            <div key={String(k)} className='flex checklist'>
                                <Checkbox
                                    // checked={row.checked}
                                    indeterminate={isIndeterminate(index, k)}
                                    checked={isSecCheckAll(index, k)}
                                    onChange={() => {
                                        secChange(index, k)
                                    }}
                                >{row.name}</Checkbox>
                                {/* 三级 */}
                                {row.child && row.child.length > 0 && <div className='rowFlex'>
                                    {row.child.map((r: any, i: number) => (
                                        <Checkbox
                                            key={String(i)}
                                            checked={r.checked}
                                            onChange={() => {
                                                thirdChange(i, k, index)
                                            }}
                                        >{r.name}</Checkbox>
                                    ))}
                                </div>}
                            </div>
                        ))}
                    </div>}
                </div>
            ))}
        </div>
    )
}
const Index = (_props: any, ref: any) => {
    const formRef: any = useRef(null);
    const { message } = App.useApp();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

    }, [])

    useImperativeHandle(ref, () => ({
        refresh,
    }))
    const refresh = () => {
        console.log('管理员列表');
    }
    // 提交表单
    const onFinish = (data: any) => {
        setLoading(true);
        data.ids = JSON.stringify(data.ids);
        // console.log(data);
        let url = 'role/addRole';
        if (_props.type === 'edit') {
            url = 'role/editRole';
            data.role_id = _props.data.role_id;
        }
        req.post(url, data).then(res => {
            if (res.code === 1) {
                message.success(res.msg);
                _props.onOk && _props.onOk();
            } else {
                message.error(res.msg);
            }
            setLoading(false);
        })
    }
    return (
        <Form
            ref={formRef}
            onFinish={onFinish}
            initialValues={{
                ids: _props.data.ids || [],
                role_name: _props.data.role_name,
                describe: _props.data.describe,
            }}
        >
            <div className='flwp'>
                <Form.Item className='item49' label='角色名称' name='role_name' rules={[{ required: true, message: '请输入角色名称' }]}>
                    <Input autoComplete='off' placeholder='请输入角色名称' />
                </Form.Item>
                <Form.Item className='item49' label='角色描述' name='describe' rules={[{ required: true, message: '请输入角色描述' }]}>
                    <Input autoComplete='off' placeholder='请输入角色描述' />
                </Form.Item>
                <Form.Item className='row10' label='角色权限' name='ids' rules={[{ required: true, message: '请选择角色权限' }]}>
                    {/* <Input className='noHeight' /> */}
                    <CustomCheckBox />
                </Form.Item>
            </div>
            <Button loading={loading} type="primary" htmlType='submit' className='marglauto block margt20'>确定</Button>
        </Form>
    )
};

export default forwardRef(Index);