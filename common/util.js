function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}

var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};


// 定义一个枚举对象
const JsonValueDataTypeEnum = {
  JSON_OBJECT: 'JsonObject',
  JSON_ARRAY: 'JsonArray',
  SINGLE_VALUE: 'SingleValue'
}

function JsonValueDataType(value) {
	if(isJson(value)) {
		return JsonValueDataTypeEnum.JSON_OBJECT;
	}
	if(Array.isArray(value)) {
		// if(value[0]== null) return JsonValueDataTypeEnum.SINGLE_VALUE;
		if(isJson(value[0])) return JsonValueDataTypeEnum.JSON_ARRAY; 
		return JsonValueDataTypeEnum.SINGLE_VALUE;
	}
	if(typeof value !== 'object' && !Array.isArray(value)) {
		return JsonValueDataTypeEnum.SINGLE_VALUE;
	}	
}

function isJson(value){
	return (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date))
}

export {
	formatTime,
	formatLocation,
	dateUtils,
	JsonValueDataTypeEnum,
	JsonValueDataType,
}
