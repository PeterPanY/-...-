import React from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import ajax from '../../../common/ajax';
import { Row, Col, Button, Input, Icon, Form, Modal, message, Select, Card } from 'antd';
import '../Search/Search.css';

const createForm = Form.create;
const FormItem = Form.Item;

let Business = React.createClass({
	getInitialState() {
		return ({
			businessListData: [],
			addBusinessModal: false,
			addConfirmLoading: false,
			changeBusinessModal: false,
			changeconfirmLoading: false,
			changeconfirmLoading: false,
			delBusinessModal: false,
			delConfirmLoading: false
		})
	},
	componentDidMount() {
		this.businessList()
	},
	businessList() {
		let _this = this
		this.setState({
			loading: true
		})
		ajax({
			url: 'getBusinessList.do',
			type: 'post',
			success(res) {
				// console.log(res)
				_this.setState({
					loading: false
				});
				let businessData
				if (typeof res.data == 'string') {
					businessData = []
				} else {
					businessData = res.data.reverse()
				}
				if (res.ret === 'SUCCESS') {
					_this.setState({
						businessListData: businessData,
					})
				} else {
					Modal.error({
						title: '服务器数据连接失败'
					})
				}
			},
			error() {
				Modal.error({
					title: '服务器错误'
				})
			}
		})
	},
	// 添加业务对话框显示
	addBusinessClick() {
		this.setState({
			addBusinessModal: true
		})
	},
	// 确定添加业务
	addBusinessOk() {
		let _this = this
		this.props.form.validateFieldsAndScroll((errors, values) => {
			// if (!errors) {
			this.setState({
				addConfirmLoading: true
			})
			// 防止添加的字符串为空字符
			let addBus
			// console.log(values.addBusinessName)
			if (!values.addBusinessName || !values.addBusinessName.trim()) {
				this.setState({
					addConfirmLoading: false
				});
				Modal.error({
					title: '添加业务不能为空'
				});
				this.props.form.resetFields();
				return
			} else {
				addBus = values.addBusinessName.trim()
			}
			// console.log(addBus)
			ajax({
				url: 'addBusiness.do',
				type: 'post',
				data: { businessName: addBus },
				success(res) {
					_this.setState({
						addConfirmLoading: false
					})
					if (res.ret == 'SUCCESS') {
						_this.setState({
							addBusinessModal: false
						})
						Modal.success({
							title: "添加业务成功"
						});
						_this.businessList();
						_this.props.form.resetFields();
					} else {
						Modal.error({
							title: '服务器错误，业务添加失败'
						});
					}
				},
				error() {
					_this.setState({
						addConfirmLoading: false
					})
					Modal.error({
						title: '服务器异常'
					});
				}
			})
			// }	
		})
	},
	// 取消添加业务
	addBusinessCancel() {
		this.setState({
			addBusinessModal: false,
			addConfirmLoading: false
		})
	},
	// 修改业务对话框显示
	changeBusinessClick(id, name) {
		// console.log(id)
		this.setState({
			changeBusinessModal: true,
			changeId: id
		})
		this.props.form.setFieldsValue({
			changBusinessName: name
		})
	},
	// 确定修改业务
	changeBusinessOk() {
		let _this = this
		this.props.form.validateFieldsAndScroll((errors, values) => {
			_this.setState({
				changeconfirmLoading: true
			})
			let changeBus
			if (!values.changBusinessName || !values.changBusinessName.trim()) {
				this.setState({
					changeconfirmLoading: false
				});
				Modal.error({
					title: '修改业务不能为空'
				});
				this.props.form.resetFields();
				return
			} else {
				changeBus = values.changBusinessName.trim()
			}
			let changeData = {
				businessId: this.state.changeId,
				businessName: changeBus
			}
			ajax({
				url: 'updateBusiness.do',
				type: 'post',
				data: changeData,
				success(res) {
					// console.log(res)
					_this.setState({
						changeconfirmLoading: false
					})
					if (res.ret == 'SUCCESS') {
						_this.setState({
							changeBusinessModal: false,
						})
						Modal.success({
							title: '业务名称修改成功!'
						});
						_this.businessList()
					} else {
						Modal.error({
							title: '业务名称修改失败！',
						});
					}
				},
				error() {
					_this.setState({
						changeconfirmLoading: false
					})
					Modal.error({
						title: '服务器异常!'
					});
				}
			})

		})
	},
	// 取消修改业务
	changeBusinessCancel() {
		this.setState({
			changeBusinessModal: false,
			changeconfirmLoading: false
		})
	},
	// 删除业务对话框显示
	delBusinessClick(id) {
		this.setState({
			delBusinessModal: true,
			delId: id
		})
	},
	// 确定删除
	delBusinessOk() {
		let _this = this
		this.setState({
			delConfirmLoading: true
		})
		ajax({
			url: 'deleteBusiness.do',
			type: 'post',
			data: { businessId: this.state.delId },
			success(res) {
				// console.log(res)
				_this.setState({
					delConfirmLoading: false
				})
				if (res.ret == 'SUCCESS') {
					_this.setState({
						delBusinessModal: false
					})
					Modal.success({
						title: '删除业务成功！'
					});
					_this.businessList()
				} else {
					Modal.error({
						title: res.data
					});
				}
			},
			error() {
				_this.setState({
					delConfirmLoading: false
				})
				Modal.error({
					title: '服务器错误'
				});
			}
		})
	},
	// 取消删除
	delBusinessCancel() {
		this.setState({
			delBusinessModal: false,
			delConfirmLoading: false
		})
	},
	render() {
		let _this = this
		const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
		const addBusinessName = getFieldProps('addBusinessName', {
			rules: [
				{ required: true, min: /\S/, message: '业务名称不能为空' }
			]
		});
		const changBusinessName = getFieldProps('changBusinessName', {
			rules: [
				{ required: true, min: /\S/, message: '业务名称不能为空' }
			]
		});
		const formItemLayout = {
			labelCol: { span: 7 },
			wrapperCol: { span: 12 },
		};
		return (
			<div className='searchCardTitle'>
				<Card title="服务业务信息列表"
					loading={this.state.loading}
					extra={<a href="javascript:;" onClick={this.addBusinessClick}>添加业务</a>}
					style={{ width: '50%' }}>
					<ul>
						{this.state.businessListData.map(function (item, index) {
							return (
								<li key={index}>{item.businessName}
									<div style={{ float: 'right' }}>
										<a href="javascript:;" onClick={_this.changeBusinessClick.bind(null, item.businessId, item.businessName)}>修改</a>
										<a href="javascript:;" style={{ marginLeft: '10px' }}
											onClick={_this.delBusinessClick.bind(null, item.businessId)}>删除</a>
									</div>
								</li>
							)
						})}
					</ul>
				</Card>
				{/*添加业务类型*/}
				<Modal
					title="添加业务总类"
					wrapClassName="vertical-center-modal"
					visible={this.state.addBusinessModal}
					onOk={this.addBusinessOk}
					onCancel={this.addBusinessCancel}
					confirmLoading={this.state.addConfirmLoading}>
					<Form horizontal>
						<FormItem {...formItemLayout} label="类型名称" hasFeedback>
							<Input {...addBusinessName} placeholder="请输入需要添加的业务名称" />
						</FormItem>
					</Form>
				</Modal>
				{/*修改业务类型*/}
				<Modal
					title="修改业务名称"
					wrapClassName="vertical-center-modal"
					visible={this.state.changeBusinessModal}
					onOk={this.changeBusinessOk}
					onCancel={this.changeBusinessCancel}
					confirmLoading={this.state.changeconfirmLoading}>
					<Form horizontal>
						<FormItem {...formItemLayout} label="类型名称" hasFeedback>
							<Input {...changBusinessName} placeholder="请输入需要添加的业务名称" />
						</FormItem>
					</Form>
				</Modal>
				{/*删除业务类型*/}
				<Modal
					title="删除业务"
					wrapClassName="vertical-center-modal"
					visible={this.state.delBusinessModal}
					onOk={this.delBusinessOk}
					onCancel={this.delBusinessCancel}
					confirmLoading={this.state.delConfirmLoading}>
					<p>你真的要把这个业务删除吗？</p>
				</Modal>
			</div>
		)
	}
})
Business = createForm()(Business);
export default Business