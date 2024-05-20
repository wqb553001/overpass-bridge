<template>
	<view class="example">
		
		<view class="uni-container" style="z-index: 9;flex: 1;">
			<uni-section title="" type="line" style="z-index: 9;">
				<uni-forms ref="baseForm" :rules="rules" labelWidth="80px">
					<uni-forms-item label="流程名称" required>
						<uni-easyinput v-model="flowForm.name" placeholder="请输入流程名称" />
					</uni-forms-item>
					<uni-forms-item label="条件">
						<uni-easyinput v-model="flowForm.condition" placeholder="请输入条件" />
					</uni-forms-item>
					<uni-forms-item label="描述">
						<uni-easyinput v-model="flowForm.desc" placeholder="请输入描述" />
					</uni-forms-item>
				
					<uni-forms-item label="管理">
						<view class="button-group">
							<button type="primary" size="mini" @click="add">放弃</button>
							<button type="primary" size="mini" @click="addFlow(flowForm.id)">提交</button>
						</view>
					</uni-forms-item>
				</uni-forms>
			</uni-section>
		</view>
		
		<view class="uni-container" style="margin-top: 20px;">
			<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据" >
				<uni-tr>
					<uni-th align="center">序号</uni-th>
					<uni-th align="center">流程名称</uni-th>
					<uni-th align="center">固定参数</uni-th>
					<uni-th width="400" align="center">流程描述</uni-th>
					<uni-th align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in baseFormData.respExplainedFormat" :key="index+1">
					<uni-td align="left">{{ index+1 }}</uni-td>
					<uni-td>{{ item.name }}</uni-td>
					<uni-td align="left" >{{ item.condition }}</uni-td>
					<uni-td align="left" >{{ item.desc }}</uni-td>
					<uni-td> 
<!-- 						<button class="button" size="mini" type="primary" @tap="" style="margin-left: -1px; " >复制</button> 
						<button class="button" size="mini" type="primary" @tap="inputDialogToggle(item.id, item.relation, index)" style="margin-left: -1px; " >固定参数设置</button> 
						<button class="button" size="mini" type="primary" @tap="addDynamicTable($event, item.id, index)" style="margin-left: -1px; " >新增</button> -->
						
						
						<!-- <uni-icons type="plusempty" size="40" @click="addDynamicTable($event, item.id, index)" class="buttonClass" ></uni-icons> -->
						<view v-if="item.id>0">
							<uni-icons type="closeempty" size="40" @click="deleteFlowAlertDialogToggle(item)" class="buttonClass" ></uni-icons>
							<uni-icons type="redo" size="40" @click="onCopy(item.id, index)" class="buttonClass" ></uni-icons>
						</view>
						
						<view v-if="item.id>0">
							<uni-icons type="compose" size="40" @click="edit(item.id)" class="buttonClass" ></uni-icons>							
						</view>
						<view v-if="item.lastId>1">
							<uni-icons type="up" size="40" @click="moveUp(item, index)" class="buttonClass" ></uni-icons>
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
		<!-- 提示信息 弹窗 -->
		<uni-popup ref="message" type="message">
			<uni-popup-message :type="toggleMessage.msgType" :message="toggleMessage.messageText" :duration="4000"></uni-popup-message>
		</uni-popup>
		<!-- 确认窗 弹窗 -->
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog @confirm="alertDialogConfirm" @close="dialogClose" :type="alertDialog.msgType" :cancelText="alertDialog.cancelText" :confirmText="alertDialog.confirmText" :title="alertDialog.title" :content="alertDialog.content"></uni-popup-dialog>
		</uni-popup>
		<!-- 输入框 弹窗 -->
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
					respExplainedFormat: [
						// {id: 1001, name: 'E1001'+'订单流程', condition: 'status=1', desc: '流程详情'},
						],
					
				},
				flowForm: {
					id: 0,
					name: '',
					condition: '',
					desc: '',
					nextId: 0,
					lastId: 0,
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
					title: '危险操作',
					msgType: 'warn',	// success、error、warn、info
					cancelText: '不删了',
					confirmText: '删除',
					content: '删除流程配置，将连同流程内接口同步删除，且无法恢复！',
					optId: 0,
					value: ''
				},
			};
		},
		onLoad(){
			this.onLoadData()
		},
		methods: {
			onLoadData(){
				// 发送GET请求
				var url = "http://localhost:8088/overpass/service-bridge/flow/findAll?status=0"
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
			edit(id) {
				const edit = this.baseFormData.respExplainedFormat.find(e=>e.id == id)
				// 信息回填 输入框 需要编辑的
				this.flowForm.id 		= edit.id
				this.flowForm.name 		= edit.name
				this.flowForm.condition = edit.condition
				this.flowForm.desc 		= edit.desc
				
				// 整体页面滚动到顶部
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
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
				// 删除指定对象
				this.asyncDeleteFlow(id)
				// 更新余下数据（nextId、lastId 发生了变更）
				this.asyncSubmitFlow(this.baseFormData.respExplainedFormat)
			},
			
			moveUp(e, index){
				if(index==0){
					this.messageToggle('error', '已是最上层！')
					return
				}
				var last,next
				var map = new Map()
				var list = this.baseFormData.respExplainedFormat
				list.forEach(item=>{
					map.set(item.id, item)
					if(e.lastId == item.id) last = item
					if(e.nextId == item.id) next = item
				})
				
				if(last.lastId==0){
					// 上一节点是 头节点
					e.lastId = 0
				}else{
					var last2 = map.get(last.lastId)
					last2.nextId = e.id
					e.lastId = last2.id
				}
				if(e.nextId==0){
					// 当前节点是 尾节点
					last.nextId = 0
				}else{
					last.nextId = next.id	
				}
				last.lastId = e.id
				e.nextId = last.id
				
				// 重排序
				this.sortInterface(this.baseFormData.respExplainedFormat)
				// 更新数据（nextId、lastId 发生了变更）
				this.asyncSubmitFlow(this.baseFormData.respExplainedFormat)
			},
			moveDown(e, index){
				var list = this.baseFormData.respExplainedFormat
				if(index==list.length-1){
					this.messageToggle('error', '已是最末层！')
					return
				}
				var last,next
				var map = new Map()
				list.forEach(item=>{
					map.set(item.id, item)
					if(e.lastId == item.id) last = item
					if(e.nextId == item.id) next = item
				})
				if(next.nextId==0){
					// 下一节点是 尾节点
					e.nextId = 0
				}else{
					var next2 = map.get(next.nextId)
					next2.lastId = e.id
					e.nextId = next2.id
				}
				if(e.lastId==0){
					// 当前节点是 头节点
					next.lastId = 0
				}else{
					last.nextId = next.id
					next.lastId = last.id
				}
				next.nextId = e.id
				e.lastId = next.id
				
				// 重排序
				this.sortInterface(this.baseFormData.respExplainedFormat)
				// 更新数据（nextId、lastId 发生了变更）
				this.asyncSubmitFlow(this.baseFormData.respExplainedFormat)
			},
			
			addFlow(id) {
				if(this.flowForm.name == '') {
					this.messageToggle('warn', '流程名称不能为空~')
					return
				}
				const old = this.baseFormData.respExplainedFormat.find(e=>e.name == this.flowForm.name)
				if(old){
					this.messageToggle('error', '添加失败！流程名称重复。请增加适当的标志，便于区分~')
					return
				}
				
				if(id){
					// 提交 修改
					const edit = this.baseFormData.respExplainedFormat.find(e=>e.id == id)
					// 信息回填 输入框 需要编辑的
					edit.id			= this.flowForm.id 		
					edit.name		= this.flowForm.name 		
					edit.condition	= this.flowForm.condition 
					edit.desc		= this.flowForm.desc
					var flowMain = {
						id: this.flowForm.id, 
						name: this.flowForm.name,
						condition: this.flowForm.condition,
						desc: this.flowForm.desc,
						nextId: edit.nextId,
						lastId: edit.lastId,
					}
					this.asyncUpdateFlow(flowMain)
					return 
				}
				
				// 提交 新流程
				let newId = Date.now()
				// 首次添加
				if(this.baseFormData.respExplainedFormat.length<1) {
					console.log("添加 首个 流程~~~~~~~~~")
					// 添加真实对象
					var flowMain = {
						id: newId, 
						name: this.flowForm.name,
						condition: this.flowForm.condition,
						desc: this.flowForm.desc,
						nextId: 0,
						lastId: 0,
					}
					// this.clearInput()
					this.baseFormData.respExplainedFormat.push(flowMain);
					this.asyncSubmitFlow(this.baseFormData.respExplainedFormat)
					return
				}
				
				console.log("添加流程~~~~~~~~~")
				const head = this.baseFormData.respExplainedFormat.find(e=>e.lastId == 0)
				head.lastId = newId
				var flowMain = {
					id: newId, 
					name: this.flowForm.name,
					condition: this.flowForm.condition,
					desc: this.flowForm.desc,
					nextId: head.id,
					lastId: 0,
				}
				// this.clearInput()
				this.baseFormData.respExplainedFormat.push(flowMain);
				// 重排序
				this.sortInterface(this.baseFormData.respExplainedFormat)
				this.asyncSubmitFlow(this.baseFormData.respExplainedFormat)
				// this.$forceUpdate()
			},
			clearInput(){
				this.flowForm.id = 0
				this.flowForm.name = ''
				this.flowForm.condition = ''
				this.flowForm.desc = ''
			},
			
			onCopy(id, index) {
				// const _ = require("lodash");
				let newId = Date.now()
				console.log("复制 第"+(index+2)+"个 接口，id:"+id+"，新接口id:"+newId+"~~~~~~~~~")
				var nextId = 0, copy
				this.baseFormData.respExplainedFormat.forEach(e=>{
					if(e.lastId == id) {
						e.lastId = newId
						nextId = e.id
					}
					if(e.id == id) {
						e.nextId = newId
						// copy = e
						// copy = _.cloneDeep(e);
						copy = JSON.parse(JSON.stringify(e));
					}
				});
				
				// 信息重置
				copy.id = newId
				copy.nextId = nextId
				copy.lastId = id
				
				this.baseFormData.respExplainedFormat.push(copy);
				
				// 重排序
				this.sortInterface(this.baseFormData.respExplainedFormat)
				this.asyncSubmitFlow(this.baseFormData.respExplainedFormat)
				// this.$forceUpdate()
			},
			
			async asyncSubmitFlow(flowList) {
				// event.preventDefault(); // 阻止表单默认提交行为
				console.log('提交的数据：', JSON.stringify(flowList));
				// 这里可以执行提交表单的逻辑，比如发送请求到服务器
				// 例如使用uni.request提交数据
				uni.request({
					url: 'http://localhost:8088/overpass/service-bridge/flow/add',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						"baseFormData": JSON.stringify(flowList)
					},
					success: (res) => {
						console.log('提交成功', res);
					},
					fail: (err) => {
						console.error('提交失败', err);
					}
				});
			},
			
			async asyncUpdateFlow(flow) {
				// event.preventDefault(); // 阻止表单默认提交行为
				console.log('提交的数据：', JSON.stringify(flow));
				// 这里可以执行提交表单的逻辑，比如发送请求到服务器
				// 例如使用uni.request提交数据
				uni.request({
					url: 'http://localhost:8088/overpass/service-bridge/flow/update',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					data: {
						"baseFormData": JSON.stringify(flow)
					},
					success: (res) => {
						console.log('提交成功', res);
					},
					fail: (err) => {
						console.error('提交失败', err);
					}
				});
			},
			
			async asyncDeleteFlow(id) {
				// event.preventDefault(); // 阻止表单默认提交行为
				console.log('删除：', id);
				// 这里可以执行提交表单的逻辑，比如发送请求到服务器
				// 例如使用uni.request提交数据
				uni.request({
					url: 'http://localhost:8088/overpass/service-bridge/flow/deleteById?flowId='+id,
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
						e.name = 'F1001'+'流程数据' + e.id
						e.condition = 'id='+e.id+',nextId='+e.nextId+',lastId='+e.lastId+e.condition
						list[i] = e
						continue
					}					
					var e = map.get(nextId)
					nextId = e.nextId
					// e.relation = 'id='+e.id+',nextId='+e.nextId+',lastId='+e.lastId
					e.name = 'F1001'+'流程数据' + e.id
					e.condition = 'id='+e.id+',nextId='+e.nextId+',lastId='+e.lastId + e.condition
					list[i] = e
				}
				console.log("排序结束~~~~~~~~~")
			},
			
			addDynamicTable(e, id, index) {
				// 添加字段输入框
				this.baseFormData.respExplainedFormat.push({id: Date.now(), name: 'F1001'+'订单流程' + id, desc: '流程详情', condition: 'sourceTypes=[1,3,5]'});
				// this.$forceUpdate()
			},
			// 弹出输入框
			inputDialogToggle(id, relation, index) {
				// console.log("点击修改 ", index)
				// if(index == 0) {
				// 	this.messageToggle('error', '无需设置。\n关联是指当前接口与上一个接口的关联关系。第一个接口，不存在上一个接口。')
				// 	return;
				// }
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
			// 弹 信息提示框
			messageToggle(type, msg) {
				this.toggleMessage.msgType = type
				this.toggleMessage.messageText = msg
				this.$refs.message.open()
			},
			// 弹窗，确认是否删除
			deleteFlowAlertDialogToggle(e) {
				this.alertDialog.optId = e.id
				this.alertDialog.msgType = 'error'
				this.$refs.alertDialog.open()
			},
			// 确认框，点击了 删除
			alertDialogConfirm() {
				this.deleteOne(this.alertDialog.optId)
			},
		}
	}
</script>

<style lang="scss">
	.example {
		padding: 15px;
		background-color: #fff;
	}
	.button-group {
		margin-top: 15px;
		display: flex;
		justify-content: space-around;
	}
	
	.buttonClass{
		justify-content: center; 
		align-items: center; 
		text-align: center; 
		display: flex;
		padding: 7px 0 7px 0;
	}
	
</style>
