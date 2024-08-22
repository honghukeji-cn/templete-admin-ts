import React, { createRef, useEffect, useState, lazy, Suspense } from 'react';
import { Layout, Menu, Dropdown, Tabs, App, theme } from 'antd';
import * as req from '../util/request';
import CustomModal from '../component/CustomerModal';
import Title from '../component/Title';

// 子页面
import EditPwd from './system/EditPwd';  //修改密码
import UserInfo from './system/UserInfo';  //个人信息
import SetColor from './system/SetColor';  //主题配色
// loading页
import Loading from './Loading';
// 路由
const AdminList = lazy(() => import('./system/admin/AdminList'));  // 管理员列表
const RoleList = lazy(() => import('./system/role/RoleList'));  //角色列表
const BasicInfo = lazy(() => import('./system/set/BasicInfo'));  // 基本信息配置
const MenuSet = lazy(() => import('./system/menu/MenuSet'));  // 菜单管理
const UploadSet = lazy(() => import('./system/UploadSet'));  // 上传设置
const OperationLog = lazy(() => import('./system/OperationLog'));  // 操作日志

function getItem(label, key, path, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
        path
    };
}

const { Header, Content, Sider } = Layout;
let rootSubmenuKeys = [];

const Components = {
    'AdminList': AdminList,
    'RoleList': RoleList,
    'BasicInfo': BasicInfo,
    "MenuSet": MenuSet,
    "UploadSet": UploadSet,
    "OperationLog": OperationLog,
}
let tabRef = [];
const list = (path, id) => {
    var MyComponentt = Components[path];
    tabRef[id] = createRef();
    return <MyComponentt ref={tabRef[id]} />;
}

const Index = () => {
    const {
        token: { colorPrimary }
    } = theme.useToken();
    const { message } = App.useApp();
    const [collapsed, setCollapsed] = useState(false);  // 左侧导航是否展开/收起
    const [collapsedWidth,setCollapsedWith]=useState(0);
    const [auto,setAuto]=useState(false);//是否响应式
    const [openKeys, setOpenKeys] = useState(['']);// 只展开当前菜单
    const [selectedKeys, setSelectedKeys] = useState(['']);  // 当前选中菜单
    const [menu, setMenu] = useState([]);  // 左侧导航数据
    const [tabs, setTabs] = useState([]);  // 右侧顶部打开的页面
    const [activeKey, setActiveKey] = useState('');  // 当前选中的tab页
    const [path, setPath] = useState('');  // 当前tab展示的内容页
    const [pwdVisible, setPwdVisible] = useState(false);  // 修改密码弹出层
    const [infoVisible, setInfoVisible] = useState(false);  // 修改个人信息弹出层
    const [themeVisible, setThemeVisible] = useState(false);  // 主题弹出层
    const [info, setInfo] = useState({ avatar: require('../static/default.png'), username: '', systemName: '鸿鹄科技管理后台' })
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');
    const [sysName, setSysName] = useState('鸿鹄科技管理后台');
    // 右侧顶部目录
    const items = [{
        key: '1',
        label: (
            <p onClick={() => setPwdVisible(true)}>修改密码</p>
        )
    }, {
        key: '2',
        label: (
            <p onClick={() => setInfoVisible(true)}>个人信息</p>
        )
    }, {
        key: '3',
        label: (
            <p onClick={() => {
                localStorage.removeItem('honghuToken')
                message.success('再见', () => {
                    window.location.href = '';
                })
            }}>退出登录</p>
        )
    }]
    useEffect(() => {
        getData();
        setTimeout(() => {
            window.delDom && window.delDom()
        }, 2000);
    }, [])
    // 获取左边导航等数据
    const getData = () => {
        req.post('admin/getLoginInfo', {}).then(res => {
            if (res.code == 1) {
                let items = [];
                let menus = res.data.menus;
                setSysName(res.data.name)
                setUsername(res.data.username)
                setAvatar(res.data.avatar)
                setInfo(
                    { 
                        avatar: res.data.avatar,
                         username: res.data.username,
                          systemName: res.data.name }
                )
                // let menus = [
                //     {
                //         id: 1, title: '基本管理', path: '', icon: 'icon-yonghu', child: [
                //             // { id: 2, title: "角色列表", icon: "", path: "RoleList" },
                //             { id: 5, title: "管理员列表", icon: "", path: "AdminList" },
                //             { id: 36, title: "操作日志", icon: "", path: "OperationLog" }
                //         ]
                //     },
                //     {
                //         id: 7, title: "系统设置", path: "", icon: "icon-xitongshezhi", child: [
                //             { id: 15, title: "菜单管理", icon: "", path: "MenuSet" },
                //             { id: 25, title: "基本信息配置", icon: "", path: "BasicInfo" },
                //             { id: 26, title: "上传设置", icon: "", path: "UploadSet" },
                //             { id: 27, title: "合作伙伴", icon: "", path: "Partners" },
                //             { id: 28, title: "精选服务配置", icon: "", path: "ServiceConfig" },
                //             { id: 29, title: "战略性新兴产业分类", icon: "", path: "ZlCate" },
                //         ]
                //     },
                //     { id: 30, title: '企业管理', path: 'BusinessList', icon: 'icon-a-huanzhequnzhong', child: [] },
                //     { id: 37, title: '科技中介机构管理', path: 'InstitutionList', icon: 'icon-a-huanzhequnzhong', child: [] },
                //     {
                //         id: 38, title: "新闻管理", path: "", icon: "icon-xitongshezhi", child: [
                //             { id: 39, title: "新闻分类", icon: "", path: "NewsType" },
                //             { id: 40, title: "新闻列表", icon: "", path: "NewsList" },
                //         ]
                //     },
                //     { id: 41, title: '成果管理', path: 'AchievementList', icon: 'icon-a-huanzhequnzhong', child: [] },
                //     { id: 42, title: '需求管理', path: 'DemandList', icon: 'icon-a-huanzhequnzhong', child: [] },
                //     { id: 43, title: '成功案例管理', path: 'SuccessfulCaseList', icon: 'icon-a-huanzhequnzhong', child: [] },
                // ]
                rootSubmenuKeys = [];
                for (let i in menus) {
                    let child = menus[i].child;
                    if (child.length > 0) {
                        rootSubmenuKeys.push(String(menus[i].id))
                        let c_menu = [];
                        for (let j in child) {
                            c_menu.push(
                                getItem(child[j].title, String(child[j].id), child[j].path)
                            )
                        }

                        items.push(
                            getItem(menus[i].title, String(menus[i].id), menus[i].path, (<p className={`iconfont ${menus[i].icon}`}></p>), c_menu)
                        )
                    } else {
                        if (menus[i].path && menus[i].path != '') {
                            items.push(
                                getItem(menus[i].title, String(menus[i].id), menus[i].path, (<p className={`iconfont ${menus[i].icon}`}></p>))
                            )
                        }
                    }
                }
                // 设置选择的menu
                console.log(menus)
                let setSelectedKeysArr,selectedLabel,selectedId,SelectedPath;
                if(menus[0].child.length==0)
                {
                    setSelectedKeysArr=[String(menus[0].id)];
                    selectedLabel={ label: menus[0].title, key: String(menus[0].id), path: menus[0].path, closable: false }
                    selectedId=String(menus[0].id)
                    SelectedPath=String(menus[0].path)
                }else{
                    setSelectedKeysArr=[String(menus[0].child[0].id), String(menus[0].id)];
                    selectedId=String(menus[0].child[0].id)
                    SelectedPath=String(menus[0].child[0].path)
                    selectedLabel= { label: menus[0].child[0].title, key: String(menus[0].child[0].id), path: menus[0].child[0].path, closable: false }
                }
                setSelectedKeys(setSelectedKeysArr)
                // 设置左边menu
                setMenu(items)
                // 设置打开的menu
                setOpenKeys([String(rootSubmenuKeys[0])])
                // 设置tab页
                setTabs([
                    selectedLabel
                ])
                // 设置选中的tab
                setActiveKey(selectedId);
                // 设置内容页
                setPath(SelectedPath)
            }
        })
    }
    // 左边导航点击
    const onClick = (e) => {
        // console.log('click ', e.keyPath);
        let row = menu.find(item => item.key == e.key);
        // console.log(row)
        if (!row) {
            bsd:
            for (let i in menu) {
                let child = menu[i].children;
                if (child) {
                    let index = child.findIndex(d => d.key == e.key);
                    if (index > -1) {
                        // 设置选中tab
                        setActiveKey(String(child[index].key))
                        // 调用tab变化
                        add({ label: child[index].label, key: String(child[index].key), path: child[index].path });
                        // 设置内容页
                        setPath(child[index].path);
                        break bsd
                    }
                }
            }
        } else {  // 以及存在且path不为空
            // 设置选择的tab
            setActiveKey(String(row.key))
            // 调用tab变化
            add({ label: row.label, key: String(row.key), path: row.path });
            // 设置内容页
            setPath(row.path);
        }
        // 设置选择的menu
        setSelectedKeys(e.keyPath)
    };
    // 左边导航展开
    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) == -1);
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) == -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };
    // 右边顶部tab新增或删除
    const onEdit = (targetKey, action) => {
        if (action == 'remove') {
            remove(targetKey);
        }
    };
    // 右边顶部tab删除
    const remove = (targetKey) => {
        const targetIndex = tabs.findIndex((pane) => pane.key == targetKey);
        const newPanes = tabs.filter((pane) => pane.key != targetKey);
        if (newPanes.length && targetKey == activeKey) {
            const { key, path } = newPanes[targetIndex == newPanes.length ? targetIndex - 1 : targetIndex];
            changeKeys(key);
            // 设置选中的tab
            setActiveKey(key);
            // 设置内容页
            setPath(path)
        }
        setTabs(newPanes);
    };
    // 右边顶部tab新增
    const add = (data) => {
        let index = tabs.findIndex(item => item.key == data.key);
        if (index > -1) {

        } else {
            setTabs([...tabs, { label: data.label, key: data.key, path: data.path, closable: true, }])
        }
    }
    // 右边顶部tab切换
    const onChange = (key) => {
        changeKeys(key);
        let index = tabs.findIndex(item => item.key == key);
        if (index > -1) {
            setPath(tabs[index].path);  // 设置内容页
        }
        setActiveKey(key);  // 设置选中tab
    };
    // 右边顶部刷新按钮点击事件
    const refresh = () => {
        tabRef[selectedKeys[0]].current && tabRef[selectedKeys[0]].current.refresh()
    }
    // 设置左边导航展开栏和选中项
    const changeKeys = (key) => {
        let keyPath = [];
        let index = menu.find(item => item.key == key);
        // 判断当前tab是否是一级 一级存在
        if (index) {
            setSelectedKeys([key]);  // 设置选中的menu
            setOpenKeys([key])  // 设置打开的menu
            return
        }
        // 一级不存在
        bsd:
        for (let i in menu) {
            let child = menu[i].children;
            if (child) {
                let row = child.find(item => item.key == key);
                if (row) {
                    keyPath = [row.key, menu[i].key]
                    setSelectedKeys(keyPath);  // 设置选中的menu
                    setOpenKeys([menu[i].key])  // 设置打开的menu
                    break bsd
                }
            }
        }
    }
    // 关闭弹出层
    const onCancel = () => {
        setPwdVisible(false);
        setInfoVisible(false);
        setThemeVisible(false);
    }
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                width={240}
                breakpoint="lg"
                collapsedWidth={collapsedWidth}
                className='leftMenu'
                theme='light'
                onBreakpoint={(broken) => {
                    console.log(broken);
                    setAuto(broken);
                    setCollapsed(broken)
                }}
                trigger={null}
                collapsible
                collapsed={collapsed}
            >
                <div className='logo'>
                    <p style={{ background: colorPrimary }}>{sysName != "" ? sysName.substring(0, 2) : ""}</p>
                    <h1>{sysName}</h1>
                </div>
                <Menu
                    mode='inline'
                    openKeys={openKeys}
                    selectedKeys={selectedKeys}
                    items={menu}
                    onClick={onClick}
                    onOpenChange={onOpenChange}
                    className='menus'
                />
            </Sider>
            <Layout className="site-layout">
                <Header className='headtop' style={{ padding: 0, background: '#fff', height: 90, }}>
                    <div className='flexCenter margl24' style={{ lineHeight: '54px' }}>
                        <p className={`cursor iconfont ${auto?(collapsedWidth==0 ? 'icon-zhankai' : 'icon-shouqi'):(collapsed ? 'icon-zhankai' : 'icon-shouqi')}`} onClick={() => {
                            // setCollapsed(!collapsed)
                            console.log(auto)
                            if(auto)
                            {
                                setCollapsedWith(collapsedWidth==0?60:0)
                            }else{
                                setCollapsed(!collapsed)
                            }

                        }}></p>
                        <p className={`cursor iconfont icon-shuaxin margl24`} onClick={refresh}></p>
                        <div className='zhut flexCenter' onClick={() => setThemeVisible(true)}>
                            <p className='iconfont icon-zhuti'></p>
                            <p>主题</p>
                        </div>
                        <img alt='' src={avatar!=""?avatar:require('../static/default.png')} className='avatar' />
                        <Dropdown placement='bottom' menu={{ items }} arrow>
                            <div className='flexCenter cursor' style={{ height: 24, }}>
                                 <p>{username}</p>
                                <span className='iconfont icon-jiantou-shang'></span>
                            </div>
                        </Dropdown>
                    </div>
                </Header>
                <Content style={{ padding: 24 }}>
                    <Tabs
                        className='asdTabs'
                        items={tabs}
                        type="editable-card"
                        hideAdd
                        activeKey={activeKey}
                        onEdit={onEdit}
                        onChange={onChange}
                    />
                    <Suspense fallback={<Loading />}>
                        {path != '' && list(path, activeKey)}
                    </Suspense>
                </Content>
            </Layout>
            {/* 修改密码 */}
            <CustomModal
                open={pwdVisible}
                title={(<Title title='修改密码' />)}
                width={360}
                onCancel={onCancel}
            >
                <EditPwd />
            </CustomModal>
            {/* 修改个人信息 */}
            <CustomModal
                open={infoVisible}
                title={(<Title title='个人信息' />)}
                width={360}
                onCancel={onCancel}
            >
                <UserInfo data={info} onOk={() => {
                    onCancel();
                    getData()
                }} />
            </CustomModal>
            {/* 主题配色 */}
            <CustomModal
                open={themeVisible}
                title={(<Title title='主题配色' />)}
                width={1172}
                onCancel={onCancel}
            >
                <SetColor onCancel={onCancel} />
            </CustomModal>
        </Layout>
    )
};


export default Index;