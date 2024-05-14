<template>
	<uni-card :is-shadow="false" is-full>
		<text class="uni-h6" style="justify-content: center; align-items: center; text-align: center; display: flex;">
			【异常进行记录，设置异常重试策略；通过通知，将异常信息发送给配置的负责人】
		</text>
	</uni-card>
	<uni-forms ref="baseForm" :model="baseFormData" labelWidth="80px" style="margin-left: 20px;" >
		<view class="uni-container" style="margin-top: 20px;">
			<uni-forms-item label="重试策略" class="retryStrategy">
				<uni-data-picker v-model="baseFormData.retryStrategy" :localdata="retryStrategy" @change="retryStrategyChange" popup-title="选择" :ellipsis="false" style="float: left; width: 340px; margin-right: 20px;"></uni-data-picker>
				<uni-number-box :min="0" :max="100000000" :value="baseFormData.retryStrategyTimes" style="float: left; " :color="numberBoxProps.retryStrategy.color" :disabled="numberBoxProps.retryStrategy.disabled"  width="120" />
			</uni-forms-item>
		</view>
	</uni-forms>
	<view>
		<!-- 提示信息弹窗 -->
		<uni-popup ref="message" type="message">
			<uni-popup-message :type="toggleMessage.msgType" :message="toggleMessage.messageText" :duration="4000"></uni-popup-message>
		</uni-popup>
		<!-- 输入框示例 -->
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose"  mode="input" :title="relation.title" :value="relation.value"
				:placeholder="relation.placeholder" @confirm="dialogInputConfirm($event, relation.index, relation.id)">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseFormData: {
					retryStrategy: "-1",
				},
				// 重试策略
				retryStrategy: [
					{text: "无限重试",									value: -1},
					{text: "重试 n 次",									value: 10},
					{text: "当日内（次日00:00前）",						value: 20},
					{text: " n 日内",									value: 30},
					{text: "本月内（次月01 00:00前）",					value: 40},
					{text: " n 月内",									value: 50},
					{text: "本季度内（下季度(04/07/10/01).01 00:00前）",	value: 60},
					{text: " n 季度内",									value: 70},
					{text: "本年内（次年01.01 00:00前）",				value: 80},
					{text: " n 年内",									value: 90}
				],
				retryStrategyTimes: "0",
				numberBoxProps: {
					retryStrategy: 	{color: "#fff",	disabled: true,},
				},
				// 重命名字段弹出框
				relation: {
					title: '格式示例 id=uId,name=uName',
					placeholder: '请输入与前面结果集的关联关系',
					index: '',
					id: '',
					value: ''
				},
				// 提示信息弹窗 -begin --<<--
				toggleMessage: {
					type: 'center',
					msgType: 'success',
					messageText: '这是一条成功提示',
					value: ''
				},
			};
		},
		methods: {
			retryStrategyChange(e){
				const selectVal = e.detail.value[0].value
				this.baseFormData.retryStrategy = selectVal
				
				if(selectVal == 10 || selectVal == 30 || selectVal == 50 
				|| selectVal == 70 || selectVal == 90 ){
					// 选中了 带有 n ，需要指定数量
					this.numberBoxProps.retryStrategy.color = "#000",
					this.numberBoxProps.retryStrategy.disabled = false
				}else{
					this.numberBoxProps.retryStrategy.color = "#fff"
					this.numberBoxProps.retryStrategy.disabled = true
					this.baseFormData.retryStrategyTimes = 0
				}
				console.log('e:',selectVal);
			},
			// 弹出输入框
			inputDialogToggle(id, relation, index) {
				// console.log("点击修改 ", index)
				if(index == 0) {
					this.messageToggle('error', '无需设置。\n关联是指当前接口与上一个接口的关联关系。第一个接口，不存在上一个接口。')
					return;
				}
				this.relation.id = id
				this.relation.index = index
				this.relation.value = relation
				this.$refs.inputDialog.open()
			},
			// 输入框点击确认
			dialogInputConfirm(e, index, id) {
				// uni.hideLoading()
				console.log("修后的 index:", index)
				console.log("e:", e)
				console.log("id:", id)
				// this.fieldCheck.repeatFieldSet
				// this.baseFormData.respExplainedFormat.set(this.rename.key, val)
				// this.baseFormData.respExplainedFormat.set(this.relation.key, val)
				this.baseFormData.respExplainedFormat[index].relation = e
				// 关闭窗口后，恢复默认内容
				this.$refs.inputDialog.close()
			},
			messageToggle(type, msg) {
				this.toggleMessage.msgType = type
				this.toggleMessage.messageText = msg
				this.$refs.message.open()
			},
		}
	}
</script>

<style lang="scss">

</style>
