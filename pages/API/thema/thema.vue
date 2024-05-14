<template>
	<view>
		<view class="uni-container" style="margin-top: 20px;">
			<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据" >
				<uni-tr>
					<uni-th width="4" align="center">序号</uni-th>
					<uni-th width="40" align="center">接口名称</uni-th>
					<uni-th align="center">关联关系</uni-th>
					<uni-th align="center">数据字段</uni-th>
					<uni-th width="4" align="center">重命名</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in baseFormData.respExplainedFormat" :key="index+1">
					<uni-td align="left">{{ index+1 }}</uni-td>
					<uni-td> <view class="name">{{ item.name }}</view> </uni-td>
					<uni-td align="left" >{{ index>0?item.relation:'无' }}</uni-td>
					<uni-td align="left" >{{ item.fields }}</uni-td>
					<uni-td> 
						<button class="button" size="mini" type="primary" @tap="inputDialogToggle(item.id, item.relation, index)" style="margin-left: -1px; " >关联设置</button> 
						<button class="button" size="mini" type="primary" @tap="addDynamicTable($event, item.id, index)" style="margin-left: -1px; " >新增</button> 
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>
	</view>
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
					respExplainedFormat: [{id: 1001, name: 'E1001'+'订单数据', desc: '接口详情', relation: 'id=orderId', fields: '字段集', fieldsExplain: ''}]
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
			addDynamicTable(e, id, index) {
				// 添加字段输入框
				this.baseFormData.respExplainedFormat.push({id: Date.now(), name: 'E1001'+'订单数据' + id, desc: '接口详情', relation: 'id=userId', fields: 'id=userId', fieldsExplain: ''});
				// this.$forceUpdate()
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
