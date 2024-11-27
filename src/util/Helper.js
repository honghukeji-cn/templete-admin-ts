export default class Helper {
	static getNum(index, total, size, page, orderBy) {
		var num = index + 1;
		if (orderBy == "desc") {
			num = total - (page - 1) * size - (num - 1);
		} else {
			num = (page - 1) * size + num
		}
		if (num < 10) {
			num = '0' + num;
		}
		return num
	}
	static getNums(value) {
		// 只允许输入数字
		value = value.replace(/[^\d]/g, '')
		return value
	}
	static getFloat(obj) {
		// 只允许输入一个小数点和数字 
		obj = obj.replace(/[^\d.]/g, ""); //先把非数字的都替换掉，除了数字和.
		obj = obj.replace(/^\./g, ""); //必须保证第一个为数字而不是.
		obj = obj.replace(/\.{2,}/g, "."); //保证只有出现一个.而没有多个.   
		obj = obj.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
		obj = obj.replace(".", "$#$").replace(/\./g, "").replace("$#$", "."); //保证.只出现一次，而不能出现两次以上
		return obj;
	}
	static getNums_1(value) {
		// 只允许输入数字和-
		value = value.replace(/[^(\-)\d]/g, '')
		value = value.replace(/\.{2,}/g, "-"); //保证只有出现一个.而没有多个.
		value = value.replace("-", "$#$").replace(/\-/g, "").replace("$#$", "-"); //保证.只出现一次，而不能出现两次以上
		return value
	}
	static getValue(value) {
		if (!value) {
			return value
		}
		// 去掉富文本所有标签
		value = value.replace(/(\n)/g, "");
		value = value.replace(/(\t)/g, "");
		value = value.replace(/(\r)/g, "");
		value = value.replace(/<\/?[^>]*>/g, "");
		value = value.replace(/\s*/g, "");
		return value
	}
	static getSex(idcard) {
		if (parseInt(idcard.substr(16, 1)) % 2 == 1) {
			return "男"
		} else {
			return "女"
		}
	}
	static getBirth(idcard) {
		//获取出生年月日
		var yearBirth = idcard.substring(6, 10);
		var monthBirth = idcard.substring(10, 12);
		var dayBirth = idcard.substring(12, 14);
		var birthday = yearBirth + '-' + monthBirth + '-' + dayBirth;
		if (monthBirth > 12) {
			return undefined
		}
		return birthday
	}
	static timestampFormat(timestamp) {
		function zeroize(num) {
			return (String(num).length == 1 ? '0' : '') + num;
		}
		if (typeof timestamp != 'number') {
			let date = new Date(timestamp.replace(/-/g, '/'))
			timestamp = Date.parse(date)
			timestamp = timestamp / 1000;
		}
		// timestamp=timestamp/1000;
		// timestamp=timestamp*1000;
		var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
		var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

		var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
		var tmDate = new Date(timestamp * 1000); // 参数时间戳转换成的日期对象

		var Y = tmDate.getFullYear(),
			m = tmDate.getMonth() + 1,
			d = tmDate.getDate();
		var H = tmDate.getHours(),
			i = tmDate.getMinutes(),
			s = tmDate.getSeconds();

		if (timestampDiff < 60) { // 一分钟以内
			return "刚刚";
		} else if (timestampDiff < 3600) { // 一小时前之内
			return Math.floor(timestampDiff / 60) + "分钟前";
		} else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
			return '今天' + zeroize(H) + ':' + zeroize(i);
		} else {
			var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
			if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
				return '昨天' + zeroize(H) + ':' + zeroize(i);
			} else if (curDate.getFullYear() == Y) {
				return zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
			} else {
				return Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i);
			}
		}
	}

	static showModal(){
		return(<div style={{width:100,height:100,background:"red"}}></div>);
	}

	static getRandomString(length) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}
	static str2fileList(str)
	{
		var imgs=str.split(",");
		var fileList=[];
		for(var i=0;i<imgs.length;i++)
		{
			fileList.push({
				uid:this.getRandomString(12),
				name:this.getRandomString(6),
				url:imgs[i],
				thumbUrl:imgs[i],
				status:"done"
			})
		}
		return fileList;
	}
	static fileList2str(fileList){
		var imgs=[];
		for(var i=0;i<fileList.length;i++)
		{
			imgs.push(fileList[i].url)
		}
		return imgs.join(",")
	}

	static regCheck(regRule,value){

		var reg=new RegExp(regRule);
		console.log(reg,value)
		if(!value){
			return false;
		}
		return reg.test(value);
	}

	static getFileSize(size){
		if(size<1024*1024)
		{
			//1M以内
			size=(size/1024).toFixed(2)+"K";
		}else if(size<1024*1024*1024)
		{
			//1G内
			size=(size/(1024*1024)).toFixed(2)+"M";
		}else{
			//G
			size=(size/(1024*1024*1024)).toFixed(2)+"G";
		}
		return size;
	}

	static saveAs(data, name) {

		const blob = new Blob([data]);

		const aElement = document.createElement('a');

		const blobUrl = window.URL.createObjectURL(blob);

		aElement.href = blobUrl;

		aElement.download = name;

		aElement.click();

		window.URL.revokeObjectURL(blobUrl);

	}
}