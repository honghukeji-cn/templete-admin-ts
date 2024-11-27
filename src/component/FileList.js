import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Button, Input, Select, Image, Pagination, Form, App, } from 'antd';
import CustomModal from './CustomerModal';
import Title from './Title'
import * as req from '../util/request';
import CustomUpload from './Upload';

const fileType = [
    { value: 1, label: '图片' },
    { value: 2, label: '视频文件' },
    { value: 3, label: 'Execl文件' },
    { value: 4, label: 'Word文件' },
    { value: 5, label: 'PDF文件' },
    { value: 6, label: '压缩文件' },
    { value: 7, label: '未知类型文件' },
];

// 图片预览
function ImageDemo(props) {
    const [visible, setVisible] = useState(false);
    return (
        <React.Fragment>
            <img title={props.data.name} alt='' src={props.data.url} />
            {!props.data.selected && <div title={props.data.name} className='ylmask'>
                <span className='yl' onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setVisible(true)
                }}>预览</span>
            </div>}
            <Image
                src={props.data.url}
                style={{ display: 'none' }}
                preview={{
                    visible,
                    src: props.data.url,
                    onVisibleChange: (value) => {
                        setVisible(value);
                    }
                }}
            />
        </React.Fragment>
    )
}
// 渲染列表
function GetItems(props) {
    let item = props.item;
    return (
        <React.Fragment>
            {/* 图片 */}
            {item.type == 1 && <ImageDemo data={item} />}
            {/* 视频 */}
            {item.type == 2 && <img className='wj' alt='' src={require('../static/shipin.png')} />}
            {/* excel文件 */}
            {item.type == 3 && <img className='wj' alt='' src={require('../static/excel.png')} />}
            {/* word文件 */}
            {item.type == 4 && <img className='wj' alt='' src={require('../static/word.png')} />}
            {/* pdf文件 */}
            {item.type == 5 && <img className='wj' alt='' src={require('../static/PDF.png')} />}
            {/* 压缩包文件 */}
            {item.type == 6 && <img className='wj' alt='' src={require('../static/ysb.png')} />}
            {/* 未知文件 */}
            {item.type == 7 && <img className='wj' alt='' src={require('../static/other.png')} />}
            {/* 虚拟文件夹 */}
            {item.type == 8 && <img className='wj' alt='' src={require('../static/wjj.png')} title='双击打开文件夹' />}
        </React.Fragment>
    )
}

const FileList = (props, _ref) => {
    const { message, modal } = App.useApp();
    const [open, setOpen] = useState(false);
    const [list, setList] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pid, setPid] = useState(0);
    const [type, setType] = useState(props.type || undefined);
    const [name, setName] = useState('');
    const [fileName, setFileName] = useState([{ id: 0, name: '根目录' }])
    const [createVisible, setCreateVisible] = useState(false);
    const [rows, setRows] = useState([]);  // 已选中的文件
    const [percent, setPercent] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getList()
    }, [page, type, name, pid])
    // 暴露方法
    useImperativeHandle(_ref, () => ({
        setOpen,
        refresh,
    }))
    const refresh = () => {
        setOpen(true);
        setPid(0);
        setPage(1);
        setRows([]);
        setFileName([{ id: 0, name: '根目录' }]);
    }
    // 获取文件列表
    const getList = () => {
        let obj = {
            page,
            size: 24,
            orderBy: '',
            pid,
            name,
            type: type || '',
        }
        req.post('setting/getFileList', obj).then(res => {
            if (res.code == 1) {
                setList(res.data.datas);
                setTotal(res.data.all);
            }
        })
    }
    // 关闭文件库
    const onCancel = () => {
        setOpen(false);
    }
    // 双击打开文件夹
    const openFolder = (data, index = -1) => {
        setPid(data.id);
        setPage(1);
        if (index > -1) {
            if (index != fileName.length - 1) {
                let newArr = fileName.slice(0, (index + 1));
                setFileName(newArr)
            }
        } else {
            if (data.type === 8) {
                setFileName([...fileName, { id: data.id, name: `/${data.name}` }]);
            }
        }
    }
    // 选中文件
    const onSelected = (data) => {
        if (data.type !== 8) {
            let index = rows.findIndex(item => item === data.url);
            if (index === -1) {
                if (props.multiple) {  // 多选
                    if(props.max && rows.length==props.max)
                    {
                        rows.splice(0,1);
                    }
                    setRows([...rows, data.url])
                } else {
                    setRows([data.url])
                }
            } else {
                rows.splice(index, 1)
                setRows([...rows]);
            }
        }
    }
    // 检查当前文件是否选中
    const isChecked = (data) => {
        let index = rows.findIndex(item => item === data.url);
        return index > -1;
    }
    // 关闭新增文件夹弹窗
    const onClose = () => {
        setCreateVisible(false);
    }
    // 创建文件夹
    const onFinish = (data) => {
        setLoading(true);
        uploadFile({
            domain: 0,
            key: '',
            name: data.name,
            fileType: 8,
            url: '',
        })
    }
    // 确认选中文件
    const onOk = () => {
        if (rows.length === 0) {
            return message.error('请选择文件', 1.2);
        }
        props.onOk && props.onOk(rows);
        onCancel();
    }
    // 删除
    const del = (data) => {
        modal.confirm({
            title: '警告提示',
            content: '您要删除该项数据吗？删除后将无法恢复！',
            centered: true,
            maskClosable: true,
            onOk: () => {
                req.post('setting/delFile', { id: data.id }).then(res => {
                    if (res.code == 1) {
                        getList();
                    } else {
                        message.error(res.msg, 1.2);
                    }
                })
            }
        })
    }
    // 保存文件
    function uploadFile({ domain, key, name, fileType, type, url }) {
        let data = {
            domain: domain === 4 ? 4 : (pid === 0 ? type : 0),
            type: fileType,
            name,
            key,
            url,
            pid
        }
        req.post('setting/addFile', data).then(res => {
            if (res.code == 1) {
                getList();
                message.success('成功！', 1.2);
                if (fileType === 8) {
                    setLoading(false);
                    setCreateVisible(false);
                }
            } else {
                message.error(res.msg, 1.2);
            }
        })
    }
    return (
        <React.Fragment>
            <CustomModal
                open={open}
                title={(
                    <div className='flexCenter'>
                        <Title title='文件库:' />
                        {fileName.map((item, index) => (
                            <span className={`color9 ${index < fileName.length - 1 ? ' cursor' : ''}`} key={String(item.id)} onClick={() => openFolder(item, index)}>{item.name}</span>
                        ))}
                    </div>
                )}
                width={824}
                onCancel={onCancel}
            >
                <div className='flwp'>
                    <Input
                        className='marginr12'
                        placeholder='请输入文件名称'
                        style={{ width: 200 }}
                        allowClear
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                    <Select
                        placeholder='请选择文件类型'
                        options={fileType}
                        className='marginr12'
                        value={type}
                        style={{ width: 140 }}
                        allowClear={props.type ? false : true}
                        disabled={props.type ? true : false}
                        onChange={(type) => {
                            setType(type);
                            setPage(1);
                        }}
                    />
                    <CustomUpload
                        accept={
                            props.type==1?"image/*":(
                                props.type==2?"video/*":(
                                    props.type==3?".xls,.xlsx":(
                                        props.type==4?".doc,.docx":(
                                            props.type==5?".pdf":(
                                                props.type==6?".zip,.rar":"image/*,video/*,.xls,.xlsx,.doc,.docx,.pdf"
                                            )
                                        )
                                    )
                                )
                            )
                        }
                        onPercent={(num) => {
                            setPercent(num);
                            if (num >= 100) {
                                setPercent(0);
                            }
                        }}
                        onOk={(data) => {
                            uploadFile(data)
                        }}
                    >
                        <Button className='marginr12' type='primary'>上传文件</Button>
                        {percent > 0 && <span className='jdttt' style={{ width: percent }} onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}></span>}
                    </CustomUpload>
                    <Button type='primary' danger onClick={() => setCreateVisible(true)}>创建文件夹</Button>
                </div>
                {/* 列表 */}
                <div className='flwp uploadlist'>
                    {list.map((item, index) => (
                        <div
                            className='item'
                            key={String(index)}
                            onDoubleClick={() => openFolder(item)}
                            onClick={() => {
                                onSelected(JSON.parse(JSON.stringify(item)))
                            }}
                        >
                            <div className='kk' style={{ border: (item.type == 8 || item.type == 1) ? '0' : '' }}>
                                <GetItems item={item} />
                                {/* 是否选中 */}
                                {isChecked(item) && <div className='mask'>
                                    <span className='iconfont icon-xuanze'></span>
                                </div>}
                                {/* 删除 */}
                                <span className='iconfont icon-cuowu closeIcon' onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    // this.del(item)
                                    del(item)
                                }}></span>
                            </div>
                            <p>{item.name}</p>
                        </div>
                    ))}
                </div>
                {/* 页码 */}
                {total > 0 && <Pagination
                    current={page}
                    pageSize={24}
                    total={total}
                    showTotal={(total, range) => {
                        return `共${total}条记录，本页展示${range[0]}-${range[1]}条记录`
                    }}
                    showSizeChanger={false}
                    onChange={(page) => {
                        setPage(page)
                    }}
                />}
                <Button type="primary" className='marglauto block margt20' onClick={onOk}>确定</Button>
            </CustomModal>
            {/* 创建文件夹 */}
            <CustomModal
                width={360}
                open={createVisible}
                title={(<Title title='创建文件夹' />)}
                onCancel={onClose}
            >
                <Form
                    onFinish={onFinish}
                >
                    <Form.Item label='文件夹名称' name='name'>
                        <Input autoComplete='off' placeholder='请输入文件夹名称' />
                    </Form.Item>
                    <Button loading={loading} type="primary" htmlType='submit' className='marglauto block margt20'>确定</Button>
                </Form>
            </CustomModal>
        </React.Fragment>
    )
}

export default forwardRef(FileList);