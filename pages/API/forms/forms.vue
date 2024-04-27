<template>
	<view class="container">
		<uni-card :is-shadow="false" is-full>
			<text class="uni-h6">uni-forms 组件一般由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据。</text>
		</uni-card>
		<uni-section title="接口" type="line">
			<view class="example">
				<!-- 基础用法，不包含校验规则 -->
				<uni-forms ref="baseForm" :model="baseFormData" labelWidth="80px">
					<uni-forms-item label="接口名称" required>
						<uni-easyinput v-model="baseFormData.name" placeholder="请输入接口名称" />
					</uni-forms-item>
					<uni-forms-item label="URL" required>
						<uni-easyinput v-model="baseFormData.url" @blur="checkUrl" placeholder="请输入URL" />
					</uni-forms-item>
					<uni-forms-item label="请求方式" required>
						<uni-data-checkbox v-model="baseFormData.method" :localdata="reqMethod" />
					</uni-forms-item>
					<uni-forms-item label="取值范围" required>
						<uni-data-checkbox v-model="baseFormData.limit" @change="dataLimitChange" :localdata="dataLength" style="float: left;"/>
						<uni-number-box :min="0" :max="100000000" :value="baseFormData.limit" style="float: left;" :color="numberBoxProps.limit.color" :disabled="numberBoxProps.limit.disabled"  width="120" />
					</uni-forms-item>
					
					<uni-forms-item label="调度示例">
						<uni-data-picker v-model="excuteTimeExample" :localdata="excuteTime" @change="excuteTimeChange" popup-title="查看执行时机示例" :ellipsis="false" ></uni-data-picker>
						<!-- <uni-number-box :min="0" :max="100000000" :value="baseFormData.excuteTime" style="float: left; " :color="numberBoxProps.retryStrategy.color" :disabled="numberBoxProps.retryStrategy.disabled"  width="120" /> -->
					</uni-forms-item>
					
					<uni-forms-item label="执行时机" required>						
							<view class="uni-list" style="width: 340px; " >
								<view class="uni-list-cell"  >
									<view class="uni-list-cell-left" >
										依需修改
									</view>
									<view class="uni-list-cell-db" >
										<uni-easyinput v-model="baseFormData.excuteTimeCron" @blur="cronCheck" placeholder="请确认 执行时机 cron 表达式" />
						<!-- <uni-data-picker v-model="baseFormData.excuteTime" :localdata="excuteTime" @change="excuteTimeChange" popup-title="选择" :ellipsis="false" ></uni-data-picker> -->
						<!-- <uni-number-box :min="0" :max="100000000" :value="baseFormData.excuteTime" style="float: left; " :color="numberBoxProps.retryStrategy.color" :disabled="numberBoxProps.retryStrategy.disabled"  width="120" /> -->
									</view>
								</view>
							</view>
					</uni-forms-item>
					
					<!-- <uni-forms-item label="执行时机">
						<view class="uni-list" style="width: 340px; flex: auto;  " >
							<view class="uni-list-cell"  >
								<view class="uni-list-cell-left">
									当前选择
								</view>
								<view class="uni-list-cell-db" >
									<picker class="picker-container" mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="retryPreRemind.multiIndex" :range="retryPreRemind.multiArray" >
										<view class="uni-input">{{retryPreRemind.multiArray[0][retryPreRemind.multiIndex[0]].text}}，{{retryPreRemind.multiArray[1][retryPreRemind.multiIndex[1]].text}}，{{retryPreRemind.multiArray[2][retryPreRemind.multiIndex[2]].text}}</view>
									</picker>
								</view>
								
								<view class="uni-list-cell-db">
									<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="retryPreRemind.multiIndex" :range="retryPreRemind.multiArray">
										<view class="uni-input">{{retryPreRemind.multiArray[0][retryPreRemind.multiIndex[0]].text}}，{{retryPreRemind.multiArray[1][retryPreRemind.multiIndex[1]].text}}，{{retryPreRemind.multiArray[2][retryPreRemind.multiIndex[2]].text}}</view>
									</picker>
								</view>
							</view>
						</view>
					</uni-forms-item> -->
					
					<!-- <uni-forms-item label="重试策略" class="retryStrategy">
						
						<view class="uni-list-cell-db">
							<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange1" :value="multiIndex" :range="multiArray">
								<view class="uni-input">{{multiArray[0][multiIndex[0]]}}，{{multiArray[1][multiIndex[1]]}}，{{multiArray[2][multiIndex[2]]}}</view>
							</picker>
						</view>
					</uni-forms-item> -->
					
					<uni-forms-item label="重试策略" class="retryStrategy">
						<uni-data-picker v-model="baseFormData.retryStrategy" :localdata="retryStrategy" @change="retryStrategyChange" popup-title="选择" :ellipsis="false" style="float: left; width: 340px; margin-right: 20px;"></uni-data-picker>
						<uni-number-box :min="0" :max="100000000" :value="baseFormData.retryStrategyTimes" style="float: left; " :color="numberBoxProps.retryStrategy.color" :disabled="numberBoxProps.retryStrategy.disabled"  width="120" />
					</uni-forms-item>
					
<!-- 					<uni-forms-item label="兴趣爱好" required>
						<uni-data-checkbox v-model="baseFormData.hobby" multiple :localdata="hobbys" />
					</uni-forms-item>
					<uni-forms-item label="自我介绍" >
						<uni-easyinput type="textarea" v-model="baseFormData.introduction" placeholder="请输入自我介绍" maxlength="5000" />
					</uni-forms-item>
					<uni-forms-item label="日期时间">
						<uni-datetime-picker type="datetime" return-type="timestamp"
							v-model="baseFormData.datetimesingle" />
					</uni-forms-item>

					<uni-forms-item label="选择技能">
						<uni-data-select v-model="baseFormData.skills" :localdata="skillsRange" >
						</uni-data-select>
					</uni-forms-item> -->

					<uni-forms-item label="数据结构">
						<uni-section title="返回值结构" type="line">
							<view class="example-body">
								<button type="primary" @click="showDrawer('showRight')"><text class="word-btn-white">录入 数据结构</text> </button>
								<!--:mask-click="true" 点击其他区域，自动收起。默认值：true-->
								<uni-drawer ref="showRight" mode="right" :width="360" :mask-click="true" @change="change($event,'showRight')">
									<view class="scroll-view">
										<scroll-view class="scroll-view-box" scroll-y="true">
											<view class="info">
												<text class="info-text">&nbsp;&nbsp;&nbsp;&nbsp;返回值结构中，不用的字段，既增加了处理的负担，又耗费了系统资源，请尽包括需要的字段，其余字段请移除！</text>
											</view>
											<view class="close">
												<button @click="closeDrawer('showRight')"><text class="word-btn-white">关闭Drawer</text></button>
											</view>
											
											<view class="button-group">
												<button class="word-btn-white" size="mini" @click="jsonDataVolid()">JSON 格式核查</button>
												<button class="word-btn-white" size="mini" @click="checkUrl()">提交</button>
											</view>
											
											<view class="uni-textarea" >
												<textarea  v-model="baseFormData.introduction"  placeholder-style="color:#F76260" placeholder="接口返回的数据结构" 
												maxlength="5000"  />
											</view>
											
											<view class="button-group close">
												<button class="word-btn-white" size="mini" @click="add">新增域名</button>
												<button class="word-btn-white" size="mini" @click="submit('dynamicForm')">提交</button>
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
							<!-- <view class="uni-title uni-common-pl">占位符字体是红色的textarea</view> -->
							<!-- <view class="uni-textarea" > -->
								<uni-easyinput type="textarea" v-model="baseFormData.respConstructor" disabled="false"  maxlength="5000" />
							<!-- </view> -->
						</uni-section>
						<uni-section title="解析结构" type="line">
							<!-- <view class="uni-title uni-common-pl">占位符字体是红色的textarea</view> -->
							<!-- <view class="uni-textarea" > -->
								<uni-easyinput class="respExplained" auto-height="true" type="textarea" v-model="baseFormData.respExplained" disabled="false"  maxlength="5000" />
							<!-- </view> -->
						</uni-section>
					</uni-forms-item>
				</uni-forms>
			</view>
		</uni-section>

	</view>
	
	
	<view>
		<!-- 提示信息弹窗 -->
		<uni-popup ref="message" type="message">
			<uni-popup-message :type="toggleMessage.msgType" :message="toggleMessage.messageText" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>

<script>
    import * as util from '../../../common/util.js'
	
	export default {
		
		
		data() {
			return {
				// 执行时机-示例-默认选项
				excuteTimeExample: 7,
				multiArray: [
					['亚洲', '欧洲'],
					['中国', '日本'],
					['北京', '上海', '广州']
				],
				multiIndex: [0, 0, 1],
				retryPreRemind1:{
					multiArray: [
						['无限重试', '重试 n 次', '当日内（次日00:00前）', ' n 日内', 
						'本月内（次月01 00:00前）', ' n 月内', 
						'本季度内（下季度(04/07/10/01).01 00:00前）', ' n 季度内', 
						'本年内（次年01.01 00:00前）', ' n 年内'],
						['中国', '日本'],
						['北京', '上海', '广州']
					],
					multiIndex: [0, 0, 0]
				},
				numberBoxProps: {
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
				// 提示信息弹窗 -begin --<<--
				toggleMessage: {
					type: 'center',
					msgType: 'success',
					messageText: '这是一条成功提示',
					value: ''
				},
				// 提示信息弹窗 - end  -->>--
				// 基础表单数据
				baseFormData: {
					name: '',
					url: '',
					introduction: '',
					respConstructor: '',
					respExplained: '',
					method: 'POST',
					limit: '0',
					hobby: [5],
					datetimesingle: 1627529992399,
					excuteTime: "1",
					excuteTimeCron: "0 15 10 ? * *",
					// retryStrategy: {
					// 	text: "无限重试",
					// 	value: "-1",
					// },
					retryStrategy: "-1",
					retryStrategyTimes: "0",
					skills: 0
				},
				// 执行时机
				excuteTime: [
					   {text: '表示每2秒 执行任务		【0/2 * * * * ?】', 												value: 1, cron:'0/2 * * * * ?'}
					     ,{text: '每2分钟 执行任务		【0 0/2 * * * ?】', 											value: 2, cron:'0 0/2 * * * ?'}
					     ,{text: '每月的1日的凌晨2点 执行任务		【0 0 2 1 * ?】', 									value: 3, cron:'0 0 2 1 * ?'}
					     ,{text: '每天上午10点，下午2点，4点 执行任务	【0 0 10,14,16 * *】', 							value: 4, cron:'0 0 10,14,16 * * ?'} 
					     ,{text: '朝九晚五工作时间内每半小时 执行任务	【0 0/30 9-17 * *】', 							value: 5, cron:'0 0/30 9-17 * * ?'} 
					     ,{text: '每天中午12点 执行任务		【0 0 12 * * ?】', 										value: 6, cron:'0 0 12 * * ?'} 
					     ,{text: '每天上午10:15 执行任务		【0 15 10 ? * *】', 										value: 7, cron:'0 15 10 ? * *'} 
					     ,{text: '每天下午2点到下午2:59期间的每1分钟 执行任务		【0 * 14 * * ?】', 					value: 8, cron:'0 * 14 * * ?'} 
					     ,{text: '每天下午2点到下午2:55期间的每5分钟 执行任务		【0 0/5 14 * * ?】', 				value: 9, cron:'0 0/5 14 * * ?'} 
					     ,{text: '每天下午2点到2:55期间和下午6点到6:55期间的每5分钟 执行任务		【0 0/5 14,18 * * ?】', 	value: 10, cron:'0 0/5 14,18 * * ?'} 
					     ,{text: '每天下午2点到下午2:05期间的每1分钟 执行任务		【0 0-5 14 * * ?】', 				value: 11, cron:'0 0-5 14 * * ?'} 
					     ,{text: '每月15日上午10:15 执行任务		【0 15 10 15 * ?】', 								value: 12, cron:'0 15 10 15 * ?'} 
					     ,{text: '每月最后一日的上午10:15 执行任务		【0 15 10 L * ?】', 								value: 13, cron:'0 15 10 L * ?'} 
					     ,{text: '每个星期三中午12点 执行任务		【0 0 12 ? * WED】', 								value: 14, cron:'0 0 12 ? * WED'} 
					     ,{text: '每年三月的星期三的下午2:10和2:44 执行任务		【0 10,44 14 ? 3 WED】', 				value: 15, cron:'0 10,44 14 ? 3 WED'} 
					     ,{text: '周一至周五的上午10:15 执行任务		【0 15 10 ? * MON-FRI】', 						value: 16, cron:'0 15 10 ? * MON-FRI'} 
					     ,{text: '每月的最后一个星期五上午10:15 执行任务		【0 15 10 ? * 6L】', 					value: 17, cron:'0 15 10 ? * 6L'} 
					     ,{text: '每月的第三个星期五上午10:15 执行任务		【0 15 10 ? * 6#3】', 						value: 18, cron:'0 15 10 ? * 6#3'}
				],
				// 重试策略
				retryStrategy: [
					{
						text: "无限重试",
						value: "-1"
					},{
						text: "重试 n 次",
						value: "10"
					},{
						text: "当日内（次日00:00前）",
						value: "20"
					},{
						text: " n 日内",
						value: "30"
					},{
						text: "本月内（次月01 00:00前）",
						value: "40"
					},{
						text: " n 月内",
						value: "50"
					},{
						text: "本季度内（下季度(04/07/10/01).01 00:00前）",
						value: "60"
					},{
						text: " n 季度内",
						value: "70"
					},{
						text: "本年内（次年01.01 00:00前）",
						value: "80",
					},{
						text: " n 年内",
						value: "90"
					}
				],
				// 重试策略
				retryPreRemind:{
					multiArray: [
					[
						{
							text: "无限重试",
							value: "-1"
						},{
							text: "重试 n 次",
							value: "10"
						},{
							text: "当日内（次日00:00前）",
							value: "20"
						},{
							text: " n 日内",
							value: "30"
						},{
							text: "本月内（次月01 00:00前）",
							value: "40"
						},{
							text: " n 月内",
							value: "50"
						},{
							text: "本季度内（下季度(04/07/10/01).01 00:00前）",
							value: "60"
						},{
							text: " n 季度内",
							value: "70"
						},{
							text: "本年内（次年01.01 00:00前）",
							value: "80"
						},{
							text: " n 年内",
							value: "90"
						}
					],
					[{
						text: "中国",
						value: "-1"
					},{
						text: "日本",
						value: "-1"
					},],
					[{
						text: "北京",
						value: "-1"
					},{
						text: "上海",
						value: "-1"
					},{
						text: "广州",
						value: "-1"
					}]
					
					],
					multiIndex: [0, 0, 0]
				},
				
				// 重试策略-预提醒
				retryPreRemind2: [
				
					{
						text: "无限重试",
						value: "-1",
						
					},{
						text: "重试 n 次",
						value: "10",
						remind: {
							text: '不提醒',
							value: '0'
						}
					},{
						text: "当日内（次日00:00前）",
						value: "20",
						remind: {
							text: '不提醒',
							value: '0'
						}
					},{
						text: " n 日内",
						value: "30"
					},{
						text: "本月内（次月01 00:00前）",
						value: "40"
					},{
						text: " n 月内",
						value: "50"
					},{
						text: "本季度内（下季度(04/07/10/01).01 00:00前）",
						value: "60"
					},{
						text: " n 季度内",
						value: "70"
					},{
						text: "本年内（次年01.01 00:00前）",
						value: "80"
					},{
						text: " n 年内",
						value: "90"
					}
				],
				// 预先提醒-重试暂停
				preRemind: [
					{
						value: 0,
						text: "编程",
						children:{
							
						}
					},
					{
						value: 1,
						text: "绘画"
					},
					{
						value: 2,
						text: "运动"
					},
				],
				// 表单数据
				alignmentFormData: {
					name: '',
					age: '',
				},
				// 单选数据源
				reqMethod: [// 默认选项，在data中设置
					{
						text: 'POST',
						value: 'POST',
					},{
						text: 'GET',
						value: 'GET'
					},{
						text: '其他',
						value: '其他'
					}],
				// 单选数据源
				dataLength: [// 默认选项，在data中设置
					{
						text: '分页全取',
						value: '0',
					},{
						text: '取1条',
						value: '1'
					},{
						text: '取指定数量',
						value: '2'
					}],
				// 多选数据源
				hobbys: [
					{
						text: '跑步',
						value: 0
					}, {
						text: '游泳',
						value: 1
					}, {
						text: '绘画',
						value: 2
					}, {
						text: '足球',
						value: 3
					}, {
						text: '篮球',
						value: 4
					}, {
						text: '其他',
						value: 5
					}],
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
							errorMessage: '姓名不能为空'
						}]
					},
					age: {
						rules: [{
							required: true,
							errorMessage: '年龄不能为空'
						}, {
							format: 'number',
							errorMessage: '年龄只能输入数字'
						}]
					}
				},
				// 自定义表单数据
				customFormData: {
					name: '',
					age: '',
					hobby: []
				},
				// 自定义表单校验规则
				customRules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '姓名不能为空'
						}]
					},
					age: {
						rules: [{
							required: true,
							errorMessage: '年龄不能为空'
						}]
					},
					hobby: {
						rules: [{
								format: 'array'
							},
							{
								validateFunction: function(rule, value, data, callback) {
									if (value.length < 2) {
										callback('请至少勾选两个兴趣爱好')
									}
									return true
								}
							}
						]
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
		onLoad() {},
		onReady() {
			// 设置自定义表单校验规则，必须在节点渲染完毕后执行
			this.$refs.customForm.setRules(this.customRules)
		},
		methods: {
			
			onClickItem(e) {
				console.log(e);
				this.current = e.currentIndex
			},
			add() {
				this.dynamicFormData.domains.push({
					label: '域名',
					value: '',
					rules: [{
						'required': true,
						errorMessage: '域名项必填'
					}],
					id: Date.now()
				})
			},
			del(id) {
				let index = this.dynamicLists.findIndex(v => v.id === id)
				this.dynamicLists.splice(index, 1)
			},
			submit(ref) {
				console.log(this.baseFormData);
				this.$refs[ref].validate().then(res => {
					console.log('success', res);
					uni.showToast({
						title: `校验通过`
					})
				}).catch(err => {
					console.log('err', err);
				})
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
				if(!e){
					this.jsonDataVolid();
				}
			},
			dataLimitChange(e){
				const selectVal = e.detail.value
				if(selectVal == 0 || selectVal == 1){
					this.numberBoxProps.limit.color = "#fff"
					this.numberBoxProps.limit.disabled = true
					this.baseFormData.limit = selectVal
				}else{
					// 选中了 “取指定数量” ，需要指定数量
					this.numberBoxProps.limit.color = "#000",
					this.numberBoxProps.limit.disabled = false
				}
				console.log('e:',selectVal);
			},
			excuteTimeChange(e){
				// 根据选中的value来查找对应的对象
				const selectedOption = this.excuteTime.find(option => option.value === e.detail.value[0].value);
				this.baseFormData.excuteTimeCron = selectedOption.cron
			},
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
			jsonDataVolid(){
				const msg = "JSON 格式检查："
				if(this.checkJSON(this.baseFormData.introduction)){
					this.messageToggle('success', msg + '通过！')
					this.baseFormData.respConstructor = this.baseFormData.introduction
				}else{
					this.messageToggle('error', msg + '未通过，请核查！')
				}
			},
			//JSON.stringify()
			//JSON.parse
			checkJSON(x) {
				try {
					const rspJSON = JSON.parse(x);
					this.dataVolid.respJsonFormat = true
					console.log('this.dataVolid.respJsonFormat：'+ this.dataVolid.respJsonFormat)
					const respExplained = this.explainRsp(rspJSON)
					this.baseFormData.respExplained = this.mapToString(respExplained)
					return true
				} catch (e) {
					// 不是严格的 JSON 格式
					this.dataVolid.respJsonFormat = false
					console.log('this.dataVolid.respJsonFormat：'+ this.dataVolid.respJsonFormat)
					return false
				}
			},
			explainRsp(rspJSON){
				let respExplained = new Map();
				if(Array.isArray(rspJSON)){
					this.handleJSONArray(respExplained, 0, null, rspJSON);
				}else{
					this.handleJSON(respExplained, 0, null, rspJSON);
				}
				// console.log("respExplained:", Object.fromEntries(Array.from(respExplained)))
				return respExplained;
			},
			mapToString(map){
				let str = '';
				for(const [key,value] of map) {
					str = `${key}: ${value};\n` + str;
				}
				return str;
			},
			explainJSONArray(jsonArray){
				jsonArray.forEach(itemJson => {
					this.explainJSON(itemJson);
				});
			},
			handleJSONArray(respExplained, cycle, parentKey, jsonArray){
				jsonArray.forEach(itemJson => {
					this.handleJSON(respExplained, cycle, parentKey, itemJson);
				});
			},
			handleJSON(respExplained, cycle, parentKey, jsonData){
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
					switch(valType){
						case util.JsonValueDataTypeEnum.JSON_OBJECT:
							// console.log("判断为 jsonObject")
							if(entity=='') {
								entity += jsonKey
							}else{
								entity += (','+jsonKey)
							}
							this.handleJSON(respExplained, cycle, jsonKey, jsonValue);
							break;
						
						case util.JsonValueDataTypeEnum.JSON_ARRAY:
							// console.log("判断为 jsonArray")
							if(array=='') {
								array += jsonKey
							}else{
								array += (','+jsonKey)
							}
							this.handleJSONArray(respExplained, cycle, jsonKey, jsonValue);
							break;
						
						case util.JsonValueDataTypeEnum.SINGLE_VALUE:
							// console.log("判断为 singleValue")
							if(str=='') {
								str += jsonKey
							}else{
								str += (','+jsonKey)
							}
							break;
					}
				}				
				
				if(cycle==1){
					// 第一层
					if(str!='') 	respExplained.set('1s', str)
					if(entity!='') 	respExplained.set('1e', entity)
					if(array!='') 	respExplained.set('1a', array)
					// console.log("第一层 结束 respExplained:", Object.fromEntries(Array.from(respExplained)))
				}else{
					if(str!='') 	respExplained.set(cycle+'s-'+parentKey, str)
					if(entity!='') 	respExplained.set(cycle+'e-'+parentKey, entity)
					if(array!='') 	respExplained.set(cycle+'a-'+parentKey, array)
					// console.log("第"+cycle+"层 结束 respExplained:", Object.fromEntries(Array.from(respExplained)))
				}
				
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
			checkUrl(){
				this.isUrlValid(this.baseFormData.url)				
			},
			// 判断URL是否有效
			isUrlValid(url) {
				const msg = "URL 格式检查：";
				const regex = /^((https|http|ftp|rtsp|mms):\/\/)(([0-9a-zA-Z_!~*'().&=+$%-]+: )?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z].[a-zA-Z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\/?)$/
				if(regex.test(url)){
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
			bindMultiPickerColumnChange: function(e) {
				console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
				this.retryPreRemind.multiIndex[e.detail.column] = e.detail.value
				switch (e.detail.column) {
					case 0: //拖动第1列
						switch (this.retryPreRemind.multiIndex[0]) {
							case 0:
								this.retryPreRemind.multiArray[1] = ['中国', '日本']
								this.retryPreRemind.multiArray[2] = ['北京', '上海', '广州']
								break
							case 1:
								this.retryPreRemind.multiArray[1] = ['英国', '法国']
								this.retryPreRemind.multiArray[2] = ['伦敦', '曼彻斯特']
								break
						}
						this.retryPreRemind.multiIndex.splice(1, 1, 0)
						this.retryPreRemind.multiIndex.splice(2, 1, 0)
						break
					case 1: //拖动第2列
						switch (this.retryPreRemind.multiIndex[0]) { //判断第一列是什么
							case 0:
								switch (this.retryPreRemind.multiIndex[1]) {
									case 0:
										this.retryPreRemind.multiArray[2] = ['北京', '上海', '广州']
										break
									case 1:
										this.retryPreRemind.multiArray[2] = ['东京','北海道']
										break
								}
								break
							case 1:
								switch (this.retryPreRemind.multiIndex[1]) {
									case 0:
										this.retryPreRemind.multiArray[2] = ['伦敦', '曼彻斯特']
										break
									case 1:
										this.retryPreRemind.multiArray[2] = ['巴黎', '马赛']
										break
								}
								break
						}
						this.retryPreRemind.multiIndex.splice(2, 1, 0)
						break
				}
				this.$forceUpdate()
			},
		
			bindMultiPickerColumnChange1: function(e) {
				console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
				this.multiIndex[e.detail.column] = e.detail.value
				switch (e.detail.column) {
					case 0: //拖动第1列
						switch (this.multiIndex[0]) {
							case 0:
								this.multiArray[1] = ['中国', '日本']
								this.multiArray[2] = ['北京', '上海', '广州']
								break
							case 1:
								this.multiArray[1] = ['英国', '法国']
								this.multiArray[2] = ['伦敦', '曼彻斯特']
								break
						}
						this.multiIndex.splice(1, 1, 0)
						this.multiIndex.splice(2, 1, 0)
						break
					case 1: //拖动第2列
						switch (this.multiIndex[0]) { //判断第一列是什么
							case 0:
								switch (this.multiIndex[1]) {
									case 0:
										this.multiArray[2] = ['北京', '上海', '广州']
										break
									case 1:
										this.multiArray[2] = ['东京','北海道']
										break
								}
								break
							case 1:
								switch (this.multiIndex[1]) {
									case 0:
										this.multiArray[2] = ['伦敦', '曼彻斯特']
										break
									case 1:
										this.multiArray[2] = ['巴黎', '马赛']
										break
								}
								break
						}
						this.multiIndex.splice(2, 1, 0)
						break
				}
				this.$forceUpdate()
			},
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
	
	// // 无效
	// ::v-deep .uni-easyinput__content-textarea .respExplained{
	// 	line-height: 1.5;
	// 	font-size: 28rpx;
	// 	height: 60rpx;
	// 	min-height: 60rpx;
	// 	/* #ifndef APP-NVUE */
	// 	min-height: 60rpx;
	// 	width: auto;
	// 	/* #endif */
	// }
	
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




