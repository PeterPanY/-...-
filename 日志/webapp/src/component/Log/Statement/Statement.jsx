import React from 'react';
import echarts from 'echarts';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import ajax from '../../../common/ajax';
import { Button, Icon, DatePicker, Modal, Card, Form, Table, Checkbox, Radio } from 'antd';
import '../Search/Search.css';
import { fileLoads } from '../../../common/fileUploads';



const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;


let Statement = React.createClass({
	getInitialState() {
		return ({
			onlineReportData: [{
				name: '数据连接中...',
				value: 1
			}],
			busData: [{
				name: '数据连接中...',
				value: 1
			}],
			legendName: [],
			checkData: [],
			busChecked: true,
			value: 2,
			busArr: [],
			checkDisabled: true,
			allChecked: true,
			searchDisabled: true,
			searchArr: [],
			columns: [
				{ title: "服务名称", width: "33.3%", dataIndex: "serviceName" },
				{
					title: "上下线", width: "33.3%", dataIndex: "svOnline", render: (
						function (text, record) {
							if (text == '0') {
								return <span>下线</span>
							} else if (text == '1') {
								return <span>上线</span>
							}
						}
					)
				},
				{ title: "更新时间", width: "33.3%", dataIndex: "onlineUpdateTime" }
			],
			busColumns: [
				{ title: "业务", width: "33.3%", dataIndex: "business.businessName" },
				{ title: "服务名称", width: "33.3%", dataIndex: "serviceName" },
				{ title: "更新时间", width: "33.3%", dataIndex: "busUpdateTime" },
			],
			visible: false
		})
	},
	/* 转换时间个格式*/
	timeFormat: function (da) {
		da = new Date(da);
		var year = da.getFullYear();
		var month = da.getMonth() + 1;
		var date = da.getDate();
		return ([year, month, date].join('-'));
	},
	// 上下线情况
	onlineReport() {
		let _this = this
		ajax({
			url: 'onlineReport.do',
			type: 'post',
			success(res) {
				if (res.ret == "SUCCESS") {
					// console.log(res)
					let onlineReportData = []
					for (let i = 0; i < res.data.length; i++) {
						if (res.data[i].name == 1) {
							onlineReportData.push({
								name: '上线',
								value: res.data[i].value
							})
						} else {
							onlineReportData.push({
								name: '下线',
								value: res.data[i].value
							})
						}
					}
					_this.setState({
						onlineReportData: onlineReportData
					})
					_this.onlineEcharts()
				} else {
					Modal.error({
						title: '服务器错误，获取数据失败'
					});
				}
			},
			error() {
				Modal.error({
					title: '服务器错误'
				});
			}
		})
		// console.log(_this.state.onlineReportData)

	},
	// 上下线饼图
	onlineEcharts() {
		let _this = this
		let onlineChart = echarts.init(document.getElementById('leftmian'));
		let option = {
			title: {
				text: '服务上下线数据统计',
				subtext: '数据来源于服务上下线统计',
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				data: ['上线', '下线']
			},
			toolbox: {
				feature: {
					saveAsImage: {}
				}
			},
			series: [
				{
					name: '上下线具体情况',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					// label: {
					// 	normal: {
					// 		formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
					// 		backgroundColor: '#eee',
					// 		borderColor: '#aaa',
					// 		borderWidth: 1,
					// 		borderRadius: 4,
					// 		// shadowBlur:3,
					// 		// shadowOffsetX: 2,
					// 		// shadowOffsetY: 2,
					// 		// shadowColor: '#999',
					// 		// padding: [0, 7],
					// 		rich: {
					// 			a: {
					// 				color: '#999',
					// 				lineHeight: 22,
					// 				align: 'center'
					// 			},
					// 			abg: {
					// 				backgroundColor: '#333',
					// 				width: '100%',
					// 				align: 'right',
					// 				height: 22,
					// 				borderRadius: [4, 4, 0, 0]
					// 			},
					// 			hr: {
					// 				borderColor: '#aaa',
					// 				width: '100%',
					// 				borderWidth: 0.5,
					// 				height: 0
					// 			},
					// 			b: {
					// 				fontSize: 16,
					// 				lineHeight: 33
					// 			},
					// 			per: {
					// 				color: '#eee',
					// 				backgroundColor: '#334455',
					// 				padding: [2, 4],
					// 				borderRadius: 2
					// 			}
					// 		}
					// 	}
					// },
					data: _this.state.onlineReportData,
					// itemStyle: {
					// 	emphasis: {
					// 		shadowBlur: 10,
					// 		shadowOffsetX: 0,
					// 		shadowColor: 'rgba(0, 0, 0, 0.5)'
					// 	}
					// }
				}
			]
		};
		// 使用刚指定的配置项和数据显示图表。
		onlineChart.setOption(option);
		onlineChart.on('click', function (param) {

			// console.log(param);//这里根据param填写你的跳转逻辑
			let onlineValue
			if (param.name == '上线') {
				onlineValue = 1
			} else {
				onlineValue = 0
			}
			_this.setState({
				onlineValue: onlineValue,
				busValue: undefined
			})
			_this.handleSearch()
		});
	},
	// 业务情况
	businessReport() {
		let _this = this
		ajax({
			url: 'businessReport.do',
			type: 'post',
			success(res) {
				// console.log(res)
				if (res.ret == "SUCCESS") {
					let legendName = []
					for (let i = 0; i < res.data.length; i++) {
						legendName.push(res.data[i].name)
					}
					_this.setState({
						checkData: res.data,
						busData: res.data,
						legendName: legendName
					})
					_this.busEcharts()
				} else {
					Modal.error({
						title: '服务器错误，获取数据失败'
					});
				}
			},
			error() {
				Modal.error({
					title: '服务器错误'
				});
			}
		})

	},
	// 业务饼图
	busEcharts() {
		let _this = this
		// console.log(legendName)
		let businessChart = echarts.init(document.getElementById('rightmian'));
		let option = {
			title: {
				text: '服务业务数据统计',
				subtext: '数据来源于服务业务统计',
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				data: _this.state.legendName
			},
			toolbox: {
				feature: {
					saveAsImage: {}
				}
			},
			series: [
				{
					name: '业务具体情况',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					// label: {
					// 	normal: {
					// 		formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
					// 		backgroundColor: '#eee',
					// 		borderColor: '#aaa',
					// 		borderWidth: 1,
					// 		borderRadius: 4,
					// 		rich: {
					// 			a: {
					// 				color: '#999',
					// 				lineHeight: 22,
					// 				align: 'center'
					// 			},
					// 			abg: {
					// 				backgroundColor: '#333',
					// 				width: '100%',
					// 				align: 'right',
					// 				height: 22,
					// 				borderRadius: [4, 4, 0, 0]
					// 			},
					// 			hr: {
					// 				borderColor: '#aaa',
					// 				width: '100%',
					// 				borderWidth: 0.5,
					// 				height: 0
					// 			},
					// 			b: {
					// 				fontSize: 16,
					// 				lineHeight: 33
					// 			},
					// 			per: {
					// 				color: '#eee',
					// 				backgroundColor: '#334455',
					// 				padding: [2, 4],
					// 				borderRadius: 2
					// 			}
					// 		}
					// 	}
					// },
					data: _this.state.busData,
					// itemStyle: {
					// 	emphasis: {
					// 		shadowBlur: 10,
					// 		shadowOffsetX: 0,
					// 		shadowColor: 'rgba(0, 0, 0, 0.5)'
					// 	}
					// }
				}
			]
		};
		// 使用刚指定的配置项和数据显示图表。
		businessChart.setOption(option);

		businessChart.on('click', function (param) {

			// console.log(param);//这里根据param填写你的跳转逻辑
			_this.setState({
				onlineValue: undefined,
				busValue: param.data.mark
			})
			_this.busHandleSearch()
		});
	},
	componentDidMount() {
		this.onlineEcharts()
		this.busEcharts()
		this.onlineReport()
		this.businessReport()
		this.handleSearch()
		this.busHandleSearch()
		this.onlineLineStack()
		this.onlineTimeReport()
	},
	//上下线搜索
	handleSearch() {
		let _this = this;
		this.setState({
			searchOnline: this.state.onlineValue,
			business: { businessName: this.state.busValue }
		});
		let data = {
			curPage: 1,
			obj: {
				svOnline: this.state.onlineValue,
				business: { businessName: this.state.busValue },
			}
		};
		// console.log(data);
		this.setState({
			loading: true
		});
		ajax({
			url: 'getServiceList.do',
			type: 'post',
			data: data,
			success: function (res) {
				// console.log(res)
				_this.setState({
					loading: false
				});
				if (res.ret == 'SUCCESS') {
					let pagination = {
						total: res.data.rowCount,
						showTotal: function () {
							return ('共' + res.data.rowCount + '条')
						},
						pageSize: res.data.pageSize,
						current: 1,
						onChange(current) {
							_this.handlePageChange(current, searchUrl)
						}
					};
					let searchDataArr = res.data.data || []
					for (var i = 0; i < searchDataArr.length; i++) {
						searchDataArr[i].onlineUpdateTime = _this.timeFormat(searchDataArr[i].svUpdateTime)
					}
					_this.setState({
						data: searchDataArr,
						pagination: pagination,
						selectedRowKeys: []
					});
				} else {
					Modal.warning({
						title: '没有搜索到你所查的方法，请检查是否输入错误'
					});
				}
			},
			error() {
				_this.setState({
					loading: false
				});
				Modal.error({
					title: '服务连接失败'
				});
			}
		})

	},
	/*上下线点击分页*/
	handlePageChange: function (current) {
		let _this = this;
		let data = {
			curPage: current,
			obj: {
				svOnline: this.state.searchOnline,
				business: this.state.business,
			}
		};
		this.setState({
			loading: true
		});
		ajax({
			url: 'getServiceList.do',
			type: 'post',
			data: data,
			success: function (res) {
				_this.setState({
					loading: false
				});
				if (res.ret == 'SUCCESS') {
					let pagination = {
						total: res.data.rowCount,
						showTotal: function () {
							return ('共' + res.data.rowCount + '条')
						},
						pageSize: res.data.pageSize,
						current: res.data.curPage,
						onChange(current) {
							_this.handlePageChange(current, searchUrl)
						}
					};
					let dataLog = res.data.data || []
					for (var i = 0; i < dataLog.length; i++) {
						dataLog[i].onlineUpdateTime = _this.timeFormat(dataLog[i].svUpdateTime)
					}
					_this.setState({
						data: res.data.data,
						pagination: pagination,
						selectedRowKeys: []
					});
				} else {
					Modal.error({
						title: '系统错误',
					});
				}
			},
			error: function (err) {
				Modal.error({
					title: '服务器错误'
				});
			}
		})

	},
	//业务搜索
	busHandleSearch() {
		let _this = this;
		this.setState({
			searchOnline: this.state.onlineValue,
			business: { businessId: this.state.busValue }
		});
		let data = {
			curPage: 1,
			obj: {
				svOnline: this.state.onlineValue,
				business: { businessId: this.state.busValue },
			}
		};
		// console.log(data);
		this.setState({
			busLoading: true
		});
		ajax({
			url: 'getServiceList.do',
			type: 'post',
			data: data,
			success: function (res) {
				// console.log(res)
				_this.setState({
					busLoading: false
				});
				if (res.ret == 'SUCCESS') {
					let busPagination = {
						total: res.data.rowCount,
						showTotal: function () {
							return ('共' + res.data.rowCount + '条')
						},
						pageSize: res.data.pageSize,
						current: 1,
						onChange(current) {
							_this.busHandlePageChange(current)
						}
					};
					let searchDataArr = res.data.data || []
					for (var i = 0; i < searchDataArr.length; i++) {
						searchDataArr[i].busUpdateTime = _this.timeFormat(searchDataArr[i].svUpdateTime)
					}
					_this.setState({
						businessData: searchDataArr,
						busPagination: busPagination,
						selectedRowKeys: []
					});
				} else {
					Modal.warning({
						title: '没有搜索到你所查的方法，请检查是否输入错误'
					});
				}
			},
			error() {
				_this.setState({
					busLoading: false
				});
				Modal.error({
					title: '服务连接失败'
				});
			}
		})

	},
	/*业务点击分页*/
	busHandlePageChange: function (current) {
		let _this = this;
		let data = {
			curPage: current,
			obj: {
				svOnline: this.state.searchOnline,
				business: this.state.business,
			}
		};
		this.setState({
			loading: true
		});
		ajax({
			url: 'getServiceList.do',
			type: 'post',
			data: data,
			success: function (res) {
				_this.setState({
					loading: false
				});
				if (res.ret == 'SUCCESS') {
					let busPagination = {
						total: res.data.rowCount,
						showTotal: function () {
							return ('共' + res.data.rowCount + '条')
						},
						pageSize: res.data.pageSize,
						current: res.data.curPage,
						onChange(current) {
							_this.busHandlePageChange(current)
						}
					};
					let dataLog = res.data.data || []
					for (var i = 0; i < dataLog.length; i++) {
						dataLog[i].busUpdateTime = _this.timeFormat(dataLog[i].svUpdateTime)
					}
					_this.setState({
						businessData: res.data.data,
						busPagination: busPagination,
						selectedRowKeys: []
					});
				} else {
					Modal.error({
						title: '系统错误',
					});
				}
			},
			error: function (err) {
				Modal.error({
					title: '服务器错误'
				});
			}
		})

	},
	// 显示上下线
	onlineClick() {
		let _this = this
		this.setState({
			onlineValue: undefined,
			busValue: undefined
		})
		setTimeout(function () {
			_this.handleSearch()
		}, 40);
	},
	// 显示业务
	businessClick() {
		let _this = this
		this.setState({
			onlineValue: undefined,
			busValue: undefined
		})
		setTimeout(function () {
			_this.busHandleSearch()
		}, 40);
	},
	//业务上下线数据
	onlineTimeReport() {
		let _this = this
		ajax({
			url: 'timeReport.do',
			type: 'post',
			success(res) {
				// console.log(res)
				if (res.ret == "SUCCESS") {
					let busOnlineData = []
					let onlineData = []
					let nonlineData = []
					for (let i = 0; i < res.data.length; i++) {
						busOnlineData.push(res.data[i].mark)
						onlineData.push(res.data[i].online)
						nonlineData.push(res.data[i].nonline)
					}
					// console.log(busOnlineData)
					// console.log(onlineData)
					// console.log(nonlineData)
					_this.setState({
						busOnlineData: busOnlineData,
						onlineData: onlineData,
						nonlineData: nonlineData
					})
					_this.onlineLineStack()
				} else {
					Modal.error({
						title: '服务器错误，获取数据失败'
					});
				}
			},
			error() {
				Modal.error({
					title: '服务器错误'
				});
			}
		})
	},
	// 业务上下线折现图
	onlineLineStack() {
		let _this = this
		let businessChart = echarts.init(document.getElementById('leftLineStack'));
		let option = {
			title: {
				text: '业务上下线堆叠折线图'
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					label: {
						backgroundColor: '#6a7985'
					}
				}
			},
			legend: {
				data: ['上线', '下线']
			},
			grid: {
				left: '3%',
				right: '4%',
				bottom: '3%',
				containLabel: true
			},
			toolbox: {
				feature: {
					dataView: { readOnly: false },
					magicType: { type: ['line', 'bar'] },
					saveAsImage: {}
				}
			},
			xAxis: {
				type: 'category',
				boundaryGap: true,
				data: _this.state.busOnlineData
			},
			yAxis: {
				type: 'value'
			},
			series: [
				{
					name: '上线',
					type: 'bar',
					stack: '总量',
					label: {
						normal: {
							show: true,
							position: 'inside'
						}
					},
					areaStyle: { normal: {} },
					data: _this.state.onlineData
				},
				{
					name: '下线',
					type: 'bar',
					stack: '总量',
					label: {
						normal: {
							show: true,
							position: 'inside'
						}
					},
					areaStyle: { normal: {} },
					data: _this.state.nonlineData
				}
			]
		};
		businessChart.setOption(option);
	},
	// 导出报表
	exportStatement() {
		this.setState({
			visible: true
		})
	},
	// 取消导出报表选择
	handerCancel() {
		this.setState({
			visible: false
		})
	},
	// 业务选择
	busOnChange(id, e) {
		if (id == 'busC') {
			this.setState({
				busChecked: e.target.checked,
			});
			if (e.target.checked) {
				this.setState({
					checkDisabled: true
				})
			} else {
				this.setState({
					checkDisabled: false
				})
			}
			return
		}
		let busArrData = this.state.busArr

		if (busArrData.length) {
			let flag = true
			for (let i = 0; i < busArrData.length; i++) {
				if (busArrData[i].id == id) {
					busArrData[i].checked = e.target.checked
					flag = false
				}
			}
			if (flag) {
				let busObj = {}
				busObj.id = id
				busObj.checked = e.target.checked
				busArrData.push(busObj)
			}

		} else {
			let busObj = {}
			busObj.id = id
			busObj.checked = e.target.checked
			busArrData.push(busObj)
		}

		this.setState({
			busArrData: busArrData
		});

		console.log(busArrData)

		let flag = true
		for (let j = 0; j < busArrData.length; j++) {
			if (busArrData[j].checked == true) {
				this.setState({
					busChecked: false,
				});
				flag = false
				return
			}
		}
		if (flag) {
			this.setState({
				busChecked: true,
				checkDisabled: true
			});
		}


	},
	// 上线线选择
	onlineOnChange(e) {
		console.log('radio checked', e.target.value);
		this.setState({
			value: e.target.value,

		});
	},
	// 其他选项
	searchOnchange(name, e) {
		if (name == 'search') {
			this.setState({
				allChecked: e.target.checked,
			});
			if (e.target.checked) {
				this.setState({
					searchDisabled: true
				})
			} else {
				this.setState({
					searchDisabled: false
				})
			}
			return
		}
		let searchArrData = this.state.searchArr
		if (searchArrData.length > 0) {
			let flag = true
			for (let i = 0; i < searchArrData.length; i++) {
				console.log(searchArrData[i].value == e.target.value)
				if (searchArrData[i].value == e.target.value) {
					searchArrData.splice(i, 1)
					flag = false
				}

			}
			if (flag) {
				searchArrData.push({
					key: name,
					value: e.target.value
				})
			}

		} else {
			searchArrData.push({
				key: name,
				value: e.target.value
			})
		}
		if (!searchArrData.length) {
			this.setState({
				allChecked: true,
				searchDisabled: true
			})
		}
		this.setState({
			searchArrData: searchArrData
		})
		console.log(searchArrData)
	},
	// 确定下载
	handerOk() {

		// 业务准备
		let busData = undefined
		if (this.state.busChecked) {
			busData = undefined
		} else {
			busData = []
			let busCheckedArr = this.state.busArrData
			for (var i = 0; i < busCheckedArr.length; i++) {
				if (busCheckedArr[i].checked) {
					busData.push(busCheckedArr[i].id)
				}
			}
			
		}
		// console.log(busData)
		// 上下线准备
		let onlineData
		if (this.state.value == 2) {
			onlineData = undefined
		} else {
			onlineData = this.state.value
		}
		// console.log(onlineData)
		//其他准备
		let searchData
		if (this.state.allChecked) {
			searchData = {
				serviceName: '服务名字',
				svDescr: '服务描述',
				managerName: '服务负责人',
				managerPhone: '负责人电话',
				company: '所属公司',
				systemVersion: '操作系统版本',
				svIp: '服务器Ip',
				svUrl: '服务地址',
				svVersion: '服务版本号',
				svDb: '数据库参数',
				svCpu: 'cpu性能',
				svMemery: '内存需求',
				svDisk: '硬盘需求'
			}

		} else {
			let searchCheckedArr = this.state.searchArrData
			console.log(searchCheckedArr)
			searchData = {}
			for (let i = 0; i < searchCheckedArr.length; i++) {

				searchData[searchCheckedArr[i].value] = searchCheckedArr[i].key
			}
		}
		let downloadData = {
			businessIds: busData,
			online: onlineData,
			columns: searchData
		}
		console.log(downloadData)
		let _this = this
		this.setState({
			// loading: true
		})
		// ajax({
		// 	url: 'reportDownload.do',
		// 	type: 'post',
		// 	data: downloadData,
		// 	success(res) {
		// 		_this.setState({
		// 			// loading: false
		// 		})
		// 		console.log(res)
		// 	}
		// 
		let downloadDa = JSON.stringify(downloadData)
		console.log(downloadDa)
		var url = "http://192.168.0.123:8080/srm/reportDownload.do";
		var data = downloadDa;
		var form = $("<form></form>").attr("action", url).attr("method", "post");
		form.append($("<input></input>").attr("type", "hidden").attr("name", "data").attr("value", data));
		form.appendTo('body').submit().remove();
		this.setState({
			visible: false
		})
	},
	render() {
		let _this = this
		// console.log(this.state.busData)
		const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 7 },
			wrapperCol: { span: 14 },
		};
		return (
			<div className='statement'>
				<Button className='statBtn' type="primary" onClick={this.exportStatement}>导出报表</Button>
				<div className="statement-top" style={{ height: 400 }}>
					<div id="leftmian" style={{ width: '40%', height: 400, float: 'left', marginLeft: '5%' }}></div>
					<div id="rightmian" style={{ width: '40%', height: 400, float: 'right', marginRight: '5%' }}></div>
				</div>
				<div className="clearfix">
					<Card title="上下线详情数据表"
						extra={<a href="javascript:;"><span onClick={this.onlineClick}>显示全部</span></a>}
						style={{ width: '40%', float: 'left', marginLeft: '5%' }}>
						<Table className="logSearchTable"
							columns={this.state.columns}
							dataSource={this.state.data}
							pagination={this.state.pagination}
							loading={this.state.loading}
							size="middle" bordered />
					</Card>
					<Card title="业务详情数据表"
						extra={<a href="javascript:;" onClick={this.businessClick}>显示全部</a>}
						style={{ width: '40%', float: 'right', marginRight: '5%' }}>
						<Table className="logSearchTable"
							columns={this.state.busColumns}
							dataSource={this.state.businessData}
							pagination={this.state.busPagination}
							loading={this.state.busLoading}
							size="middle" bordered />
					</Card>
				</div>
				<div id="leftLineStack"></div>
				{/* 导出报表模态框 */}
				<Modal
					title="导出报表选择"
					wrapClassName="vertical-center-modal"
					visible={this.state.visible}
					onOk={this.handerOk}
					onCancel={this.handerCancel}
				>
					<Form horizontal>
						<FormItem {...formItemLayout} label="业务选择">
							<Checkbox checked={this.state.busChecked} onChange={this.busOnChange.bind(null, 'busC')}>全部</Checkbox>
							{
								this.state.checkData.map(function (item, index) {
									return <Checkbox onChange={_this.busOnChange.bind(null, item.mark)} disabled={_this.state.checkDisabled} key={index}>{item.name}</Checkbox>
								})
							}
						</FormItem>
						<FormItem {...formItemLayout} label="上下线选择">
							<RadioGroup onChange={this.onlineOnChange} value={this.state.value}>
								<Radio key="a" value={2}>全部</Radio>
								<Radio key="1" value={1}>上线</Radio>
								<Radio key="0" value={0}>下线</Radio>
							</RadioGroup>
						</FormItem>
						<FormItem {...formItemLayout} label="其他选择">
							<Checkbox checked={this.state.allChecked} onChange={this.searchOnchange.bind(null, 'search')}>全部</Checkbox>
							<Checkbox disabled={this.state.searchDisabled} value='serviceName' onChange={this.searchOnchange.bind(null, '服务名字')}>服务名字</Checkbox>
							<Checkbox disabled={this.state.searchDisabled} value='svDescr' onChange={this.searchOnchange.bind(null, '服务描述')}>服务描述</Checkbox>
							<Checkbox disabled={this.state.searchDisabled} value='managerName' onChange={this.searchOnchange.bind(null, '服务负责人')}>服务负责人</Checkbox>
							<Checkbox disabled={this.state.searchDisabled} value='managerPhone' onChange={this.searchOnchange.bind(null, '负责人电话')}>负责人电话</Checkbox>
							<Checkbox disabled={this.state.searchDisabled} value='company' onChange={this.searchOnchange.bind(null, '所属公司')}>所属公司</Checkbox>
							<Checkbox disabled={this.state.searchDisabled} value='systemVersion' onChange={this.searchOnchange.bind(null, '操作系统版本')}>操作系统版本</Checkbox>
							<Checkbox disabled={this.state.searchDisabled} value='svIp' onChange={this.searchOnchange.bind(null, '服务器Ip')}>服务器ip</Checkbox>
							<Checkbox disabled={this.state.searchDisabled} value='svUrl' onChange={this.searchOnchange.bind(null, '服务地址')}>服务地址</Checkbox>
							<Checkbox disabled={this.state.searchDisabled} value='svVersion' onChange={this.searchOnchange.bind(null, '服务版本号')}>服务版本号</Checkbox>
							<Checkbox disabled={this.state.searchDisabled} value='svDb' onChange={this.searchOnchange.bind(null, '数据库参数')}>数据库参数</Checkbox>
							<Checkbox disabled={this.state.searchDisabled} value='svCpu' onChange={this.searchOnchange.bind(null, 'cpu性能')}>cpu性能</Checkbox>
							<Checkbox disabled={this.state.searchDisabled} value='svMemery' onChange={this.searchOnchange.bind(null, '内存需求')}>内存需求</Checkbox>
							<Checkbox disabled={this.state.searchDisabled} value='svDisk' onChange={this.searchOnchange.bind(null, '硬盘需求')}>硬盘需求</Checkbox>
						</FormItem>
					</Form>
				</Modal>
			</div>
		)
	}
})

Statement = createForm()(Statement);
export default Statement
