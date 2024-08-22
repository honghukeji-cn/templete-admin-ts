import React, {lazy, Suspense, useEffect, useRef, useState} from 'react';
import type { FC } from 'react';
import {
	Route,
	Routes,
	HashRouter as Router,
	Navigate,
} from "react-router-dom";
import { App } from 'antd';
import Loading from './pages/Loading';  // loading页
const Login = lazy(() => import('./pages/auth/Login'));
const Layout = lazy(() => import('./pages/Layout'));
const Index: FC = () => (
	<React.Fragment>
		<Router>
			<Suspense fallback={<Loading />}>
				<Routes>
					<Route path="login" element={<Login />} />
					<Route path="home" element={<Layout />} />
					{/* 默认访问----重定向至首页 */}
					<Route path="" element={<Navigate to="/login" />} />
				</Routes>
			</Suspense>
		</Router>
	</React.Fragment>
);

export default () => (<App>
	<Index  />
</App>);