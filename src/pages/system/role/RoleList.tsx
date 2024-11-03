import React, { useImperativeHandle, forwardRef, useState, useEffect, useRef } from 'react';
import {App, Button, Input, theme} from 'antd';
import Title from '../../../component/Title';
import CustomTable from '../../../component/Table';
import CustomModal from '../../../component/CustomerModal';
import AddRole from './AddRole';  // 添加/编辑角色
import * as req from '../../../util/request';
import CustomerSelect from "../../../component/CustomerSelect";
import SearchView from "../../../component/SearchView";

const Index = (_props: any, _ref: any) => {
	const {
		token: { colorPrimary },
	} = theme.useToken();
	const { message, modal } = App.useApp();
	const tableRef: any = useRef(null);
	const [open, setOpen] = useState<boolean>(false);
	const [row, setRow] = useState<{ id?: number, role_name?: string, describe?: string, ids?: [] }>({});
	const [type, setType] = useState<any>();

	const columns = [
		{
			title: '序号',
			align: 'center',
			dataIndex: 'key',
			width: 80,
		}, {
			title: '角色名称',
			align: 'center',
			dataIndex: 'role_name',
			width: 120,
		}, {
			title: '角色描述',
			align: 'center',
			dataIndex: 'describe',
			width: 180,
		}, {
			title: '添加时间',
			align: 'center',
			width: 180,
			dataIndex: 'atime'
		}, {
			title: '操作',
			dataIndex: 'id',
			align: 'center',
			width: 150,
			render: (id: number, item: any) => (
				<div className='flexAllCenter pubbtnbox'>
					<p style={{ color: colorPrimary }} onClick={() => {
						let data = JSON.parse(JSON.stringify(item));
						data.ids = JSON.parse(data.ids);
						setRow(data)
						setType('edit')
						setOpen(true)
					}}>编辑</p>
					<p onClick={() => del(item)} style={{ color: colorPrimary }}>删除</p>
				</div>
			)
		}
	]
	useImperativeHandle(_ref, () => ({
		refresh,
	}))
	// 手动刷新页面  参数page 非必传 默认当前页码
	const refresh = () => {
		tableRef.current.onRefresh()
	}
	// 获取列表数据
	const getList = (info: any, callback: any) => {
		req.post('role/roleList', {
			page: info.page,
			size: info.size,
			orderBy: '',
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
		setType('');
	}
	// 删除
	const del = (data: any) => {
		modal.confirm({
			title: '警告提示',
			content: '您要删除该项数据吗？删除后将无法恢复！',
			centered: true,
			maskClosable: true,
			onOk: () => {
				req.post('role/delRole', { role_id: data.role_id }).then(res => {
					if (res.code == 1) {
						refresh();
					} else {
						message.error(res.msg, 1.2);
					}
				})
			}
		})
	}
	return (
		<React.Fragment>
			{/*<div className='h100 flexColumn'>*/}
			{/*	<div className='flwp'>*/}
			{/*		<Button type="primary" onClick={() => {*/}
			{/*			setOpen(true);*/}
			{/*		}}>添加角色</Button>*/}
			{/*	</div>*/}
			{/*	<div className='bgbai margt20 flex_auto'>*/}
			{/*		<Title title='角色列表' />*/}
			{/*		<CustomTable*/}
			{/*			ref={tableRef}*/}
			{/*			columns={columns}*/}
			{/*			onRefresh={onRefresh}*/}
			{/*			scroll={{ y: window.innerHeight - 368,x:710 }}*/}
			{/*		/>*/}
			{/*	</div>*/}
			{/*</div>*/}
			<Title title='角色列表' />
			<SearchView
				buttons={[
					<Button type="primary" onClick={() => {
						setOpen(true);
					}}>添加角色</Button>
				]}
			/>

			<CustomTable
				ref={tableRef}
				columns={columns}
				onRefresh={onRefresh}
				scroll={{ y: window.innerHeight - 368,x:710 }}
			/>
			{/* 添加/编辑 */}
			<CustomModal
				open={open}
				width={900}
				onCancel={onCancel}
				title={(<Title title='添加角色' />)}
			>
				<AddRole
					data={row}
					type={type}
					onOk={() => {
						refresh();
						onCancel();
					}}
				/>
			</CustomModal>
		</React.Fragment>
	)
};

export default forwardRef(Index);