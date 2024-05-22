<template>
	<view>
		<view class="uni-container" style="margin-top: 20px;">
			<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据" >
				<uni-tr>
					<uni-th width="4" align="center">序号</uni-th>
					<uni-th width="40" align="center">接口名称</uni-th>
					<uni-th align="center">关联关系</uni-th>
					<uni-th align="center">数据字段</uni-th>
					<uni-th width="4" align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in baseFormData.respExplainedFormat" :key="index+1">
					<uni-td align="left">{{ index+1 }}</uni-td>
					<uni-td> <view class="name">{{ item.name }}</view> </uni-td>
					<uni-td align="left" >{{ index>0?item.relation:'第一个接口，无需配置' }}</uni-td>
					<uni-td align="left" >
						<uni-easyinput class="respExplained" auto-height="true" type="textarea"
							v-html="item.respExplainedStyleStr" disabled="false" maxlength="5000" />
					</uni-td>
					<uni-td>
						<view v-if="item.id>0">
							<uni-icons type="closeempty" size="40" @click="deleteInterface(item)" class="buttonClass" ></uni-icons>
							<uni-icons type="redo" size="40" @click="onCopy(item.id, index)" class="buttonClass" ></uni-icons>
						</view>
						
						<view v-if="item.id>0">
							<uni-icons type="compose" size="40" @click="navigateToEditInterface(item.id, item.flowId)" class="buttonClass" ></uni-icons>							
						</view>
						<view v-if="item.lastId>1">
							<uni-icons type="up" size="40" @click="moveUp(item, index)" class="buttonClass" ></uni-icons>
						</view>
						<view v-if="initData.flowId>1">
							<uni-icons type="plusempty" size="40" @click="addInterface(item.id, index)" class="buttonClass" ></uni-icons>
						</view>
						<view v-if="item.nextId>1">
							<uni-icons type="down" size="40" @click="moveDown(item, index)" class="buttonClass" ></uni-icons>
						</view>
						
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>
	</view>
	<view>
		<!-- 提示信息弹窗 -->
		<uni-popup ref="showMessage" type="message">
			<uni-popup-message :type="toggleMessage.msgType" :message="toggleMessage.messageText" :duration="4000"></uni-popup-message>
		</uni-popup>
		<!-- 确认窗弹窗 -->
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog @confirm="alertDialogConfirmDelete" @close="dialogClose" :type="alertDialog.msgType" :cancelText="alertDialog.cancelText" :confirmText="alertDialog.confirmText" :title="alertDialog.title" :content="alertDialog.content"></uni-popup-dialog>
		</uni-popup>
		<!-- 输入框弹窗 -->
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose"  mode="input" :data="relation.title" :value="relation.value" :placeholder="relation.placeholder" @confirm="dialogInputConfirm($event, relation.index, relation.id)"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				baseFormData: {
					respExplainedFormat: [
						{
							id: 0,
							flowId: 0,
							name: '', 
							relation: '', 
							nextId: 0,
							lastId: 0,
							
							
							url: '',
							method: 'POST',
							respExplainedStyleStr: '',
							respExplainedJsonStr: '',
							respConstructor: {},
							limit: 0,
							limitNum: 0,
							nextPageField: '',
							pageNumField: '',
							isLastPageField: '',
							statusField: '',
							filterCondition: '',
							dataContentField: '',
							// hobby: [5],
							datetimesingle: 1627529992399,
							executeTimeExample: 70,
							executeTimeCron: "0 15 10 ? * *",
							retryStrategy: "-1",
							nextPageStrategy: 1,
							retryStrategyTimes: "0",
							skills: 0,
							dynamicTable: {
								timeField: {
									one: {
										opt: 0,
										time: 0,
										field: ''
									},
									array: []
									// array: [{id: 2, label: '时间字段', opt:2, time:1, field:'',
									// 		rules: [{'required': true, errorMessage: '时间字段必填'}]
									// }]
								},
								groupMergeField: {
									one: {
										opt: 0,
										time: 0,
										groupField: '',
										mergeField: ''
									},
									array: []
									// array: [{id: 2, label: '分组字段', opt:2, time:1, groupField:'', mergeField:''}]
								},
							}
						},
					]
				},
				initData: {
					id: 0,
					flowId: 0,
					name: '', 
					relation: '', 
					nextId: 0,
					lastId: 0,
					
					
					url: '',
					method: 'POST',
					respExplainedStyleStr: '',
					respExplainedJsonStr: '',
					respConstructor: {},
					limit: 0,
					limitNum: 0,
					nextPageField: '',
					pageNumField: '',
					isLastPageField: '',
					statusField: '',
					filterCondition: '',
					dataContentField: '',
					// hobby: [5],
					datetimesingle: 1627529992399,
					executeTimeExample: 70,
					executeTimeCron: "0 15 10 ? * *",
					retryStrategy: "-1",
					nextPageStrategy: 1,
					retryStrategyTimes: "0",
					skills: 0,
					dynamicTable: {
						timeField: {
							one: {
								opt: 0,
								time: 0,
								field: ''
							},
							array: []
							// array: [{id: 2, label: '时间字段', opt:2, time:1, field:'',
							// 		rules: [{'required': true, errorMessage: '时间字段必填'}]
							// }]
						},
						groupMergeField: {
							one: {
								opt: 0,
								time: 0,
								groupField: '',
								mergeField: ''
							},
							array: []
							// array: [{id: 2, label: '分组字段', opt:2, time:1, groupField:'', mergeField:''}]
						},
					}
				},
				// 重命名字段弹出框
				relation: {
					title: '格式示例 id=uId,name=uName',
					placeholder: '请输入与前面结果集的关联关系',
					index: '',
					id: '',
					value: ''
				},
				// 提示信息弹窗  
				toggleMessage: {
					type: 'center',
					msgType: 'success',
					messageText: '这是一条成功提示',
					value: ''
				},
				// 提示确认弹窗  
				alertDialog: {
					title: '确认删除？',
					type: 'center',
					msgType: 'success',	// success、error、warn、info
					cancelText: '不删了',
					confirmText: '删除',
					content: '删除接口配置，将无法恢复！',
					optId: 0,
					value: ''
				},
			};
		},
		onLoad(options){
			console.log("操作流程id：" + options.id)
			this.initData.flowId = options.id
			if(options.id) this.onLoadData(options.id)
		},
		methods: {
			onLoadData(flowId){
				// 发送GET请求
				var url = "http://localhost:8088/overpass/service-bridge/interface/findByFlowId?flowId="+flowId
				uni.request({
					url: url, // 你的后端API地址
					method: 'GET',
					success: (res) => {
						console.log('GET请求成功：', res.data.data);
						// Object.assign(target, ...source objects); 此方法用于将一个或多个源对象复制到目标对象。
						// 因为它在源上使用“ get”，在目标上使用“ Set”，所以它会调用getter和setter。
						// 它返回目标对象，该对象具有从目标对象复制的属性和值。此方法不会抛出空值或未定义的源值。
						Object.assign(this.baseFormData.respExplainedFormat, res.data.data);
						this.sortInterface(this.baseFormData.respExplainedFormat)
					},
					fail: (err) => {
						console.error('GET请求失败：', err);
					},
					
				});
			},
			deleteOne(id){
				var last,next,eIndex
				var map = new Map()
				var list = this.baseFormData.respExplainedFormat
				list.forEach((item, index)=>{
					if(item.id == id) eIndex = index
					if(item.lastId == id) next = item
					if(item.nextId == id) last = item
				})
				if(next&&last){
					last.nextId = next.id
					next.lastId = last.id
				}else if(next){
					next.lastId = 0
				}else if(last){
					last.nextId = 0
				}
				
				list.splice(eIndex, 1)
				if(list.length<1){
					// 删除全部后，进行初始化
					list.push(this.initData)
					// list.push({
					// 	id: 0, 
					// 	name: '', 
					// 	desc: '', 
					// 	relation: '', 
					// 	fields: '', 
					// 	fieldsExplain: '',
					// 	nextId: 0,
					// 	lastId: 0
					// })
				}
				// 删除指定对象
				this.asyncDeleteInterface(id)
				// 更新余下数据（nextId、lastId 发生了变更）
				this.asyncSubmitInterface(this.baseFormData.respExplainedFormat)
			},
			
			moveUp(e, index){
				if(index==0){
					this.messageToggle('error', '已是最上层！')
					return
				}
				var last,next,last2
				var map = new Map()
				var list = this.baseFormData.respExplainedFormat
				list.forEach(item=>{
					map.set(item.id, item)
					if(e.lastId == item.id) last = item
					if(e.nextId == item.id) next = item
				})
				var lastId = 0,lastId2 = 0
				if(last){
					if(last.lastId > 0) last2 = map.get(last.lastId)
				}
				
				if(last){
					last.nextId = e.nextId
					last.lastId = e.id
					lastId = last.id
				}
				if(last2){
					last2.nextId = e.id
					lastId2 = last2.id
				}
				if(next){
					next.lastId = lastId
				}
				e.lastId = lastId2
				e.nextId = lastId
				// 移动到头部，关联关系清空。（防止误操作，暂不清空，放到后端业务逻辑中进行判断选取）
				// if(lastId2==0) e.relation = ''
				// 重排序
				this.sortInterface(this.baseFormData.respExplainedFormat)
				// 更新数据（nextId、lastId 发生了变更）
				this.asyncSubmitInterface(this.baseFormData.respExplainedFormat)
			},
			moveDown(e, index){
				var list = this.baseFormData.respExplainedFormat
				if(index==list.length-1){
					this.messageToggle('error', '已是最末层！')
					return
				}
				var last,next,next2
				var map = new Map()
				list.forEach(item=>{
					map.set(item.id, item)
					if(e.lastId == item.id) last = item
					if(e.nextId == item.id) next = item
				})
				var nextId2 = 0,lastId = 0,nextId = 0
				
				if(next){
					if(next.nextId>0) next2 = map.get(next.nextId)
				}
				
				nextId = e.nextId
				if(next){
					next.nextId = e.id
					next.lastId = e.lastId
				}
				if(next2){
					next2.lastId = e.id
					nextId2 = next2.id
				}
				if(last){
					last.nextId = nextId
					lastId = last.id
				}
				e.nextId = nextId2
				e.lastId = nextId
				
				// 重排序
				this.sortInterface(this.baseFormData.respExplainedFormat)
				// 更新数据（nextId、lastId 发生了变更）
				this.asyncSubmitInterface(this.baseFormData.respExplainedFormat)
			},
			
			addInterface(id, index) {
				let newId = Date.now()
				// 首次添加
				if((this.baseFormData.respExplainedFormat.length == 1) && (this.baseFormData.respExplainedFormat[0].id == 0)){
					console.log("添加首接口~~~~~~~~~")
					// 移除初始化对象
					this.baseFormData.respExplainedFormat.splice(0, 1);
					// 添加真实对象
					var interfaceMain = {
						id: newId, 
						flowId: this.initData.flowId, 
						name: '',
						fields: 'id='+newId+',nextId=0'+',lastId=0',
						fieldsExplain: '',
						nextId: 0,
						lastId: 0,
					}
					this.baseFormData.respExplainedFormat.push(interfaceMain);
					this.asyncSubmitInterface(this.baseFormData.respExplainedFormat)
					return;
				}
				
				console.log("添加 第"+(index+2)+"个 接口~~~~~~~~~")
				var nextId = 0;
				this.baseFormData.respExplainedFormat.forEach(e=>{
					if(e.lastId == id) {
						e.lastId = newId
						nextId = e.id
					}
					if(e.id == id) {
						e.nextId = newId
					}
				});
				var interfaceMain = {
					id: newId, 
					flowId: this.initData.flowId, 
					name: 'E1001'+'订单数据' + newId,
					fields: '',
					fieldsExplain: '',
					nextId: nextId,
					lastId: id,
				}
				this.baseFormData.respExplainedFormat.push(interfaceMain);
				
				// 重排序
				this.sortInterface(this.baseFormData.respExplainedFormat)
				// 更新整体数据（nextId、lastId 发生了变更）
				this.asyncSubmitInterface(this.baseFormData.respExplainedFormat)
				// this.$forceUpdate()
			},
			onCopy(id, index) {
				let newId = Date.now()
				console.log("复制 第"+(index+2)+"个 接口，id:"+id+"，新接口id:"+newId+"~~~~~~~~~")
				var nextId = 0, copy, item
				// 复制节点，作为原节点的下一节点
				this.baseFormData.respExplainedFormat.forEach(e=>{
					// 以‘复制节点’作为上一节点的节点，即是 下一节点
					if(e.lastId == id) {
						// 新节点作为 原下一节点 的 上一节点
						e.lastId = newId
						// 下一节点，下移作为新节点的 下一节点
						nextId = e.id
					}
					if(e.id == id) {
						e.nextId = newId
						item = e;
					}
				});
				copy = JSON.parse(JSON.stringify(item))
				// 信息重置
				copy.id = newId
				copy.name = copy.name + "-copy"
				copy.nextId = nextId
				copy.lastId = id
				
				this.baseFormData.respExplainedFormat.push(copy);
				
				// 重排序
				this.sortInterface(this.baseFormData.respExplainedFormat)
				this.asyncSubmitInterface(this.baseFormData.respExplainedFormat)
				// this.$forceUpdate()
			},
			
			async asyncSubmitInterface(interfaceList) {
				// event.preventDefault(); // 阻止表单默认提交行为
				console.log('提交的数据：', JSON.stringify(interfaceList));
				// 这里可以执行提交表单的逻辑，比如发送请求到服务器
				// 例如使用uni.request提交数据
				uni.request({
					url: 'http://localhost:8088/overpass/service-bridge/interface/add',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						"baseFormData": JSON.stringify(interfaceList)
					},
					success: (res) => {
						console.log('提交成功', res);
					},
					fail: (err) => {
						console.error('提交失败', err);
					}
				});
			},
			
			async asyncDeleteInterface(id) {
				// event.preventDefault(); // 阻止表单默认提交行为
				console.log('删除：id='+id+"；flowId="+this.initData.flowId);
				// 这里可以执行提交表单的逻辑，比如发送请求到服务器
				// 例如使用uni.request提交数据
				uni.request({
					url: 'http://localhost:8088/overpass/service-bridge/interface/deleteByIdAndFlowId?id='+id+'&flowId='+this.initData.flowId,
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
					success: (res) => {
						console.log('提交成功', res);
					},
					fail: (err) => {
						console.error('提交失败', err);
					}
				});
			},
			
			// 接口排序
			sortInterface(list){
				var oldList = list
				var map = new Map()
				var head = {}
				
				oldList.forEach(e=>{
					if(e.lastId == 0) head = e
					map.set(e.id, e)
				})
				
				var nextId = 0
				
				for(let i = 0;i<list.length;i++) {
					if(i == 0){
						var e = head
						nextId = head.nextId
						// e.relation = 'id='+e.id+',nextId='+e.nextId+',lastId='+e.lastId
						// e.name = 'E1001'+'订单数据' + e.id
						// e.fields = 'id='+e.id+',nextId='+e.nextId+',lastId='+e.lastId
						// e.fields = e.respExplainedStr
						list[i] = e
						continue
					}					
					var e = map.get(nextId)
					nextId = e.nextId
					// e.relation = 'id='+e.id+',nextId='+e.nextId+',lastId='+e.lastId
					// e.fields = 'id='+e.id+',nextId='+e.nextId+',lastId='+e.lastId
					// e.fields = e.respExplainedStr
					list[i] = e
				}
				console.log("排序结束~~~~~~~~~")
			},
			deleteInterface(e) {
				var list = this.baseFormData.respExplainedFormat
				if((list.length==1) && (list[0].id == 0)){
					this.messageToggle('warn', '已全删除！现存的为初始化占位数据。')
					return
				}
				this.alertDialog.optId = e.id
				this.alertDialogToggle('warn')
			},
			
			// 弹出输入框
			editRelation(id, relation, index) {
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
			// 确认框，点击了 删除
			alertDialogConfirmDelete() {
				this.deleteOne(this.alertDialog.optId)
			},
			messageToggle(type, msg) {
				this.toggleMessage.msgType = type
				this.toggleMessage.messageText = msg
				this.$refs.showMessage.open()
			},
			alertDialogToggle(type) {
				this.alertDialog.msgType = type
				this.$refs.alertDialog.open()
			},
			navigateToEditInterface(id, flowId){
				// 跳转至 接口设置页面
				let url = `/pages/API/forms/forms?id=${id}&flowId=${flowId}`;
				uni.navigateTo({
				    url: url
				});
			},
		}
	}
</script>

<style lang="scss">
	.buttonClass{
		justify-content: center; 
		align-items: center; 
		text-align: center; 
		display: flex;
		padding: 7px 0 7px 0;
	}

</style>
