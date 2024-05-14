<template>
	<view>
		<page-head title="计算 重命名"></page-head>
		<view v-for="(item,index) in baseFormData.explains" :key="item.id" :label="item.label" :rules="item.rules" :name="['groupMergeFields',index,'value']" >
			<uni-card :is-shadow="false" is-full>
				<text class="uni-h6">{{item.text}}</text>
			</uni-card>
		</view>
	</view>
</template>
<script>
	
	export default {
		data() {
			return {
				baseFormData: {
					explains:[
						{'text': '#：计算表达式；$：取常量值；@：字符串拼接；%：数值、时间 格式化 【以下为示例】'},
						{'text': '表达式 feeAmount:#-1*(payPriceOfflineOther)|payPriceOfflineOther,fee:$0'},
						{'text': '格式化 receiptTime:%2finishTime'},
						{'text': '%1 日期处理：1-yyyy-MM-dd'},
						{'text': '%2 日期处理：2-yyyy-MM-dd hh:mm:ss'},
						{'text': '%3 数值处理：3-四舍五入保留2位小数'},
						{'text': '%4 数值处理：4-保留2位其余截去'},
						{'text': 'costItemId:$72：取常量值'},
					]
				}
			}
		},
		methods: {
			formSubmit: function(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
                //定义表单规则
                var rule = [
                    {name:"nickname", checkType : "string", checkRule:"1,3",  errorMsg:"姓名应为1-3个字符"},
                    {name:"gender", checkType : "in", checkRule:"男,女",  errorMsg:"请选择性别"},
                    {name:"loves", checkType : "notnull", checkRule:"",  errorMsg:"请选择爱好"}
                ];
                //进行表单检查
                var formData = e.detail.value;
                var checkRes = graceChecker.check(formData, rule);
                if(checkRes){
                    uni.showToast({title:"验证通过!", icon:"none"});
                }else{
                    uni.showToast({ title: graceChecker.error, icon: "none" });
                }
			},
			formReset: function(e) {
				console.log('清空数据')
			}
		}
	}
</script>

<style>
	.uni-form-item .title {
		padding: 20rpx 0;
	}
</style>
