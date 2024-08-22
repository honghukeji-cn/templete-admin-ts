import React, { useImperativeHandle, forwardRef, useRef, useState,useEffect } from 'react';
import { Button, Input, theme, App } from 'antd';
import Title from '../../../component/Title';
import CustomTable from '../../../component/Table';
import CustomModal from '../../../component/CustomerModal';
import CustomerSelect from "../../../component/CustomerSelect";
import * as req from '../../../util/request';
import AddAdmin from './AddAdmin';

const Index = (_props: any, ref: any) => {
	const {
		token: { colorPrimary },
	} = theme.useToken();
	const { message, modal } = App.useApp();
	const tableRef: any = useRef(null);
	const [open, setOpen] = useState<boolean>(false);
	const [row, setRow] = useState<{ id?: number, role_name?: string, describe?: string, ids?: [] }>({});
	const [type, setType] = useState<string>('');
	const [role_id, setRoleId] = useState<string>('');
	const [username, setWords] = useState<string>('');
	// 列表
	const columns = [
		{
			title: 'ID',
			align: 'center',
			dataIndex: 'admin_id',
			width: 90,
		}, {
			title: '用户昵称',
			align: 'center',
			dataIndex: 'username'
		}, {
			title: '上次登录时间',
			align: 'center',
			dataIndex: 'last_login_time',
			render: (time: string) => `${time || '-'}`
		}, {
			title: '上次登录IP',
			align: 'center',
			dataIndex: 'last_login_ip',
			render: (ip: string) => `${ip || '-'}`
		}, {
			title: '角色',
			align: 'center',
			dataIndex: 'role_name'
		}, {
			title: '添加时间',
			align: 'center',
			dataIndex: 'atime'
		}, {
			title: '操作',
			dataIndex: 'id',
			align: 'center',
			render: (id: number, item: any) => (
				<div className='flexAllCenter pubbtnbox'>
					<p style={{ color: colorPrimary }} onClick={() => {
						setRow(item)
						setType('edit');
						setOpen(true)
					}}>编辑</p>
					<p style={{ color: colorPrimary }} onClick={() => del(item)}>删除</p>
				</div>
			)
		}
	]
	useEffect(() => {
		refresh()
	}, [role_id,username])
	useImperativeHandle(ref, () => ({
		refresh,
	}))
	const refresh = () => {
		tableRef.current.onRefresh()
	}
	// 获取列表数据
	const getList = (info: any, callback: any) => {
		req.post('admin/adminList', {
			page: info.page,
			size: info.size,
			orderBy: '',
			username,
			role_id,
		}).then(res => {
			callback(res)
		})
	}
	// 首次进入页面初始化
	const onRefresh = (info: { page: number, size: number }, callback: () => void) => {
		getList(info, callback)
	}
	const onCancel = () => {
		setOpen(false);
		setRow({});
		setType('')
	}
	// 删除
	const del = (data: any) => {
		modal.confirm({
			title: '警告提示',
			content: '您要删除该项数据吗？删除后将无法恢复！',
			centered: true,
			maskClosable: true,
			onOk: () => {
				req.post('admin/delAdmin', { admin_id: data.admin_id }).then(res => {
					if (res.code == 1) {
						refresh()
					} else {
						message.error(res.msg, 1.2);
					}
				})
			}
		})
	}
	return (
		<React.Fragment>
			<div className='h100 flexColumn'>
				<div className='flwp'>
					<Input
						className='pubInpt borderbai marginr12'
						prefix={(<span className='iconfont icon-sousuo marginr4'></span>)}
						placeholder='请输入'
						allowClear
						onChange={(e) => {
							setWords(e.target.value || '');
						}}
					/>
					<CustomerSelect
						className='borderbai marginr12'
						type='allrole'
						placeholder='请选择角色'
						onChange={(role_id: string) => setRoleId(role_id || '')}
					/>
					<Button type="primary" onClick={() => {
						setOpen(true);
					}}>添加管理员</Button>
				</div>
				<div className='bgbai margt20 flex_auto'>
					<Title title='角色列表' />
					<CustomTable
						ref={tableRef}
						columns={columns}
						onRefresh={onRefresh}

					/>
				</div>
			</div>
			{/* 添加/编辑 */}
			<CustomModal
				open={open}
				width={360}
				onCancel={onCancel}
				title={(<Title title={`${type === 'edit' ? '编辑' : '添加'}管理员`} />)}
			>
				<AddAdmin type={type} data={row} onOk={()=>{
					setOpen(false);
					refresh()
				}} />
			</CustomModal>
		</React.Fragment>
	)
};

export default forwardRef(Index);