import React, {lazy, Suspense, useEffect, useRef, useState} from 'react';
import type { FC } from 'react';
import {
	Route,
	Routes,
	HashRouter as Router,
	Navigate,
} from "react-router-dom";
import { App } from 'antd';
import CustomerRouter from "./pages/Route"
import Loading from './pages/Loading';  // loading页
const Index: FC = () => (
	<React.Fragment>
		<Router>
			<Suspense fallback={<Loading />}>
				<CustomerRouter />
			</Suspense>
		</Router>
	</React.Fragment>
);

export default () => (<App>
	<Index  />
</App>);