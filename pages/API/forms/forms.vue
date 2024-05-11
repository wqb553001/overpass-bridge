<template>
	<view class="container" style="z-index: 9;" >
		<uni-card :is-shadow="false" is-full>
			<text class="uni-h6">uni-forms 组件一般由输入框、选择器、单选框、多选框等控件组成，用以收集、校验、提交数据。</text>
		</uni-card>
		<uni-section title="接口" type="line" style="z-index: 9;" >
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
					
					<uni-forms-item label="传递参数">
						
						<uni-collapse > 
						<!--<view style="display: block;">
								<uni-data-checkbox v-model="baseFormData.limit" @change="dataLimitChange" :localdata="dataLength" style="float: left;"/>
								<uni-number-box :min="0" :max="100000000" :value="baseFormData.limitNum" style="float: left;" :color="numberBoxProps.limit.color" :disabled="numberBoxProps.limit.disabled"  width="60" />
							</view> -->
						<!-- <uni-collapse> -->
							<uni-forms-item label="headers" labelWidth="68px">
								<uni-easyinput v-model="baseFormData.headers" placeholder="请输入header 如 token=abcdef;Content-Type=application/json " />
							</uni-forms-item>
							<uni-forms-item label="固定传参" labelWidth="68px">
								<uni-easyinput v-model="baseFormData.params" placeholder="请输入固定参数 如 orderStatus = 1;flow = 1 " />
							</uni-forms-item>
							<!-- <uni-forms-item label="结果集" >
								<uni-data-picker v-model="baseFormData.dataContentField" :localdata="dataContentFields" @change="dataContentFieldChange" popup-title="选取结果集字段" :ellipsis="false" ></uni-data-picker>
							</uni-forms-item> -->
							
							<uni-forms :rules="dynamicRules" :model="dynamicFormData" labelWidth="68px">
								<uni-forms-item label="时间字段" name="email">
									<view class="form-item">
										<uni-easyinput v-model="baseFormData.dynamicTable.timeField.one.field" placeholder="请输入时间字段" />
										<uni-data-picker v-model="baseFormData.dynamicTable.timeField.one.opt" :localdata="opts" @change="dataContentFieldChange" popup-title="选取连接方式" :ellipsis="false" style="width: 80px; flex: none;"></uni-data-picker>
										<uni-data-picker v-model="baseFormData.dynamicTable.timeField.one.time" :localdata="paramTimeList" @change="paramTimeListChange" popup-title="选取时间点" :ellipsis="false" ></uni-data-picker>
										<uni-number-box :min="1" :max="1000" :value="baseFormData.dynamicTable.timeField.one.second" style="float: left;" :color="numberBoxProps.paramTime.color" :disabled="numberBoxProps.paramTime.disabled"  width="60" />
									</view>
								</uni-forms-item>
								
								<uni-forms-item v-for="(item,index) in baseFormData.dynamicTable.timeField.array" :key="item.id"
									:label="item.label" :rules="item.rules" :name="['timeFields',index,'value']">
									<view class="form-item">
										<uni-easyinput v-model="baseFormData.dynamicTable.timeField.array[index].field" placeholder="请输入时间字段" />
										<uni-data-picker v-model="baseFormData.dynamicTable.timeField.array[index].opt" :localdata="opts" @change="dataContentFieldChange" popup-title="选取连接方式" :ellipsis="false" style="width: 80px; flex: none;"></uni-data-picker>
										<uni-data-picker v-model="baseFormData.dynamicTable.timeField.array[index].time" :localdata="paramTimeList" @change="paramTimeListChange($event, index)" popup-title="选取时间点" :ellipsis="false"></uni-data-picker>
										<uni-number-box :min="1" :max="1000" :value="baseFormData.dynamicTable.timeField.array[index].second" style="float: left;" :color="numberBoxProps.paramTimes[index].color" :disabled="numberBoxProps.paramTimes[index].disabled"  width="60" />
										<!-- <uni-forms-item label="连接方式" required style="margin-top: 5px;">
										</uni-forms-item>
										<uni-easyinput v-model="dynamicFormData.domains[index].value" placeholder="请输入时间字段" /> -->
										<button class="button" size="mini" type="default" @click="delDynamicTableTimeFields(item.id)">删除</button>
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
							<uni-easyinput type="textarea" v-model="baseFormData.respConstructor" disabled="false"  maxlength="5000" />
						</uni-section>
						<uni-section title="解析结构" type="line">
							<uni-easyinput class="respExplained" auto-height="true" type="textarea" v-html="baseFormData.respExplained" disabled="false"  maxlength="5000" />
						</uni-section>
						
						<view class="uni-container" style="margin-top: 20px;">
							<uni-table ref="table" :loading="loading" border stripe emptyText="暂无更多数据" >
								<uni-tr>
									<uni-th width="4" align="center">序号</uni-th>
									<uni-th width="40" align="center">层级</uni-th>
									<uni-th align="center">字段</uni-th>
									<uni-th width="4" align="center">重命名</uni-th>
								</uni-tr>
								<uni-tr v-for="(entry, index) in baseFormData.respExplainedFormat" :key="index+1">
									<uni-td align="left">{{ index+1 }}</uni-td>
									<uni-td> <view class="name">{{ entry[0] }}</view> </uni-td>
									<uni-td align="left" >{{ entry[1] }}</uni-td>
									<uni-td> <button class="button" size="mini" type="primary" @tap="inputDialogToggle(entry[0], entry[1])" style="margin-left: -1px; " >修改</button> </uni-td>
								</uni-tr>
							</uni-table>
						</view>
					</uni-forms-item>
					
					<uni-forms-item label="取值范围" required>
						<view>
							<uni-data-checkbox v-model="baseFormData.limit" @change="dataLimitChange" :localdata="dataLength" style="float: left;"/>
							<uni-number-box :min="0" :max="100000000" :value="baseFormData.limitNum" style="float: left;" :color="numberBoxProps.limit.color" :disabled="numberBoxProps.limit.disabled"  width="120" />
						</view>
						<view>
							<uni-collapse> 
								<uni-collapse-item title-border="auto" title="——————————————————展开设置分页条件—————————————————— " style="background-color: antiquewhite;" :disabled="pageCondition.disabled" :open="pageCondition.open" :show-animation="false">
									<view class="content">
										<uni-card :is-shadow="false" is-full>
											<text class="uni-h6">【分页条件,字段配置】:涉及表达式时,注 不等于使用 != 而不可使用 ≠ 或 &lt;&gt;  </text>
										</uni-card>
										<uni-card :is-shadow="false" is-full>
											<text class="uni-h6">表达式配置示例为: newField:#fieldA + fieldB|fieldA&fieldB </text>
										</uni-card>
										<uni-card :is-shadow="false" is-full>
											<text class="uni-h6">表达式配置样例为: #nextPage==0|nextPage 或 #pages==pageNum|pages&pageNum</text>
										</uni-card>
										<uni-forms-item label="正常判断" required >
											<uni-easyinput v-model="baseFormData.statusField" placeholder="请输入判断正常条件 如 isSuccess = true 或 #status == 0|status" />
										</uni-forms-item>
										<uni-forms-item label="结果集" required style="margin-top: 5px;">
											<uni-data-picker v-model="baseFormData.dataContentField" :localdata="dataContentFields" @change="dataContentFieldChange" popup-title="选取结果集字段" :ellipsis="false" ></uni-data-picker>
										</uni-forms-item>
										<uni-forms-item label="下一页" required>
											<uni-data-picker v-model="baseFormData.nextPageStrategy" :localdata="nextPageStrategy" @change="nextPageStrategyChange" popup-title="选择" :ellipsis="false" style="float: left; width: 50%; "></uni-data-picker>
											<!-- <uni-number-box :min="0" :max="100000000" :value="baseFormData.retryStrategyTimes" style="float: left; " :color="numberBoxProps.retryStrategy.color" :disabled="numberBoxProps.retryStrategy.disabled"  width="120" /> -->
											
											<uni-easyinput  v-model="baseFormData.nextPageField" style="float: left; width: 50%; display:flow" :placeholder="placeholder.nextPageField" />
										</uni-forms-item>
										<uni-forms-item label="每页取数" required>
											<uni-easyinput v-model="baseFormData.pageNumField" placeholder="请输入每页取数条件 如 pageNum = 200" />
										</uni-forms-item>
										<uni-forms-item label="结束分页" required>
											<uni-easyinput v-model="baseFormData.isLastPageField" placeholder="请输入结束分页条件 如 isLastPage = true 或 #nextPage==0|nextPage" />
										</uni-forms-item>
									</view>
								</uni-collapse-item>
							</uni-collapse>
						</view>
					</uni-forms-item>
					
					<uni-forms-item label="过滤数据" >
						<uni-easyinput v-model="baseFormData.filterCondition" placeholder="请输入过滤条件 如 orderChecked = 1" />
					</uni-forms-item>
					
					<uni-forms-item label="分组聚合" >
						<view>
							<uni-collapse> 
								<!-- <uni-collapse-item  title-border="auto" title="——————————————————展开设置分组聚合条件—————————————————— " style="background-color: antiquewhite;" :disabled="pageCondition.disabled" :open="pageCondition.open" :show-animation="false"> -->
									<uni-forms :model="dynamicFormData" labelWidth="68px">
										<uni-forms-item label="分组字段" name="email">
											<view class="form-item">
												<zxz-uni-data-select v-model="baseFormData.groupField" filterable multiple dataKey="label" dataValue="value"
													:localdata="simpleFields" @change="change"></zxz-uni-data-select>
												<!-- <uni-easyinput v-model="baseFormData.dynamicTable.groupMergeField.one.groupField" placeholder="请输入分组字段 如 shopId,orderType" /> -->
												<view style="font-size: 14px; color: #666; padding: 0 5px 0 15px;">聚合</view>
												<uni-data-picker v-model="baseFormData.dynamicTable.groupMergeField.one.opt" :localdata="mergeStyles" @change="mergeStyleChange" popup-title="选取聚合方式" :ellipsis="false" style="width: 120px; flex: none;" ></uni-data-picker>
												<uni-easyinput v-model="baseFormData.dynamicTable.groupMergeField.one.mergeField" placeholder="请输入聚合字段表达式" />
											</view>
										</uni-forms-item>
										<uni-forms-item v-for="(item,index) in baseFormData.dynamicTable.groupMergeField.array" :key="item.id"
											:label="item.label" :rules="item.rules" :name="['groupMergeFields',index,'value']">
											<view class="form-item">
												<zxz-uni-data-select v-model="baseFormData.dynamicTable.groupMergeField.array[index].groupField" filterable multiple dataKey="label" dataValue="value"
													:localdata="simpleFields" @change="change"></zxz-uni-data-select>
												<!-- <uni-easyinput v-model="baseFormData.dynamicTable.groupMergeField.array[index].groupField" placeholder="请输入分组字段 如 shopId,orderType" /> -->
												<view style="font-size: 14px; color: #666; padding: 0 5px 0 15px;">聚合</view>
												<uni-data-picker v-model="baseFormData.dynamicTable.groupMergeField.array[index].opt" :localdata="mergeStyles" @change="mergeStyleChange($event, index)" popup-title="选取聚合方式" :ellipsis="false"  style="width: 120px; flex: none;"></uni-data-picker>
												<uni-easyinput v-model="baseFormData.dynamicTable.groupMergeField.array[index].mergeField" placeholder="请输入聚合字段表达式" />
												<button class="button" size="mini" type="default" @click="delDynamicTableGroupMergeFields(item.id)">删除</button>
											</view>
										</uni-forms-item>
									</uni-forms>
									<view class="button-group">
										<button type="primary" size="default" @click="addDynamicTableGroupMergeField">新增分组聚合</button>
									</view>
							</uni-collapse>
						</view>
					</uni-forms-item>
					
					<uni-forms-item label="调度示例">
						<uni-data-picker v-model="excuteTimeExample" :localdata="excuteTime" @change="excuteTimeChange" popup-title="查看执行时机示例" :ellipsis="false" ></uni-data-picker>
					</uni-forms-item>
					
					<uni-forms-item label="执行时机" required>
						<view class="uni-list" style="width: 340px; " >
							<view class="uni-list-cell"  >
								<view class="uni-list-cell-left" >
									依需修改
								</view>
								<view class="uni-list-cell-db" >
									<uni-easyinput v-model="baseFormData.excuteTimeCron" @blur="cronCheck" placeholder="请确认 执行时机 cron 表达式" />
								</view>
							</view>
						</view>
					</uni-forms-item>
					
					<uni-forms-item label="重试策略" class="retryStrategy">
						<uni-data-picker v-model="baseFormData.retryStrategy" :localdata="retryStrategy" @change="retryStrategyChange" popup-title="选择" :ellipsis="false" style="float: left; width: 340px; margin-right: 20px;"></uni-data-picker>
						<uni-number-box :min="0" :max="100000000" :value="baseFormData.retryStrategyTimes" style="float: left; " :color="numberBoxProps.retryStrategy.color" :disabled="numberBoxProps.retryStrategy.disabled"  width="120" />
					</uni-forms-item>
					
					<uni-forms-item label="管理" >
						
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
			<uni-popup-message :type="toggleMessage.msgType" :message="toggleMessage.messageText" :duration="2000"></uni-popup-message>
		</uni-popup>
		<!-- 输入框示例 -->
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose"  mode="input" :title="rename.title" :value="rename.value"
				:placeholder="rename.placeholder" @confirm="dialogInputConfirm">
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
    import * as util from '../../../common/util.js'
	
	export default {
		
		
		data() {
			return {
				// 
				simpleFields: [],
				// 输入框-提示信息
				placeholder: {
					nextPageField: '请输入下一页取值条件 如 page:#page + 1|page'
				},
				// 聚合类型
				mergeStyles: [
					{text: 'avg 平均值',	value: 10},
					{text: 'min 最小值',	value: 20},
					{text: 'max 最大值',	value: 30},
					{text: 'sum 累加值',	value: 40},
				],
				// 时间参数
				paramTimeList: [
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
				],
				opts: [
					{text: '>',	value: 10},
					{text: '<',	value: 20},
					{text: '>=',value: 30},
					{text: '<=',value: 40},
					{text: '!=',value: 50},
				],
				pageCondition: {
					disabled: true,
					open: false
				},
				fieldCheck: {
					repeatFieldSet: new Set()
				},
				// 重命名字段弹出框
				rename: {
					title: '格式示例 id=uId,name=uName',
					placeholder: '请输入内容',
					key: '',
					value: ''
				},
				// 执行时机-示例-默认选项
				excuteTimeExample: 7,
				multiIndex: [0, 0, 1],
				numberBoxProps: {
					paramTime: 	 	{color: "#fff",disabled: true,},
					paramTimes:    [{color: "#fff",disabled: true,}],
					limit: 			{color: "#fff",disabled: true,},
					retryStrategy: 	{color: "#fff",disabled: true,},
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
					respExplainedFormat: '',
					method: 'POST',
					limit: 0,
					limitNum: '0',
					nextPageField: '',
					pageNumField: '',
					isLastPageField: '',
					statusField: '',
					dataContentField: '',
					hobby: [5],
					datetimesingle: 1627529992399,
					excuteTime: "7",
					excuteTimeCron: "0 15 10 ? * *",
					retryStrategy: "-1",
					nextPageStrategy: 1,
					retryStrategyTimes: "0",
					skills: 0,
					dynamicTable: {
						timeField: {
							one: {opt:0, time:0, field:''},
							array: []
							// array: [{id: 2, label: '时间字段', opt:2, time:1, field:'',
							// 		rules: [{'required': true, errorMessage: '时间字段必填'}]
							// }]
						},
						groupMergeField: {
							one: {opt:0, time:0, groupField:'', mergeField:''},
							array: []
							// array: [{id: 2, label: '分组字段', opt:2, time:1, groupField:'', mergeField:''}]
						},
					}
				},
				dataContentFields: [],
				// 执行时机
				excuteTime: [
					   {text: '表示每2秒 执行任务		【0/2 * * * * ?】', 											value: 10, cron:'0/2 * * * * ?'}
					     ,{text: '每2分钟 执行任务		【0 0/2 * * * ?】', 											value: 20, cron:'0 0/2 * * * ?'}
					     ,{text: '每月的1日的凌晨2点 执行任务		【0 0 2 1 * ?】', 										value: 30, cron:'0 0 2 1 * ?'}
					     ,{text: '每天上午10点，下午2点，4点 执行任务	【0 0 10,14,16 * *】', 								value: 40, cron:'0 0 10,14,16 * * ?'} 
					     ,{text: '朝九晚五工作时间内每半小时 执行任务	【0 0/30 9-17 * *】', 								value: 50, cron:'0 0/30 9-17 * * ?'} 
					     ,{text: '每天中午12点 执行任务		【0 0 12 * * ?】', 											value: 60, cron:'0 0 12 * * ?'} 
					     ,{text: '每天上午10:15 执行任务		【0 15 10 ? * *】', 										value: 70, cron:'0 15 10 ? * *'} 
					     ,{text: '每天下午2点到下午2:59期间的每1分钟 执行任务		【0 * 14 * * ?】', 						value: 80, cron:'0 * 14 * * ?'} 
					     ,{text: '每天下午2点到下午2:55期间的每5分钟 执行任务		【0 0/5 14 * * ?】', 					value: 90, cron:'0 0/5 14 * * ?'} 
					     ,{text: '每天下午2点到2:55期间和下午6点到6:55期间的每5分钟 执行任务		【0 0/5 14,18 * * ?】', value: 100, cron:'0 0/5 14,18 * * ?'} 
					     ,{text: '每天下午2点到下午2:05期间的每1分钟 执行任务		【0 0-5 14 * * ?】', 					value: 110, cron:'0 0-5 14 * * ?'} 
					     ,{text: '每月15日上午10:15 执行任务		【0 15 10 15 * ?】', 									value: 120, cron:'0 15 10 15 * ?'} 
					     ,{text: '每月最后一日的上午10:15 执行任务		【0 15 10 L * ?】', 							value: 130, cron:'0 15 10 L * ?'} 
					     ,{text: '每个星期三中午12点 执行任务		【0 0 12 ? * WED】', 									value: 140, cron:'0 0 12 ? * WED'} 
					     ,{text: '每年三月的星期三的下午2:10和2:44 执行任务		【0 10,44 14 ? 3 WED】', 				value: 150, cron:'0 10,44 14 ? 3 WED'} 
					     ,{text: '周一至周五的上午10:15 执行任务		【0 15 10 ? * MON-FRI】', 							value: 160, cron:'0 15 10 ? * MON-FRI'} 
					     ,{text: '每月的最后一个星期五上午10:15 执行任务		【0 15 10 ? * 6L】', 						value: 170, cron:'0 15 10 ? * 6L'} 
					     ,{text: '每月的第三个星期五上午10:15 执行任务		【0 15 10 ? * 6#3】', 						value: 180, cron:'0 15 10 ? * 6#3'}
				],
				nextPageStrategy:[{text: '递增页号',value: 10},{text: '指针顺取',value: 20}],
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
				// 预先提醒-重试暂停
				preRemind: [
					{value: 0,text: "编程",children:{	}},
					{value: 1,text: "绘画"},
					{value: 2,text: "运动"},
				],
				// 表单数据
				alignmentFormData: {
					name: '',
					age: '',
				},
				// 单选数据源
				reqMethod: [// 默认选项，在data中设置
					{text: 'POST',value: 'POST',},{text: 'GET',value: 'GET'},{text: '其他',value: '其他'}],
				// 单选数据源
				dataLength: [// 默认选项，在data中设置
					{text: '分页全取',value: 0},{text: '取1条',value: 1},{text: '取指定数量',value: 2}],
				// 多选数据源
				hobbys: [
					{text: '跑步',value: 0}, {text: '游泳',value: 1}, {text: '绘画',value: 2}, {text: '足球',value: 3}, {text: '篮球',value: 4}, {text: '其他',value: 5}],
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
					name: {rules: [{	required: true,	errorMessage: '接口名称不能为空'}]},
					url: {rules: [{	required: true,	errorMessage: 'Url 不能为空'}]
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
					name: {rules: [{	required: true,	errorMessage: '接口名称不能为空'}]},
					url: {rules: [{	required: true,	errorMessage: 'Url 不能为空'}]
					}

				},
				dynamicFormData: {
					email: '',
					domains: []
				},
				dynamicLists: [],
				dynamicRules: {
					email: {rules: [{	required: true,	errorMessage: '域名不能为空'}, {	format: 'email',	errorMessage: '域名格式错误'}]
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
		onLoad() {
			this.getData(1)
			// 取指定数量 的显示隐藏 设置
			let selectVal =  this.baseFormData.limit 
			if(selectVal == 0){
				this.pageCondition.disabled=false
				this.pageCondition.open=true
			}else{
				this.pageCondition.disabled=true
				this.pageCondition.open=false
			}
			
			// dataContentField: 'content.list'
		},
		onReady() {
		},
		methods: {
			switchChange(){
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
				console.log("修后的val:", val)
				this.fieldCheck.repeatFieldSet
				this.baseFormData.respExplainedFormat.set(this.rename.key, val)
				// 关闭窗口后，恢复默认内容
				this.$refs.inputDialog.close()
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
			onClickItem(e) {
				console.log(e);
				this.current = e.currentIndex
			},
			addDynamicTableTimeField() {
				// 添加字段输入框
				this.baseFormData.dynamicTable.timeField.array.push({
					label: '时间字段',
					value: '',
					opt:0, 
					time:0, 
					field:'',
					rules: [{
						'required': true,
						errorMessage: '域名项必填'
					}],
					id: Date.now()
				});
				// 添加数字输入框
				this.numberBoxProps.paramTimes.push({color: "#fff",disabled: true})
			},
			addDynamicTableGroupMergeField() {
				// 添加字段输入框
				this.baseFormData.dynamicTable.groupMergeField.array.push({
					label: '分组字段',
					value: '',
					opt:0, 
					time:0, 
					groupField:'',
					mergeField:'',
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
			paramTimeListChange(e, index){
				const selectVal = e.detail.value[0].value
				console.log("e.detail.value:", selectVal)
				console.log("index:", index)
				if(index == undefined){
					if(selectVal == 30 || selectVal == 50 || selectVal == 70 || selectVal == 90 || selectVal == 110){
						// 选中了 “取指定数量” ，需要指定数量
						this.numberBoxProps.paramTime.color = "#000",
						this.numberBoxProps.paramTime.disabled = false
						this.baseFormData.paramTime = selectVal
					}else{
						this.numberBoxProps.paramTime.color = "#fff"
						this.numberBoxProps.paramTime.disabled = true
					}
				}else{
					if(selectVal == 30 || selectVal == 50 || selectVal == 70 || selectVal == 90 || selectVal == 110){
						// 选中了 “取指定数量” ，需要指定数量
						this.numberBoxProps.paramTimes[index].color = "#000",
						this.numberBoxProps.paramTimes[index].disabled = false
						this.baseFormData.paramTimes[index] = selectVal
					}else{
						this.numberBoxProps.paramTimes[index].color = "#fff"
						this.numberBoxProps.paramTimes[index].disabled = true
					}
				}
				
			},
			// 取值范围
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
				if(selectVal == 0){
					this.pageCondition.disabled=false
					this.pageCondition.open=true
				}else{
					this.pageCondition.disabled=true
					this.pageCondition.open=false
				}
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
			nextPageStrategyChange(e){
				const selectVal = e.detail.value[0].value
				// 1-递增页号;2-指针顺取
				if(selectVal == 1){ // '请输入下一页取值条件 如 page = page + 1 或 startId = id '
					this.placeholder.nextPageField = '请输入下一页取值条件 如 page:#page + 1|page'
				}else{
					this.placeholder.nextPageField = '请输入下一页取值条件 如 startId = id'
				}
				// this.$forceUpdate()  // 强制组件重新渲染
				console.log('e:',selectVal);
			},
			jsonDataVolid(){
				const msg = "JSON 格式检查："
				this.dataContentFields = []		// 清空，待结构识别后，重新设置
				if(this.checkJSON(this.baseFormData.introduction)){
					this.messageToggle('success', msg + '通过！')
					this.baseFormData.respConstructor = this.baseFormData.introduction
					// 手动增加一条全取选项
					this.dataContentFields.push({text: '全取', value: ''}) 
					// 数据字段没回显时，默认选中第一个
					if(!this.baseFormData.dataContentField) this.baseFormData.dataContentField = this.dataContentFields[0].value
					
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
					const rspJSON = JSON.parse(x);
					this.dataVolid.respJsonFormat = true
					console.log('json格式检查：通过 '+ this.dataVolid.respJsonFormat)
					const respExplained = this.explainRsp(rspJSON)
					let respExplainedStr = this.mapToString(respExplained)
					// this.baseFormData.respExplainedFormat = respExplainedStr
					// this.baseFormData.respExplained = this.mapValueRed(respExplained)
					this.baseFormData.respExplained = respExplainedStr
					this.baseFormData.respExplainedFormat = this.mapReverse(respExplained)
					// this.baseFormData.respExplainedFormat = this.mapValueRed(respExplained)
					console.log('this.baseFormData.respExplained：'+ respExplainedStr)
					return true
				} catch (e) {
					// 不是严格的 JSON 格式
					this.dataVolid.respJsonFormat = false
					console.log('json格式检查：未通过 '+ this.dataVolid.respJsonFormat)
					return false
				}
			},
			explainRsp(rspJSON){
				let respExplained = new Map();
				const allFieldSet = new Set();
				const repeatFieldSet = new Set();
				if(Array.isArray(rspJSON)){
					this.handleJSONArray(respExplained, allFieldSet, repeatFieldSet, 0, null, rspJSON);
				}else{
					this.handleJSON(respExplained, allFieldSet, repeatFieldSet, 0, null, rspJSON);
				}
				this.fieldCheck.repeatFieldSet = repeatFieldSet
				// console.log("respExplained:", Object.fromEntries(Array.from(respExplained)))
				return respExplained;
			},
			// map数据进行逆序
			mapReverse(map){
				// 将Map转换为数组
				let mapArray = Array.from(map);
				// 逆序数组
				mapArray.reverse();
				// 将逆序后的数组转换回Map
				return new Map(mapArray);
			},
			mapToString(map){
				// let html = '<span style="border: 1px solid #DCDFE6; border-radius: 4px;width:100%;hight:100%;">'
				let str = '';
				for(const [key,value] of map) {
					str = `${key}: ${this.fieldRed(value)}<br>` + str;
				}
				// return html + str +"</span>";
				return str;
			},
			mapValueRed(map){
				let newMap = new Map()
				for(const [key,value] of map) {
					 newMap.set(key, this.fieldRed(value))
				}
				return newMap
			},
			// 将 重名的字段 标红处理
			fieldRed(value){
				var arr = value.split(",")
				let str = '';
				for(let e of arr){
					if(this.fieldCheck.repeatFieldSet.has(e)){
						e = `<span style="color:red">`+e+ `</span>`
					}
					if(str=='') {
						str += e
					}else{
						str += (','+e)
					}
				}
				return str;
			},
			
			handleJSONArray(respExplained, allFieldSet, repeatFieldSet, cycle, parentKey, jsonArray){
				// jsonArray.forEach(itemJson => {
				// 	this.handleJSON(respExplained, allFieldSet, repeatFieldSet, cycle, parentKey, itemJson);
				// });
				
				// JSONArray 只取第一个对象进行属性取值
				this.handleJSON(respExplained, allFieldSet, repeatFieldSet, cycle, parentKey, jsonArray[0]);
			},
			handleJSON(respExplained, allFieldSet, repeatFieldSet, cycle, parentKey, jsonData){
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
						case util.JsonValueDataTypeEnum.SINGLE_VALUE:
							// console.log("判断为 singleValue")
							if(allFieldSet.has(jsonKey)) repeatFieldSet.add(jsonKey)
							allFieldSet.add(jsonKey)
							if(str=='') {
								str += jsonKey
							}else{
								str += (','+jsonKey)
							}
							this.simpleFields.push({label:jsonKey, value:jsonKey})
							break;
						
						case util.JsonValueDataTypeEnum.JSON_ARRAY:
							// console.log("判断为 jsonArray")
							if(array=='') {
								array += jsonKey
							}else{
								array += (','+jsonKey)
							}
							// 数据字段，填充下来列表
							this.dataContentFields.push({text: jsonKey, value: jsonKey})
							this.handleJSONArray(respExplained, allFieldSet, repeatFieldSet, cycle, jsonKey, jsonValue);
							break;
							
						case util.JsonValueDataTypeEnum.JSON_OBJECT:
							// console.log("判断为 jsonObject")
							if(entity=='') {
								entity += jsonKey
							}else{
								entity += (','+jsonKey)
							}
							this.handleJSON(respExplained, allFieldSet, repeatFieldSet, cycle, jsonKey, jsonValue);
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
		
			// 获取数据
			getData(pageCurrent, value = '') {
				this.table.loading = true
				this.table.pageCurrent = pageCurrent
				this.request({
					pageSize: this.table.pageSize,
					pageCurrent: pageCurrent,
					value: value,
					success: res => {
						// console.log('data', res);
						this.table.tableData = res.data
						this.table.total = res.total
						this.table.loading = false
					}
				})
			},
			// 伪request请求
			request(options) {
				const { pageSize, pageCurrent, success, value } = options
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
	.button{
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




