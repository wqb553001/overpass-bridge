
				
			export const dataLength = [ // 单选数据源  // 默认选项，在data中设置
					{text: '分页全取',		value: 0},
					 {text: '取1条',		value: 1},
					 {text: '取指定数量',	value: 2},
				];


				// 聚合类型
			export const	mergeStyles = [
					{text: 'avg 平均值',	value: 10},
					{text: 'min 最小值',	value: 20},
					{text: 'max 最大值',	value: 30},
					{text: 'sum 累加值',	value: 40},
					
				];
				// 时间参数
			export const	paramTimeList= [
					{text: '执行当下 now',	value: 10},
					{text: '今日 凌晨',		value: 20},
					{text: 'n日前 凌晨',		value: 30},
					{text: '本周初 凌晨',	value: 40},
					{text: 'n周初 凌晨',		value: 50},
					{text: '本季度初 凌晨',	value: 60},
					{text: 'n季度初 凌晨',	value: 70},
					{text: '本月初 凌晨',	value: 80},
					{text: 'n月初 凌晨',		value: 90},
					{text: '本年初 凌晨',	value: 100},
					{text: 'n年初 凌晨',		value: 110},
					
				];
			export const	opts= [
					{text: '>',		value: 10},
					{text: '<',		value: 20},
					{text: '>=',	value: 30},
					{text: '<=',	value: 40},
					{text: '!=',	value: 50},
					
				];

				// 重试策略
			export const	retryStrategy= [
					{text: "无限重试",									value: -1},
					{text: "重试 n 次",									value: 10},
					{text: "当日内（次日00:00前）",						value: 20},
					{text: " n 日内",									value: 30},
					{text: "本月内（次月01 00:00前）",					value: 40},
					{text: " n 月内",									value: 50},
					{text: "本季度内（下季度(04/07/10/01).01 00:00前）",	value: 60},
					{text: " n 季度内",									value: 70},
					{text: "本年内（次年01.01 00:00前）",				value: 80},
					{text: " n 年内",									value: 90},
				];
				
				
				// 执行时机
			export const	executeTime= [
					{text: '表示每2秒 执行任务		【0/2 * * * * ?】',	value: 10,	cron: '0/2 * * * * ?'},
					 {text: '每2分钟 执行任务		【0 0/2 * * * ?】',	value: 20,	cron: '0 0/2 * * * ?'},
					 {text: '每月的1日的凌晨2点 执行任务		【0 0 2 1 * ?】',	value: 30,	cron: '0 0 2 1 * ?'},
					 {text: '每天上午10点，下午2点，4点 执行任务	【0 0 10,14,16 * *】',	value: 40,	cron: '0 0 10,14,16 * * ?'},
					 {text: '朝九晚五工作时间内每半小时 执行任务	【0 0/30 9-17 * *】',	value: 50,	cron: '0 0/30 9-17 * * ?'},
					 {text: '每天中午12点 执行任务		【0 0 12 * * ?】',	value: 60,	cron: '0 0 12 * * ?'},
					 {text: '每天上午10:15 执行任务		【0 15 10 ? * *】',	value: 70,	cron: '0 15 10 ? * *'},
					 {text: '每天下午2点到下午2:59期间的每1分钟 执行任务		【0 * 14 * * ?】',	value: 80,	cron: '0 * 14 * * ?'},
					 {text: '每天下午2点到下午2:55期间的每5分钟 执行任务		【0 0/5 14 * * ?】',	value: 90,	cron: '0 0/5 14 * * ?'},
					 {text: '每天下午2点到2:55期间和下午6点到6:55期间的每5分钟 执行任务		【0 0/5 14,18 * * ?】',	value: 100,	cron: '0 0/5 14,18 * * ?'},
					 {text: '每天下午2点到下午2:05期间的每1分钟 执行任务		【0 0-5 14 * * ?】',	value: 110,	cron: '0 0-5 14 * * ?'},
					 {text: '每月15日上午10:15 执行任务		【0 15 10 15 * ?】',	value: 120,	cron: '0 15 10 15 * ?'},
					 {text: '每月最后一日的上午10:15 执行任务		【0 15 10 L * ?】',	value: 130,	cron: '0 15 10 L * ?'},
					 {text: '每个星期三中午12点 执行任务		【0 0 12 ? * WED】',	value: 140,	cron: '0 0 12 ? * WED'},
					 {text: '每年三月的星期三的下午2:10和2:44 执行任务		【0 10,44 14 ? 3 WED】',	value: 150,	cron: '0 10,44 14 ? 3 WED'},
					 {text: '周一至周五的上午10:15 执行任务		【0 15 10 ? * MON-FRI】',	value: 160,	cron: '0 15 10 ? * MON-FRI'},
					 {text: '每月的最后一个星期五上午10:15 执行任务		【0 15 10 ? * 6L】',	value: 170,	cron: '0 15 10 ? * 6L'},
					 {text: '每月的第三个星期五上午10:15 执行任务		【0 15 10 ? * 6#3】',	value: 180,	cron: '0 15 10 ? * 6#3'},
					
				];
			export const	nextPageStrategy= [
					{text: '递增页号',	value: 10},
					 {text: '指针顺取',	value: 20},
					
				];
				
			
			// 单选数据源
		export const	reqMethod= [ // 默认选项，在data中设置
				{
					text: 'POST',value: 'POST',
				}, {
					text: 'GET',value: 'GET'
				}, {
					text: '其他',value: '其他'
				}
			];