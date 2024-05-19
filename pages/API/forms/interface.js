function onLoadData(baseFormData, id){
	// 发送GET请求
	var url = "http://localhost:8088/overpass/service-bridge/interface/findById?interfaceId="+id
	await uni.request({
		url: url, // 你的后端API地址
		method: 'GET',
		success: (res) => {
			console.log('GET请求成功：', res.data.data);
			// Object.assign(target, ...source objects); 此方法用于将一个或多个源对象复制到目标对象。
			// 因为它在源上使用“ get”，在目标上使用“ Set”，所以它会调用getter和setter。
			// 它返回目标对象，该对象具有从目标对象复制的属性和值。此方法不会抛出空值或未定义的源值。
			Object.assign(baseFormData, res.data.data);
			console.log('limit数量：', baseFormData.limit);
		},
		fail: (err) => {
			console.error('GET请求失败：', err);
		}
	});
}

export onLoadData