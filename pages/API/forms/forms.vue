<template>
	<view class="container" style="z-index: 9;">
		<uni-card :is-shadow="false" is-full>
			<text class="uni-h6">uni-forms 组件一般由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据。</text>
		</uni-card>
		<uni-section title="接口" type="line" style="z-index: 9;">
			<view class="example">
				<!-- 基础用法，不包含校验规则 -->
				<uni-forms ref="baseForm" :model="baseFormData" labelWidth="80px">
					<view v-if="baseFormData.lastId>0">
						<uni-forms-item label="关联关系" required>
							<uni-easyinput v-model="baseFormData.relation" placeholder="请输入与上一接口的关联关系" />
						</uni-forms-item>
					</view>
					
					<uni-forms-item label="接口名称" required>
						<uni-easyinput v-model="baseFormData.name" placeholder="请输入接口名称" />
					</uni-forms-item>
					<uni-forms-item label="URL" required>
						<uni-easyinput v-model="baseFormData.url" @blur="checkUrl" placeholder="请输入URL" />
					</uni-forms-item>
					<uni-forms-item label="请求方式" required>
						<uni-data-checkbox style="padding-top: 6px;" v-model="baseFormData.method"
							:localdata="reqMethod" />
					</uni-forms-item>

					<uni-forms-item label="传递参数">

						<uni-collapse>
							<uni-forms-item label="headers" labelWidth="68px">
								<uni-easyinput v-model="baseFormData.headers"
									placeholder="请输入header 如 token=abcdef;Content-Type=application/json " />
							</uni-forms-item>
							<uni-forms-item label="固定传参" labelWidth="68px">
								<uni-easyinput v-model="baseFormData.params"
									placeholder="请输入固定参数 如 orderStatus = 1;flow = 1 " />
							</uni-forms-item>

							<uni-forms :rules="dynamicRules" :model="dynamicFormData" labelWidth="68px">

								<uni-forms-item v-for="(item,index) in baseFormData.dynamicTable.timeField.array"
									:key="item.id" :label="item.label" :rules="item.rules"
									:name="['timeFields',index,'value']">
									<view class="form-item">
										<uni-easyinput v-model="baseFormData.dynamicTable.timeField.array[index].field"
											placeholder="请输入时间字段" />
										<uni-data-picker v-model="baseFormData.dynamicTable.timeField.array[index].opt"
											:localdata="opts" popup-title="选取连接方式"
											:ellipsis="false" style="width: 80px; flex: none;"></uni-data-picker>
										<uni-data-picker v-model="baseFormData.dynamicTable.timeField.array[index].time"
											:localdata="paramTimeList" @change="paramTimeListChange($event, index)"
											popup-title="选取时间点" :ellipsis="false"></uni-data-picker>
										<uni-number-box :min="1" :max="1000"
											v-model="baseFormData.dynamicTable.timeField.array[index].second"
											style="float: left;" :color="numberBoxProps.paramTimes[index].color"
											:disabled="numberBoxProps.paramTimes[index].disabled" width="60" />
										<button class="button" size="mini" type="default"
											@click="delDynamicTableTimeFields(item.id)">删除</button>
									</view>
								</uni-forms-item>
							</uni-forms>
							<view class="button-group">
								<button type="primary" size="default" @click="addDynamicTableTimeField">新增时间</button>
								<!-- <button type="primary" size="mini" @click="submit('dynamicForm')">提交</button> -->
							</view>
						</uni-collapse>
					</uni-forms-item>

					<uni-forms-item label="数据结构" required>
						<uni-section title="返回值结构" type="line">
							<view class="example-body">
								<button type="primary" @click="showDrawer('showRight')"><text class="word-btn-white">录入
										数据结构</text> </button>
								<!--:mask-click="true" 点击其他区域，自动收起。默认值：true-->
								<uni-drawer ref="showRight" mode="right" :width="360" :mask-click="true"
									@change="change($event,'showRight')">
									<view class="scroll-view">
										<scroll-view class="scroll-view-box" scroll-y="true">
											<view class="info">
												<text
													class="info-text">&nbsp;&nbsp;&nbsp;&nbsp;返回值结构中，不用的字段，既增加了处理的负担，又耗费了系统资源，请尽包括需要的字段，其余字段请移除！</text>
											</view>
											<view class="close">
												<button @click="closeDrawer('showRight')">
													<text class="word-btn-white">关闭Drawer</text>
												</button>
											</view>

											<view class="button-group">
												<button class="word-btn-white" size="mini" @click="jsonDataVolid()">JSON 格式核查</button>
												<!-- <button class="word-btn-white" size="mini" @click="checkUrl()">提交</button> -->
											</view>

											<view class="uni-textarea">
												<textarea v-model="baseFormData.introduction"
													placeholder-style="color:#F76260" placeholder="接口返回的数据结构"
													maxlength="5000" />
											</view>

											<view class="button-group close">
												<button class="word-btn-white" size="mini" @click="jsonDataVolid()">JSON 格式核查</button>
												<!-- <button class="word-btn-white" size="mini" @click="add">新增域名</button>
												<button class="word-btn-white" size="mini" @click="submit('dynamicForm')">提交</button> -->
											</view>

											<view class="close">
												<button @click="closeDrawer('showRight')">
													<text class="word-btn-white">关闭Drawer</text>
												</button>
											</view>
										</scroll-view>
									</view>
								</uni-drawer>
							</view>
						</uni-section>
						<uni-section title="展示" type="line">
							<uni-easyinput type="textarea" v-model="baseFormData.respConstructor" disabled="false"
								maxlength="5000" />
						</uni-section>
						<uni-section title="解析结构" type="line">
							<uni-easyinput auto-height="true" type="textarea" v-html="baseFormData.respExplainedStr" disabled="false" maxlength="5000" />
							<view class="uni-container" style="margin-top: 20px;">
								<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据">
									<uni-tr>
										<uni-th width="4" align="center">序号</uni-th>
										<uni-th width="40" align="center">层级</uni-th>
										<uni-th align="center">字段</uni-th>
										<uni-th width="4" align="center">重命名</uni-th>
									</uni-tr>
									<uni-tr v-for="(entry, index) in baseFormData.respExplainedFormat" :key="index+1">
										<uni-td align="left">{{ index+1 }}</uni-td>
										<uni-td>
											<view class="name">{{ entry[0] }}</view>
										</uni-td>
										<uni-td align="left">
											<uni-easyinput auto-height="true" type="textarea"
												v-html="entry[1][0]" disabled="false" maxlength="5000" />
										</uni-td>
										<uni-td> 
											<button class="button" size="mini" type="primary"
												@tap="inputDialogToggle(entry[0], entry[1][1])"
												style="margin-left: -1px; ">修改</button> 
										</uni-td>
									</uni-tr>
								</uni-table>
							</view>	
						</uni-section>

						
					</uni-forms-item>

					<uni-forms-item label="取值范围" required>
						<view>
							<uni-data-checkbox v-model="baseFormData.limit" @change="dataLimitChange"
								:localdata="dataLength" style="float: left;" />
							<uni-number-box :min="0" :max="100000000" v-model="baseFormData.limitNum"
								style="float: left;" :color="numberBoxProps.limit.color"
								:disabled="numberBoxProps.limit.disabled" width="120" />
						</view>
						<view>
							<uni-collapse>
								<uni-collapse-item title-border="auto"
									title="———————————————————————————展开设置分页条件——————————————————————————— "
									style="background-color: antiquewhite;" :disabled="pageCondition.disabled"
									:open="pageCondition.open" :show-animation="false">
									<view class="content">
										<uni-card :is-shadow="false" is-full>
											<text class="uni-h6">【分页条件,字段配置】:涉及表达式时,注 不等于使用 != 而不可使用 ≠ 或 &lt;&gt;
											</text>
										</uni-card>
										<uni-card :is-shadow="false" is-full>
											<text class="uni-h6">表达式配置示例为: newField:#fieldA + fieldB|fieldA&fieldB
											</text>
										</uni-card>
										<uni-card :is-shadow="false" is-full>
											<text class="uni-h6">表达式配置样例为: #nextPage==0|nextPage 或
												#pages==pageNum|pages&pageNum</text>
										</uni-card>
										<uni-forms-item label="正常判断" required style="margin-top: 15px;">
											<uni-easyinput v-model="baseFormData.statusField"
												placeholder="请输入判断正常条件 如 isSuccess = true 或 #status == 0|status" />
										</uni-forms-item>
										<uni-forms-item label="结果集" required>
											<uni-data-picker v-model="baseFormData.dataContentField"
												:localdata="dataContentFields"
												popup-title="选取结果集字段" :ellipsis="false"></uni-data-picker>
										</uni-forms-item>
										<uni-forms-item label="下一页" required>
											<uni-data-picker v-model="baseFormData.nextPageStrategy"
												:localdata="nextPageStrategy" @change="nextPageStrategyChange"
												popup-title="选择" :ellipsis="false"
												style="float: left; width: 50%; "></uni-data-picker>
											<!-- <uni-number-box :min="0" :max="100000000" :value="baseFormData.retryStrategyTimes" style="float: left; " :color="numberBoxProps.retryStrategy.color" :disabled="numberBoxProps.retryStrategy.disabled"  width="120" /> -->

											<uni-easyinput v-model="baseFormData.nextPageField"
												style="float: left; width: 50%; display:flow"
												:placeholder="placeholder.nextPageField" />
										</uni-forms-item>
										<uni-forms-item label="每页取数" required>
											<uni-easyinput v-model="baseFormData.pageNumField"
												placeholder="请输入每页取数条件 如 pageNum = 200" />
										</uni-forms-item>
										<uni-forms-item label="结束分页" required>
											<uni-easyinput v-model="baseFormData.isLastPageField"
												placeholder="请输入结束分页条件 如 isLastPage = true 或 #nextPage==0|nextPage" />
										</uni-forms-item>
									</view>
								</uni-collapse-item>
							</uni-collapse>
						</view>
					</uni-forms-item>

					<uni-forms-item label="过滤数据">
						<uni-easyinput v-model="baseFormData.filterCondition"
							placeholder="请输入过滤条件 如 orderChecked = 1" />
					</uni-forms-item>

					<uni-forms-item label="分组聚合">
						<view>
							<view class="form-item">
								<view style="font-size: 14px; color: #666; padding: 0 5px 0 0px;">分组字段</view>
								<zxz-uni-data-select v-model="baseFormData.groupField" filterable multiple
									dataKey="label" dataValue="value" :localdata="simpleFields"
									@change="change"></zxz-uni-data-select>
								<view style="font-size: 14px; color: #666; padding: 0 5px 0 15px;">聚合</view>
								<uni-data-picker v-model="baseFormData.dynamicTable.groupMergeField.one.opt"
									:localdata="mergeStyles" @change="mergeStyleChange" popup-title="选取聚合方式"
									:ellipsis="false" style="width: 120px; flex: none;"></uni-data-picker>
								<uni-easyinput v-model="baseFormData.dynamicTable.groupMergeField.one.mergeField"
									placeholder="请输入聚合字段表达式" />
							</view>
							<view v-for="(item,index) in baseFormData.dynamicTable.groupMergeField.array" :key="item.id"
								:label="item.label" :rules="item.rules" :name="['groupMergeFields',index,'value']"
								style="margin-top: 22px;">
								<view class="form-item">
									<view style="font-size: 14px; color: #666; padding: 0 5px 0 0px;">分组字段</view>
									<zxz-uni-data-select
										v-model="baseFormData.dynamicTable.groupMergeField.array[index].groupField"
										filterable multiple dataKey="label" dataValue="value" :localdata="simpleFields"
										@change="change"></zxz-uni-data-select>
									<view style="font-size: 14px; color: #666; padding: 0 5px 0 15px;">聚合</view>
									<uni-data-picker
										v-model="baseFormData.dynamicTable.groupMergeField.array[index].opt"
										:localdata="mergeStyles" @change="mergeStyleChange($event, index)"
										popup-title="选取聚合方式" :ellipsis="false"
										style="width: 120px; flex: none;"></uni-data-picker>
									<uni-easyinput
										v-model="baseFormData.dynamicTable.groupMergeField.array[index].mergeField"
										placeholder="请输入聚合字段表达式" />
									<button class="button" size="mini" type="default"
										@click="delDynamicTableGroupMergeFields(item.id)">删除</button>
								</view>
							</view>
							<view class="button-group">
								<button type="primary" size="default"
									@click="addDynamicTableGroupMergeField">新增分组聚合</button>
							</view>
						</view>
					</uni-forms-item>

					<uni-forms-item label="调度示例">
						<uni-data-picker v-model="baseFormData.executeTimeExample" :localdata="executeTime" @change="executeTimeChange"
							popup-title="查看执行时机示例" :ellipsis="false"></uni-data-picker>
					</uni-forms-item>

					<uni-forms-item label="执行时机" required>
						<view class="uni-list" style="width: 340px; ">
							<view class="uni-list-cell">
								<view class="uni-list-cell-left">
									依需修改
								</view>
								<view class="uni-list-cell-db">
									<uni-easyinput v-model="baseFormData.executeTimeCron" @blur="cronCheck"
										placeholder="请确认 执行时机 cron 表达式" />
								</view>
							</view>
						</view>
					</uni-forms-item>

					<!-- <uni-forms-item label="重试策略" class="retryStrategy">
						<uni-data-picker v-model="baseFormData.retryStrategy" :localdata="retryStrategy" @change="retryStrategyChange" popup-title="选择" :ellipsis="false" style="float: left; width: 340px; margin-right: 20px;"></uni-data-picker>
						<uni-number-box :min="0" :max="100000000" :value="baseFormData.retryStrategyTimes" style="float: left; " :color="numberBoxProps.retryStrategy.color" :disabled="numberBoxProps.retryStrategy.disabled"  width="120" />
					</uni-forms-item> -->

					<uni-forms-item label="管理" v-if="baseFormData.id>0">

						<view class="button-group">
							<button type="primary" size="mini" @click="add">放弃</button>
							<button type="primary" size="mini" @click="submit('baseForm')">提交</button>
						</view>
					</uni-forms-item>

				</uni-forms>
			</view>
		</uni-section>
	</view>


	<view>
		<!-- 提示信息弹窗 -->
		<uni-popup ref="message" type="message">
			<uni-popup-message :type="toggleMessage.msgType" :message="toggleMessage.messageText"
				:duration="2000"></uni-popup-message>
		</uni-popup>
		<!-- 输入框示例 -->
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" :title="rename.title" :value="rename.value"
				:placeholder="rename.placeholder" @confirm="dialogInputConfirm">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import * as util from '../../../common/util.js'
	// import {dataLength,mergeStyles,paramTimeList,opts} from '../../../common_data/interface_data.js'
	import * as base from '../../../common_data/interface_data.js'
	// import {dataLength,mergeStyles,paramTimeList,opts,retryStrategy,executeTime,nextPageStrategy,reqMethod} from '../../../common_data/interface_data.js'
	// import {onLoadData} from './interface.js'

	export default {
		created() {
			this.dataLength = base.dataLength
			this.mergeStyles = base.mergeStyles
			this.paramTimeList = base.paramTimeList
			this.opts = base.opts
			
			this.retryStrategy = base.retryStrategy
			this.executeTime = base.executeTime
			this.nextPageStrategy = base.nextPageStrategy
			this.reqMethod = base.reqMethod
			
			// this.dataLength = dataLength
			// this.mergeStyles = mergeStyles
			// this.paramTimeList = paramTimeList
			// this.opts = opts
			
			// this.retryStrategy = retryStrategy
			// this.executeTime = executeTime
			// this.nextPageStrategy = nextPageStrategy
			// this.reqMethod = reqMethod
			
		},
		data() {
			return {
				// 提示信息弹窗 
				// 基础表单数据
				baseFormData: {
					id: 0,
					lastId: 0,
					nextId: 0,
					name: '',
					url: '',
					method: 'POST',
					limit: 0,
					limitNum: 0,
					nextPageField: '',
					pageNumField: '',
					isLastPageField: '',
					statusField: '',
					filterCondition: '',
					dataContentField: '',
					
					introduction: '',
					respConstructor: '',
					respExplainedStr: '',
					respExplainedJsonStr: '',
					respExplainedFormat: {},
					
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
								field: '',
								second:0
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
					},
					paramTime:{time:0},
					paramTimes:[]
				}, 
				simpleFields: [],
				// 输入框-提示信息
				placeholder: {
					nextPageField: '请输入下一页取值条件 如 page:#page + 1|page'
				},
				pageCondition: {
					disabled: false,
					open: true
				},
				fieldCheck: {
					respExplainedMap: new Map(),
					repeatFieldMap: new Map(),
					allFieldMap: new Map()
				},
				// 重命名字段弹出框
				rename: {
					title: '格式示例 id=uId,name=uName',
					placeholder: '请输入内容',
					key: '',
					value: ''
				},
				// 执行时机-示例-默认选项
				excuteTimeExample: 70,
				multiIndex: [0, 0, 1],
				numberBoxProps: {
					paramTime: {
						color: "#fff",
						disabled: true,
					},
					paramTimes: [
						// {color: "#fff",disabled: true},
					],
					limit: {
						color: "#fff",
						disabled: true,
					},
					retryStrategy: {
						color: "#fff",
						disabled: true,
					},
				},
				dataVolid: {
					respJsonFormat: false,
					urlFormat: false,
				},
				localObj: {
					introduction: '',
					respConstructor: '',
					respExplainedStr: '',
					respExplainedFormat: {}
				},
				// 提示信息弹窗 -begin --<<--
				toggleMessage: {
					type: 'center',
					msgType: 'success',
					messageText: '这是一条成功提示',
					value: ''
				},
				dataContentFields: [],
				// 预先提醒-重试暂停
				
				// 表单数据
				alignmentFormData: {
					name: '',
					age: '',
				},
				
				// 分段器数据
				current: 0,
				items: ['左对齐', '顶部对齐'],
				// 校验表单数据
				valiFormData: {
					name: '',
					age: '',
					introduction: '',
				},
				// 校验规则
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '接口名称不能为空'
						}]
					},
					url: {
						rules: [{
							required: true,
							errorMessage: 'Url 不能为空'
						}]
					}
				},
				// 自定义表单数据
				customFormData: {
					name: '',
					url: '',
					method: 'POST',
					limit: '0',
					hobby: []
				},
				// 自定义表单校验规则
				customRules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '接口名称不能为空'
						}]
					},
					url: {
						rules: [{
							required: true,
							errorMessage: 'Url 不能为空'
						}]
					}

				},
				dynamicFormData: {
					email: '',
					domains: []
				},
				dynamicLists: [],
				dynamicRules: {
					email: {
						rules: [{
							required: true,
							errorMessage: '域名不能为空'
						}, {
							format: 'email',
							errorMessage: '域名格式错误'
						}]
					}
				}
			}
		},
		computed: {
			// 处理表单排列切换
			alignment() {
				if (this.current === 0) return 'left'
				if (this.current === 1) return 'top'
				return 'left'
			}
		},
		onLoad(options) {
			console.log("传递了参数：" + options.id)
			if(options.id) this.onLoadData(options.id)
			// this.getData(1)
		},
		onReady() {},
		methods: {
			onLoadData(id){
				// 发送GET请求
				var url = "http://localhost:8088/overpass/service-bridge/interface/findById?interfaceId="+id
				uni.request({
					url: url, // 你的后端API地址
					method: 'GET',
					async: false, // 设置为同步请求
					success: (res) => {
						console.log('GET请求成功：', res.data.data);
						// Object.assign(target, ...source objects); 此方法用于将一个或多个源对象复制到目标对象。
						// 因为它在源上使用“ get”，在目标上使用“ Set”，所以它会调用getter和setter。
						// 它返回目标对象，该对象具有从目标对象复制的属性和值。此方法不会抛出空值或未定义的源值。
						Object.assign(this.baseFormData, res.data.data);
						// 数据加载后，回显
						this.onloadDataAfterReshow()						
					},
					fail: (err) => {
						console.error('GET请求失败：', err);
					}
				});
			},
			// 加载后数据回显
			onloadDataAfterReshow(){
				// 取指定数量 的显示隐藏 设置
				this.pageConditionShowHidden(this.baseFormData.limit)
				
				// 回显json数据解析表格
				const respExplainedMap = this.styleStrToMap(this.baseFormData.respExplainedStr)
				this.baseFormData.respExplainedFormat = this.mapValueRed(respExplainedMap)
				
				// 回显时间字段表格
				var timeFieldArray = this.baseFormData.dynamicTable.timeField.array
				if(timeFieldArray.length>0){
					timeFieldArray.forEach((item, index)=>{
						// 添加数字输入框，默认值，占位
						this.numberBoxProps.paramTimes.push({
							color: "#fff",
							disabled: true
						})
						// 依据实际数据，重新赋值
						this.paramTimeStyleChange(item.time, index)
					})
				}
				// 回显 取值范围
				this.dataLimitStyleChange(this.baseFormData.limit)
			},
			switchChange() {
				console.log("单选调整……")
			},
			inputDialogToggle(key, val) {
				// console.log("点击修改 ", val)
				this.rename.key = key
				this.rename.value = val
				this.$refs.inputDialog.open()
			},
			dialogClose() {
				console.log('点击关闭')
			},
			dialogInputConfirm(val) {
				// uni.hideLoading()
				// 关闭窗口后，恢复默认内容
				this.$refs.inputDialog.close()
				console.log("修后的val:", val)
				var arr = val.split(",")
				let str = '';
				var after,before
				for (let e of arr) {
					if(e.includes("=")){
						before=e.substring(0, e.indexOf("="))
						after=e.substring(e.indexOf("=")+1)
						this.judgeRepeatChangeFields(after, before)
					}
				}
				
				this.baseFormData.respExplainedFormat.set(this.rename.key, [this.signColorForFieldToRed(val), val])
				this.fieldCheck.respExplainedMap.set(this.rename.key, val)
				this.renameAfter()
			},
			
			renameAfter(){
				const respExplainedMap = this.fieldCheck.respExplainedMap
				this.baseFormData.respExplainedStr = this.mapToStyleStr(respExplainedMap)
				this.baseFormData.respExplainedFormat = this.mapValueRed(this.mapReverse(respExplainedMap))
			},
			
			judgeRepeatChangeFields(newField, oldField){
				// 字段集
				if(this.fieldCheck.allFieldMap.has(newField)) {
					// 重命名后的字段，与现有字段名重复
					this.fieldCheck.allFieldMap.set(newField, this.fieldCheck.allFieldMap.get(newField) + 1)
					// 检查是否在‘重复集’中
					if (this.fieldCheck.repeatFieldMap.has(newField)) {
						this.fieldCheck.repeatFieldMap.set(newField, this.fieldCheck.repeatFieldMap.get(newField) + 1)
					}else{
						this.fieldCheck.repeatFieldMap.set(newField, 1)
					}
				}else{
					// 重命名后的字段，不重复于现有字段名
					this.fieldCheck.allFieldMap.set(newField, 1)
					
					if(this.fieldCheck.allFieldMap.has(oldField)){
						if(this.fieldCheck.allFieldMap.get(oldField)==1){
							// 之前标记有一处重复，重命名后，删除标记
							this.fieldCheck.allFieldMap.delete(oldField)
						}else{
							// 之前标记有多处重复，重命名后，标记 重复数-1
							this.fieldCheck.allFieldMap.set(oldField, this.fieldCheck.allFieldMap.get(oldField) - 1)
						}
					}
				}
				
				// 重复集(存在于 ‘重复集’中，必定存在于‘字段集’中；换句话说，不存在于‘字段集’中，更不可能存在于‘重复集’中)
				if(this.fieldCheck.repeatFieldMap.has(oldField)){
					if(this.fieldCheck.repeatFieldMap.get(oldField)==1){
						// 之前标记有一处重复，重命名后，删除标记
						this.fieldCheck.repeatFieldMap.delete(oldField)
					}else{
						// 之前标记有多处重复，重命名后，标记 重复数-1
						this.fieldCheck.repeatFieldMap.set(oldField, this.fieldCheck.repeatFieldMap.get(oldField) - 1)
					}
				}
				
			},
			update(item) {
				this.show = true
				this.item = item //拿到要更新数据的行
				this.showUI = false
			},
			editItem(index) {
				// 编辑逻辑，例如弹出对话框让用户输入新数据
				const item = this.table.tableData[index];
				// 弹窗操作，用户输入新数据后更新item
				this.$set(this.table.tableData, index, item); // 更新数组并触发视图更新
			},
			
			addDynamicTableTimeField() {
				// 添加字段输入框
				this.baseFormData.dynamicTable.timeField.array.push({
					label: '时间字段',
					value: '',
					opt: 0,
					time: 0,
					field: '',
					second: 0,
					rules: [{
						'required': true,
						errorMessage: '域名项必填'
					}],
					id: Date.now()
				});
				// 添加数字输入框
				this.numberBoxProps.paramTimes.push({
					color: "#fff",
					disabled: true
				})
			},
			addDynamicTableGroupMergeField() {
				// 添加字段输入框
				this.baseFormData.dynamicTable.groupMergeField.array.push({
					label: '分组字段',
					value: '',
					opt: 0,
					time: 0,
					groupField: '',
					mergeField: '',
					id: Date.now()
				});
			},
			delDynamicTableTimeFields(id) {
				let index = this.baseFormData.dynamicTable.timeField.array.findIndex(v => v.id === id)
				this.baseFormData.dynamicTable.timeField.array.splice(index, 1)
			},
			delDynamicTableGroupMergeFields(id) {
				let index = this.baseFormData.dynamicTable.groupMergeField.array.findIndex(v => v.id === id)
				this.baseFormData.dynamicTable.groupMergeField.array.splice(index, 1)
			},
			confirm() {},
			// 打开窗口
			showDrawer(e) {
				this.$refs[e].open()
			},
			// 关闭窗口
			closeDrawer(e) {
				this.jsonDataVolid();
				this.$refs[e].close()
			},
			// 抽屉状态发生变化触发
			change(e, type) {
				console.log((type === 'showLeft' ? '左窗口' : '右窗口') + (e ? '打开' : '关闭'));
				this[type] = e
				if (!e) {
					this.jsonDataVolid();
				}
			},
			// 取值的时间限制范围
			paramTimeListChange(e, index) {
				const selectVal = e.detail.value[0].value
				this.paramTimeStyleChange(selectVal, index)
			},
			paramTimeStyleChange(selectVal, index){
				console.log("selectVal:", selectVal)
				console.log("index:", index)
				if (index == undefined) {
					// 固定的 "时间字段"
					if (selectVal == 30 || selectVal == 50 || selectVal == 70 || selectVal == 90 || selectVal == 110) {
						// 选中了 “取指定数量” ，需要指定数量
						this.numberBoxProps.paramTime.color = "#000"
						this.numberBoxProps.paramTime.disabled = false
						this.baseFormData.paramTime.time = selectVal
					} else {
						this.numberBoxProps.paramTime.color = "#fff"
						this.numberBoxProps.paramTime.disabled = true
					}
					return
				}
				console.log("index typeof:",typeof  index)
				// 动态增加的 "时间字段"
				if (selectVal == 30 || selectVal == 50 || selectVal == 70 || selectVal == 90 || selectVal == 110) {
					// 选中了 “取指定数量” ，需要指定数量
					this.numberBoxProps.paramTimes[index].color = "#000"
					this.numberBoxProps.paramTimes[index].disabled = false
					this.baseFormData.paramTimes[index].time = selectVal
				} else {
					this.numberBoxProps.paramTimes[index].color = "#fff"
					this.numberBoxProps.paramTimes[index].disabled = true
				}
			},
			// 取值范围
			dataLimitChange(e) {
				const selectVal = e.detail.value
				this.dataLimitStyleChange(selectVal)
			},
			dataLimitStyleChange(selectVal){
				if (selectVal == 0 || selectVal == 1) {
					this.numberBoxProps.limit.color = "#fff"
					this.numberBoxProps.limit.disabled = true
					this.baseFormData.limit = selectVal
				} else {
					// 选中了 “取指定数量” ，需要指定数量
					this.numberBoxProps.limit.color = "#000"
					this.numberBoxProps.limit.disabled = false
				}
				this.pageConditionShowHidden(selectVal)
			},
			executeTimeChange(e) {
				// 根据选中的value来查找对应的对象
				const selectedOption = this.executeTime.find(option => option.value === e.detail.value[0].value);
				this.baseFormData.executeTimeCron = selectedOption.cron
			},
			retryStrategyChange(e) {
				const selectVal = e.detail.value[0].value
				this.baseFormData.retryStrategy = selectVal

				if (selectVal == 10 || selectVal == 30 || selectVal == 50 ||
					selectVal == 70 || selectVal == 90) {
					// 选中了 带有 n ，需要指定数量
					this.numberBoxProps.retryStrategy.color = "#000"
					this.numberBoxProps.retryStrategy.disabled = false
				} else {
					this.numberBoxProps.retryStrategy.color = "#fff"
					this.numberBoxProps.retryStrategy.disabled = true
					this.baseFormData.retryStrategyTimes = 0
				}
				console.log('e:', selectVal);
			},
			nextPageStrategyChange(e) {
				const selectVal = e.detail.value[0].value
				// 1-递增页号;2-指针顺取
				if (selectVal == 10) { // '请输入下一页取值条件 如 page = page + 1 或 startId = id '
					this.placeholder.nextPageField = '请输入下一页取值条件 如 page:#page + 1|page'
				} else {
					this.placeholder.nextPageField = '请输入下一页取值条件 如 startId = id'
				}
				this.$forceUpdate() // 强制组件重新渲染
				console.log('e:', selectVal);
			},
			jsonDataVolid() {
				const msg = "JSON 格式检查："
				this.dataContentFields = [] // 清空，待结构识别后，重新设置
				if (this.checkJSON(this.baseFormData.introduction)) {
					this.messageToggle('success', msg + '通过！')
					this.baseFormData.respConstructor = this.baseFormData.introduction
					// 手动增加一条全取选项
					this.dataContentFields.push({
						text: '全取',
						value: ''
					})
					// 数据字段没回显时，默认选中第一个
					if (!this.baseFormData.dataContentField) this.baseFormData.dataContentField = this.dataContentFields[0].value

					return // 成功，结束
				}
				// 失败
				this.messageToggle('error', msg + '未通过，请核查！')
			},
			
			//JSON.stringify()
			//JSON.parse
			checkJSON(x) {
				try {
					console.log("开始检查")
					const respJSON = JSON.parse(x);
					this.dataVolid.respJsonFormat = true
					console.log('json格式检查：通过 ' + this.dataVolid.respJsonFormat)
					this.explainRspJsonToMap(respJSON)
					console.log('step0：通过 ')
					const respExplainedMap = this.fieldCheck.respExplainedMap
					this.baseFormData.respExplainedStr = this.mapToStyleStr(respExplainedMap)
					console.log('step1：通过 ')
					this.baseFormData.respExplainedFormat = this.mapValueRed(this.mapReverse(respExplainedMap))
					
					console.log('step2：通过 ')
					// this.baseFormData.respExplainedJsonStr = JSON.stringify(Object.fromEntries(this.baseFormData.respExplainedFormat))
					this.baseFormData.respExplainedJsonStr = JSON.stringify(this.baseFormData.respExplainedFormat)
					return true
				} catch (e) {
					// 不是严格的 JSON 格式
					this.dataVolid.respJsonFormat = false
					console.log('json格式检查：未通过 ' + this.dataVolid.respJsonFormat)
					return false
				}
			},
			explainRspJsonToMap(rspJSON) {
				// let respExplainedMap = new Map();
				// const allFieldSet = new Set();
				// const repeatFieldSet = new Set();
				if (Array.isArray(rspJSON)) {
					this.handleJSONArray(0, null, rspJSON);
				} else {
					this.handleJSON(0, null, rspJSON);
				}
			},
			// map数据进行逆序
			mapReverse(map) {
				// 将Map转换为数组
				const mapArray = Array.from(map);
				// 逆序数组
				mapArray.reverse();
				// 将逆序后的数组转换回Map
				return new Map(mapArray);
			},
			mapReverseAndToArray(list, map){
				// 将Map转换为数组
				const mapArray = Array.from(map);
				// 逆序数组
				mapArray.reverse();
				for (const [key, value] of new Map(mapArray)) {
					list.push({"key": key, "value": value})
				}
			},
			mapToStyleStr(map) {
				// let html = '<span style="border: 1px solid #DCDFE6; border-radius: 4px;width:100%;hight:100%;">'
				let str = '';
				for (const [key, value] of map) {
					str = `${key}: ${this.signColorForFieldToRed(value)}<br>` + str;
				}
				// return html + str +"</span>";
				return str;
			},
			styleStrToMap(str) {
				// 1e: content<br>1s: status,code,msg<br>2a-content: list<br>4s-order: <span style="color:red">orderNo</span>,orderState,memberId<br>
				let newMap = new Map()
				str = str.replace(' ','');
				if(str.includes('<br>')){
					var arr = str.split('<br>')
					for (let e of arr) {
						if(e) newMap.set(e.substring(0, e.indexOf(':')), e.substring(e.indexOf(':')+1))
					}
				}
				
				return newMap;
			},
			mapValueRed(map) {
				let newMap = new Map()
				for (const [key, value] of map) {
					newMap.set(key, [this.signColorForFieldToRed(value), value])
				}
				return newMap
			},
			// 将 重名的字段 标红处理
			signColorForFieldToRed(value) {
				var arr = value.split(",")
				let str = '';
				for (let e of arr) {
					let after = e,before
					let flag1 = false,flag2 = false
					if(e.includes("=")){
						flag1 = true
						before=e.substring(0, e.indexOf("="))
						after=e.substring(e.indexOf("=")+1)
					}
					
					if (this.fieldCheck.repeatFieldMap.has(after)) {
						flag2 = true
						e = `<span style="color:red">` + after + `</span>`
					}
					if(flag1&&flag2){
						e = before+"="+e
					}
					if (str == '') {
						str += e
					} else {
						str += (',' + e)
					}
				}
				return str;
			},

			handleJSONArray(cycle, parentKey, jsonArray) {
				// jsonArray.forEach(itemJson => {
				// 	this.handleJSON(respExplained, cycle, parentKey, itemJson);
				// });

				// JSONArray 只取第一个对象进行属性取值
				this.handleJSON(cycle, parentKey, jsonArray[0]);
			},
			handleJSON(cycle, parentKey, jsonData) {
				cycle = cycle + 1;
				let str = '';
				let entity = '';
				let array = '';
				// 使用Object.entries()遍历键和值
				for (const [key, value] of Object.entries(jsonData)) {
					// console.log('Object.entries:', `${key}: ${value}`);
					let jsonKey = key
					let jsonValue = value
					let valType = util.JsonValueDataType(jsonValue)
					switch (valType) {
						case util.JsonValueDataTypeEnum.SINGLE_VALUE:
							// console.log("判断为 singleValue")
							// 收集 所有字段 及 重复字段 
							this.judgeRepeatAndCollectFields(jsonKey)
							
							console.log("检查重复值，结束")
							
							if (str == '') {
								str += jsonKey
							} else {
								str += (',' + jsonKey)
							}
							this.simpleFields.push({
								label: jsonKey,
								value: jsonKey
							})
							break;

						case util.JsonValueDataTypeEnum.JSON_ARRAY:
							// console.log("判断为 jsonArray")
							if (array == '') {
								array += jsonKey
							} else {
								array += (',' + jsonKey)
							}
							// 数据字段，填充下来列表
							this.dataContentFields.push({
								text: jsonKey,
								value: jsonKey
							})
							this.handleJSONArray(cycle, jsonKey, jsonValue);
							break;

						case util.JsonValueDataTypeEnum.JSON_OBJECT:
							// console.log("判断为 jsonObject")
							if (entity == '') {
								entity += jsonKey
							} else {
								entity += (',' + jsonKey)
							}
							this.handleJSON(cycle, jsonKey, jsonValue);
							break;
					}
				}

				if (cycle == 1) {
					// 第一层
					if (str != '') this.fieldCheck.respExplainedMap.set('1s', str)
					if (entity != '') this.fieldCheck.respExplainedMap.set('1e', entity)
					if (array != '') this.fieldCheck.respExplainedMap.set('1a', array)
					// console.log("第一层 结束 respExplainedMap:", Object.fromEntries(Array.from(respExplainedMap)))
				} else {
					if (str != '') this.fieldCheck.respExplainedMap.set(cycle + 's-' + parentKey, str)
					if (entity != '') this.fieldCheck.respExplainedMap.set(cycle + 'e-' + parentKey, entity)
					if (array != '') this.fieldCheck.respExplainedMap.set(cycle + 'a-' + parentKey, array)
					// console.log("第"+cycle+"层 结束 respExplainedMap:", Object.fromEntries(Array.from(respExplainedMap)))
				}

			},
			
			judgeRepeatAndCollectFields(jsonKey){
				console.log("检查重复值~~~")
				if(!this.fieldCheck.allFieldMap.has(jsonKey)) {
					this.fieldCheck.allFieldMap.set(jsonKey, 1)
					return false
				}
				
				this.fieldCheck.allFieldMap.set(jsonKey, this.fieldCheck.allFieldMap.get(jsonKey) + 1)
				
				if (!this.fieldCheck.repeatFieldMap.has(jsonKey)) {
					this.fieldCheck.repeatFieldMap.set(jsonKey, 1)
					return true
				}
				
				this.fieldCheck.repeatFieldMap.set(jsonKey, this.fieldCheck.repeatFieldMap.get(jsonKey)+1)
				return true
			},

			// json 类型判断
			isJsonObject(value) {
				return typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date);
			},
			// jons数组 类型判断
			isJsonArray(value) {
				return Array.isArray(value);
			},
			// 单值 类型判断
			isSingleValue(value) {
				return typeof value !== 'object' && !Array.isArray(value);
			},
			messageToggle(type, msg) {
				this.toggleMessage.msgType = type
				this.toggleMessage.messageText = msg
				this.$refs.message.open()
			},
			checkUrl() {
				this.isUrlValid(this.baseFormData.url)
			},
			// 判断URL是否有效
			isUrlValid(url) {
				const msg = "URL 格式检查：";
				const regex =
					/^((https|http|ftp|rtsp|mms):\/\/)(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z].[a-zA-Z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\/?)$/
				if (regex.test(url)) {
					console.log("success!!! is URL.")
					this.messageToggle('success', msg + "通过！")
					this.dataVolid.urlFormat = true
					return true
				}
				this.dataVolid.urlFormat = false
				console.log("false!!! isn't URL.")
				this.messageToggle('error', msg + '未通过，请核查！')
				return false
			},
			pageConditionShowHidden(selectVal){
				if (selectVal == 0) {
					this.pageCondition.disabled = false
					this.pageCondition.open = true
				} else {
					this.pageCondition.disabled = true
					this.pageCondition.open = false
				}
			},
			request(method, url) {
				if (method == 'GET') {
					// 发送GET请求
					uni.request({
						url: url, // 你的后端API地址
						method: 'GET',
						success: (res) => {
							console.log('GET请求成功：', res.data);
						},
						fail: (err) => {
							console.error('GET请求失败：', err);
						}
					});
				} else {
					// 发送POST请求
					uni.request({
						url: 'https://your-backend-endpoint.com/api/data', // 你的后端API地址
						method: 'POST',
						data: {
							key1: 'value1',
							key2: 'value2'
						},
						header: {
							'content-type': 'application/json' // 默认值
						},
						success: (res) => {
							console.log('POST请求成功：', res.data);
						},
						fail: (err) => {
							console.error('POST请求失败：', err);
						}
					});
				}
			},
			submit(ref) {
				console.log("数据", JSON.stringify(this.baseFormData));
				console.log("this.baseFormData.respExplainedFormat: ", JSON.stringify(this.baseFormData.respExplainedFormat));
				this.$refs[ref].validate().then(res => {
					console.log('success', res);
					uni.showToast({
						title: `校验通过`
					})
					
					uni.request({
						url: 'http://localhost:8088/overpass/service-bridge/interface/update',
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						data: {
							"baseFormData": JSON.stringify(this.baseFormData)
						},
						success: (res) => {
							console.log('提交成功', res);
						},
						fail: (err) => {
							console.error('提交失败', err);
						}
					});
				}).catch(err => {
					console.log('err', err);
				})
			},

			// 获取数据
			// getData(pageCurrent, value = '') {
			// 	this.table.loading = true
			// 	this.table.pageCurrent = pageCurrent
			// 	this.request({
			// 		pageSize: this.table.pageSize,
			// 		pageCurrent: pageCurrent,
			// 		value: value,
			// 		success: res => {
			// 			// console.log('data', res);
			// 			this.table.tableData = res.data
			// 			this.table.total = res.total
			// 			this.table.loading = false
			// 		}
			// 	})
			// },
			// 伪request请求
			request(options) {
				const {
					pageSize,
					pageCurrent,
					success,
					value
				} = options
				let total = this.table.tableData.length
				let data = this.table.tableData.filter((item, index) => {
					const idx = index - (pageCurrent - 1) * pageSize
					return idx < pageSize && idx >= 0
				})
				if (value) {
					data = []
					this.table.tableData.forEach(item => {
						if (item.name.indexOf(value) !== -1) {
							data.push(item)
						}
					})
					total = data.length
				}

				setTimeout(() => {
					typeof success === 'function' &&
						success({
							data: data,
							total: total
						})
				}, 500)
			}
		},
		onNavigationBarButtonTap(e) {
			if (this.showLeft) {
				this.$refs.showLeft.close()
			} else {
				this.$refs.showLeft.open()
			}
		},
		// app端拦截返回事件 ，仅app端生效
		onBackPress() {
			if (this.showRight || this.showLeft) {
				this.$refs.showLeft.close()
				this.$refs.showRight.close()
				return true
			}
		},

	}
</script>

<style lang="scss">
	.example {
		padding: 15px;
		background-color: #fff;
	}

	.segmented-control {
		margin-bottom: 15px;
	}

	.button-group {
		margin-top: 15px;
		display: flex;
		justify-content: space-around;
	}

	.form-item {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.button {
		display: flex;
		align-items: center;
		height: 35px;
		line-height: 35px;
		margin-left: 10px;
	}

	.example-body {
		padding: 10px;
	}

	.scroll-view {
		/* #ifndef APP-NVUE */
		width: 100%;
		height: 100%;
		/* #endif */
		flex: 1
	}

	// 处理抽屉内容滚动
	.scroll-view-box {
		flex: 1;
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}

	.info {
		padding: 15px;
		color: #666;
	}

	.info-text {
		font-size: 14px;
		color: #666;
	}

	.info-content {
		padding: 5px 15px;
	}

	.close {
		padding: 10px;
	}

	.uni-textarea uni-textarea {
		height: 600px;
	}

	// textarea disabled='false' 文本颜色，避免过于灰不方便查看。
	::v-deep .is-disabled {
		color: black !important;
	}

	// pick 多级联动选择
	.uni-picker-tips {
		font-size: 12px;
		color: #666;
		margin-bottom: 15px;
		padding: 0 15px;
		/* text-align: right; */
	}

	// 动态表单-删除按钮上文本-“删除”2字-越框不易看
	.button {
		line-height: 15px;
	}

	// 小尺寸屏幕，输入框变形，无法操作
	.uni-row {
		flex-wrap: wrap;
	}

	/* 针对uniapp中的input组件 placeholder 属性 英文*/
	/* 
		uniapp input placeholder 英文有遮挡
		这个问题通常是由于英文字体中小写字母的下方有额外的空间（空白区域或者叫做下溢出），导致当placeholder的文本是英文时，它会比没有文本时的输入框位置略低，看起来就像是被遮挡了一样。

		解决方法：

		使用带有更好空白处理的字体，例如Consolas或Courier New。

		使用CSS来调整placeholder的样式，使其位置与无文本时的位置对齐。

		以下是一个简单的CSS样式示例，用于调整placeholder的垂直对齐： 
		*/
	.uni-input-placeholder {
		/* 调整vertical-align属性 */
		// vertical-align: middle;
		/* 或者使用padding-top来手动调整 */
		padding-bottom: 2px; // padding-bottom 更有效
	}



	// // 有变化
	// .respExplained{
	// 	line-height: 1.5;
	// 	font-size: 28rpx;
	// 	height: 60rpx;
	// 	min-height: 60rpx;
	// 	/* #ifndef APP-NVUE */
	// 	min-height: 60rpx;
	// 	width: auto;
	// 	/* #endif */
	// }

	// // 有效
	// ::v-deep .respExplained .uni-easyinput__content-textarea{
	// 	height: 400px;
	// }
</style>