import React, {createRef, lazy,} from "react";
import {useRoutes} from "react-router-dom";
import Helper from "../util/Helper";

const Login = lazy(() => import('./auth/Login'));
const Layout = lazy(() => import("./Layout"));
const Page404 = lazy(() => import("./Page404"));
export const Components={
    AdminList:lazy(() => import('./system/admin/AdminList')),
    RoleList:lazy(() => import('./system/role/RoleList')),
    BasicInfo:lazy(() => import('./system/set/BasicInfo')),
    MenuSet:lazy(() => import('./system/menu/MenuSet')),
    UploadSet:lazy(() => import('./system/UploadSet')),
    OperationLog:lazy(() => import('./system/OperationLog')),
    AuthConfig:lazy(() => import('./system/AuthConfig')),
    DbBackUp:lazy(() => import('./system/DbBackUp')),
}
export const getRouter = () => {
    const adminChildren = []
    const routeRef = createRef();
    Object.keys(Components).forEach(item => {
        const Child = Components[item]
        adminChildren.push({
            path: item,
            element: <Child ref={routeRef}/>,
            id: item,
        })

    })
    return [
        {
            path: '/',
            element: <Login/>,
        },
        {
            path: '/login',
            element: <Login/>,
            id: 'login',
        },
        {
            path: '/admin',
            element: <Layout routeRef={routeRef}/>,
            id: 'admin',
            children: adminChildren
        },
        {
            path: '*',
            element: <Page404/>,
            id: '404',
        }
    ]
}
export const getRoute = () => {
    const tree = getRouter()
    // const location = useLocation()
    const urlArr = document.location.href.split('/');
    // const routePathArr = location.pathname.split('/')
    return Helper.findNode({
        tree,
        id: urlArr[urlArr.length - 1],
    }).data
}


const Index = () => useRoutes(getRouter())




export default Index