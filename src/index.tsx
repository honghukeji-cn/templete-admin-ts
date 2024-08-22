import React from 'react';
import ReactDOM from 'react-dom/client';
import  "core-js/es";
import  "react-app-polyfill/ie9";
import  "react-app-polyfill/stable";
import './reset.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN';
const element:HTMLElement=document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(
	 element
);

const data:any = localStorage.getItem('themeConfig_honghu');
const themeConfig = JSON.parse(data) || {
	"colorPrimary": "#009b6b",
	"colorSuccess": "#0081ff",
	"colorWarning": "#ffb800",
	"colorError": "#FF4B24"
};
element.style.setProperty("--main-colorPrimary",themeConfig.colorPrimary)
element.style.setProperty("--main-colorSuccess",themeConfig.colorSuccess)
element.style.setProperty("--main-colorWarning",themeConfig.colorWarning)
element.style.setProperty("--main-colorError",themeConfig.colorError)
root.render(
	<ConfigProvider
		locale={locale}
		theme={{
			token: themeConfig
		}}
	>
		<App />
	</ConfigProvider>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
