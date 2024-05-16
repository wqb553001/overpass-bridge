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
					<uni-td align="left" >{{ item.fields }}</uni-td>
					<uni-td>
						<!-- <button class="button" size="mini" type="primary" @tap="" style="margin-left: -1px; " >复制</button>
						<view v-if="index>0">
							<button class="button" size="mini" type="primary" @tap="inputDialogToggle(item.id, item.relation, index)" style="margin-left: -1px; " >关联设置</button>
						</view>
						<button class="button" size="mini" type="primary" @tap="removeUp($event, item.id, index)" style="margin-left: -1px; " >上移</button>
						<button class="button" size="mini" type="primary" @tap="addDynamicTable($event, item.id, index)" style="margin-left: -1px; " >新增</button>
						<button class="button" size="mini" type="primary" @tap="removeDown($event, item.id, index)" style="margin-left: -1px; " >下移</button> -->
						<view v-if="item.id>0">
							<uni-icons type="closeempty" size="40" @click="alertDialogToggle(item, index)" class="buttonClass" ></uni-icons>
						</view>
						<uni-icons type="redo" size="40" @click="onCopy($event, item.id, index)" class="buttonClass" ></uni-icons>
						<view v-if="index>0">
							<uni-icons type="compose" size="40" @click="inputDialogToggle(item.id, item.relation, index)" class="buttonClass" ></uni-icons>							
						</view>
						<uni-icons type="up" size="40" @click="moveUp(item, index)" class="buttonClass" ></uni-icons>
						<uni-icons type="plusempty" size="40" @click="addDynamicTable($event, item.id, index)" class="buttonClass" ></uni-icons>						
						<uni-icons type="down" size="40" @click="moveDown(item, index)" class="buttonClass" ></uni-icons>
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
			<uni-popup-dialog @confirm="alertDialogConfirm" @close="dialogClose" :type="alertDialog.msgType" :cancelText="alertDialog.cancelText" :confirmText="alertDialog.confirmText" :title="alertDialog.title" :content="alertDialog.content"></uni-popup-dialog>
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
					respExplainedFormat: [{
						id: 0, 
						name: '', 
						desc: '', 
						relation: '', 
						fields: '', 
						fieldsExplain: '',
						nextId: 0,
						lastId: 0,
						headId: 0
					}]
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
					optId: '',
					value: ''
				},
			};
		},
		methods: {
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
					list.push({
						id: 0, 
						name: '', 
						desc: '', 
						relation: '', 
						fields: '', 
						fieldsExplain: '',
						nextId: 0,
						lastId: 0,
						headId: 0
					})
				}
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
			},
			
			addDynamicTable(e, id, index) {
				let newId = Date.now()
				// 首次添加
				if((this.baseFormData.respExplainedFormat.length == 1) && (this.baseFormData.respExplainedFormat[0].id == 0)){
					console.log("添加首接口~~~~~~~~~")
					// 移除初始化对象
					this.baseFormData.respExplainedFormat.splice(0, 1);
					// 添加真实对象
					this.baseFormData.respExplainedFormat.push({
						id: newId, 
						name: 'E1001'+'订单数据' + newId,
						fields: 'id='+newId+',nextId=0'+',lastId=0',
						fieldsExplain: '',
						nextId: 0,
						lastId: 0,
					});
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
				
				this.baseFormData.respExplainedFormat.push({
					id: newId, 
					name: 'E1001'+'订单数据' + newId,
					fields: 'id=userId',
					fieldsExplain: '',
					nextId: nextId,
					lastId: id,
				});
				
				// 重排序
				this.sortInterface(this.baseFormData.respExplainedFormat)
				// this.$forceUpdate()
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
						e.relation = 'id='+e.id+',nextId='+e.nextId+',lastId='+e.lastId
						e.fields = 'id='+e.id+',nextId='+e.nextId+',lastId='+e.lastId
						list[i] = e
						continue
					}
					var e = map.get(nextId)
					nextId = e.nextId
					e.relation = 'id='+e.id+',nextId='+e.nextId+',lastId='+e.lastId
					e.fields = 'id='+e.id+',nextId='+e.nextId+',lastId='+e.lastId
					list[i] = e
				}
				console.log("排序结束~~~~~~~~~")
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
			// 确认框，点击了 删除
			alertDialogConfirm() {
				this.deleteOne(this.alertDialog.optId)
			},
			messageToggle(type, msg) {
				this.toggleMessage.msgType = type
				this.toggleMessage.messageText = msg
				this.$refs.showMessage.open()
			},
			alertDialogToggle(e, type) {
				var list = this.baseFormData.respExplainedFormat
				if((list.length==1) && (list[0].id == 0)){
					this.messageToggle('warn', '已全删除！现存的为初始化占位数据。')
					return
				}
				this.alertDialog.msgType = type
				this.alertDialog.optId = e.id
				this.$refs.alertDialog.open()
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
