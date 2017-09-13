import React from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import ajax from '../../../common/ajax';
import { Row, Col, Button, Table, Input, Select, Icon, DatePicker, Modal, Form, Radio } from 'antd';
import AddMethod from './AddMethod.jsx'
import '../Search/Search.css'
const Option = Select.Option;
const createForm = Form.create;
const FormItem = Form.Item;

let Method = React.createClass({
  getInitialState() {
    /*return 表格数据*/
    return ({
      visible: false,
      addModal: false, //添加模块
      changeModal: false, //修改模块
      deleteModal: false, //删除模块
      methodModalInfo: false, //详情模块
      dataSelect: [],
      columns: [
        { title: "方法名字", width: "10%", dataIndex: "methodName" },
        { title: "方法所属服务", width: "10%", dataIndex: "service.serviceName" },
        { title: "方法描述", width: "20%", dataIndex: "methodDescr" },
        { title: "地址", width: "10%", dataIndex: "methodUrl" },
        { title: "返回值", width: "10%", dataIndex: "result" },
        { title: "示例", width: "10%", dataIndex: "example" },
        { title: "更新时间", width: "10%", dataIndex: "methodUpdateTime" },
        {
          title: '操作', width: "20%", key: 'operation', render: (text, record) => (
            <span>
              <a href="javascript:;" onClick={this.updateMethod.bind(null, record.methodId, 'methodInfo')}>详情</a>
              <span className="ant-divider"></span>
              <a href="javascript:;" onClick={this.updateMethod.bind(null, record.methodId, 'updataInfo')}>修改</a>
              <span className="ant-divider"></span>
              <a href="javascript:;" onClick={this.deleteModalClick.bind(null, record.methodId)}>删除</a>
            </span>)
        },
      ]
    });
  },
  /* 转换时间个格式*/
  timeFormat: function (da) {
    da = new Date(da);
    var year = da.getFullYear();
    var month = da.getMonth() + 1;
    var date = da.getDate();
    return ([year, month, date].join('-'));
  },
  /*搜索时间段的开始时间点击函数*/
  startTimeChange(date, dateString) {
    this.setState({
      dayStart: date,
      dayStartString: dateString
    })
  },
  /*搜索时间段的结束时间点击函数*/
  endTimeChange(date, dateString) {
    this.setState({
      dayEnd: date,
      dayEndString: dateString
    })
  },
  /*搜索时间段的开始时间函数*/
  startTimeStart(startTimeStart) {
    if (!startTimeStart || !this.state.dayEnd) {
      return false;
    }
    return startTimeStart.getTime() + 3600000 >= this.state.dayEnd.getTime() || startTimeStart.getTime() + 3600000 + 2592000000 <= this.state.dayEnd.getTime();
  },
  /*搜索时间段的结束时间函数*/
  startTimeEnd(startTimeEnd) {
    if (!startTimeEnd || !this.state.dayStart) {
      return false;
    }
    return startTimeEnd.getTime() - 3600000 <= this.state.dayStart.getTime() || startTimeEnd.getTime() - 3600000 - 2592000000 >= this.state.dayStart.getTime();
  },
  //方法搜索
  handleSearch(searchUrl) {
    let _this = this;
    this.setState({
      methodName: this.refs.methodName.refs.input.value,
      startTime: this.state.dayStartString,
      endTime: this.state.dayEndString
    });
    let data = {
      curPage: 1,
      obj: {
        methodName: this.refs.methodName.refs.input.value,
        startTime: this.state.dayStartString,
        endTime: this.state.dayEndString
      }
    };
    this.setState({
      loading: true
    });
    ajax({
      url: searchUrl + '.do',
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
            current: 1,
            onChange(current) {
              _this.handlePageChange(current)
            }
          };
          let dataArr = res.data.data || []
          for (var i = 0; i < dataArr.length; i++) {
            dataArr[i].methodUpdateTime = _this.timeFormat(dataArr[i].mdUpdateTime)
          }
          _this.setState({
            data: dataArr,
            pagination: pagination
          });
        } else {
          Modal.warning({
            title: '没有搜索到你所查的方法，请检查是否输入错误'
          });
        }
      },
      error() {
        _this.setState({
          loading: false,
        });
        Modal.error({
          title: '服务连接失败',
        });
      }
    })

  },
  //获取所有的服务名，以待传递给添加数据对话框显示
  handleSearchSelect(searchSelectUrl) {
    let _this = this;
    this.setState({
      loading: true
    });
    ajax({
      url: searchSelectUrl + '.do',
      type: 'post',
      success: function (res) {
        let dataSelect
        if (res.data == '不存在服务') {
          dataSelect = []
        } else {
          dataSelect = res.data
        }

        // console.log(dataSelect)
        _this.setState({
          loading: false,
          dataSelect: dataSelect,
        });
      },
      error() {
        _this.setState({
          loading: false,
        });
        Modal.error({
          title: '服务连接失败',
        });
      }
    })
  },

  /*点击分页*/
  handlePageChange: function (current) {
    let _this = this;
    let data = {
      curPage: current,
      obj: {
        methodName: this.refs.methodName.refs.input.value,
        startTime: this.state.dayStart,
        endTime: this.state.dayEnd
      }
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: 'getMethodList.do',
      type: 'post',
      data: data,
      success: function (res) {
        _this.setState({
          loading: false,
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
              _this.handlePageChange(current)
            }
          };
          _this.setState({
            data: res.data.data,
            pagination: pagination
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
  //方法列表----生命周期钩子函数
  componentDidMount: function () {
    this.handleSearch('getMethodList');
    this.handleSearchSelect('getAllService')
  },
  //修改方法,方法详情
  updateMethod(methodId, info) {
    let _this = this;
    let data = {
      methodId: methodId
    };
    this.setState({
      methodId: methodId,
      loading: true
    });
    ajax({
      url: 'getMethodInfo.do',
      type: 'post',
      data: data,
      success: function (res) {
        // console.log(res)
        _this.setState({
          loading: false
        });
        if (info === 'updataInfo') {
          _this.setState({
            changeModal: true
          });
          if (res.ret === 'SUCCESS') {
            _this.props.form.setFieldsValue({
              changeMethodName: res.data.methodName,
              serverSelect: res.data.service.serviceId,
              textarea: res.data.methodDescr,
              changeMethodUrl: res.data.methodUrl,
              changeMethodParamName: res.data.params[0].paramName,
              changeMethodParamDescr: res.data.params[0].paramDescr,
              changeMethodResult: res.data.result,
              changeMethodExample: res.data.example
            });
            _this.setState({
              paramID: res.data.params[0].paramId
            })
          } else {
            _this.setState({
              changeModal: false,
            });
            Modal.error({
              title: '系统错误'
            });
          }
        } else if (info === 'methodInfo') {
          if (res.ret === 'SUCCESS') {
            let updataMethodTime = _this.timeFormat(res.data.mdUpdateTime);
            _this.setState({
              methodModalInfo: true,
              methodName: res.data.methodName,
              serviceName: res.data.service.serviceName,
              methodDescr: res.data.methodDescr,
              methodUrl: res.data.methodUrl,
              paramName: res.data.params[0].paramName,
              paramDescr: res.data.params[0].paramDescr,
              result: res.data.result,
              example: res.data.example,
              updataMethodTime: updataMethodTime
            })
          }else{
            Modal.error({
              title: '服务器错误，获取需要修改的数据失败！'
            });
          }

        }
      },
      error: function (res) {
        _this.setState({
          changeModal: false,
        });
        Modal.error({
          title: '服务连接失败',
        });
      }
    })
  },
  //确定详情展示
  infoMethod() {
    this.setState({
      methodModalInfo: false
    })
  },
  //确定修改
  changeUpdateMethod() {
    let _this = this
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        this.setState({
          confirmLoading: true
        });
        let changeData = {
          methodId: this.state.methodId,
          service: {
            serviceId: values.serverSelect
          },
          methodName: values.changeMethodName,
          methodDescr: values.textarea,
          methodUrl: values.changeMethodUrl,
          params: [
            {
              paramId: this.state.paramID,
              paramName: values.changeMethodParamName,
              paramDescr: values.changeMethodParamDescr
            }
          ],
          result: values.changeMethodResult,
          example: values.changeMethodExample
        };
        ajax({
          url: 'updateMethod.do',
          type: 'post',
          data: changeData,
          success: function (res) {
            if (res.ret == 'SUCCESS') {
              _this.setState({
                changeModal: false,
              });
              Modal.success({
                title: '方法修改成功'
              });
              _this.handleSearch('getMethodList')
            } else {
              Modal.error({
                title: '方法修改失败'
              });
            }
          },
          error: function (res) {
            Modal.error({
              title: '服务连接失败',
            });
          }
        })
      }
    })
  },
  //新增模块 --- 父子组件传值
  addMedthodModal() {
    this.setState({
      addModal: true //显示添加方法对话框
    })
  },
  addChangeTo(newAddIsShow) {
    this.setState({
      addModal: newAddIsShow
    });
    this.handleSearch('getMethodList')
  },

  /*弹窗里面 点击遮罩层或右上角叉或取消按钮的回调 */
  handleCancel() {
    this.setState({
      addModal: false,
      changeModal: false,
      deleteModal: false,
      methodModalInfo: false
    });
  },
  //弹出删除框
  deleteModalClick(methodId) {
    this.setState({
      deleteModal: true,
      delereMethodId: methodId
    })
  },
  //确定删除
  deleteMethod() {
    let _this = this;
    let delereMethodId = this.state.delereMethodId;
    this.setState({
      loading: true
    });
    ajax({
      url: 'deleteMethod.do',
      type: 'post',
      data: { methodId: delereMethodId },
      success: function (res) {
        _this.setState({
          loading: false,
          deleteModal: false
        });
        if (res.ret == 'SUCCESS') {
          Modal.success({
            title: '删除方法成功！'
          });
          _this.handleSearch('getMethodList')
        } else {
          Modal.error({
            title: '系统错误，删除方法失败'
          });
        }
      }
    })
  },
  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    const changeMethodName = getFieldProps('changeMethodName', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ],
    });
    const serverSelect = getFieldProps('serverSelect', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ],
    });
    const changeMethodDescr = getFieldProps('textarea', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ],
    });
    const changeMethodUrl = getFieldProps('changeMethodUrl', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ],
    });
    const changeMethodParamName = getFieldProps('changeMethodParamName', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ],
    });
    const changeMethodParamDescr = getFieldProps('changeMethodParamDescr', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ],
    });
    const changeMethodResult = getFieldProps('changeMethodResult', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ],
    });
    const changeMethodExample = getFieldProps('changeMethodExample', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ],
    });
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    return (
      <div>
        <div className="methodTitle">
          <h2>方法列表</h2>
        </div>
        {/*搜索限定条件*/}
        <Row className="methodSearch">
          <Col>
            <label>方法名称：</label>
            <Input type="text" ref="methodName" style={{ width: 80, marginRight: 10 }} />
            <label>时间段：</label>
            <div id="trendDay">
              <DatePicker value={this.state.dayStartString} onChange={this.startTimeChange}
                disabledDate={this.startTimeStart} placeholder="开始日期" style={{ width: 100 }} />
              <span>-</span>
              <DatePicker value={this.state.dayEndString} onChange={this.endTimeChange} disabledDate={this.startTimeEnd}
                placeholder="结束日期" style={{ width: 100 }} />
            </div>
            <Button type="primary" style={{ marginLeft: 20 }} onClick={this.handleSearch.bind(null, 'getMethodList')}><Icon
              type="search" /></Button>
            <Button type="primary" onClick={this.addMedthodModal} style={{ float: 'right' }}>新增方法</Button>
          </Col>
        </Row>
        {/*表格详情*/}
        <Table className="logSearchTable" columns={this.state.columns}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          size="middle" bordered />

        {/*新增方法模块*/}
        <Modal title="新增方法"
          visible={this.state.addModal}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          footer={null}
        >
          <AddMethod addMethodIsShow={this.state.addModal} servicelist={this.state.dataSelect}
            callbackParent={this.addChangeTo}></AddMethod>
        </Modal>

        {/*详情方法模块*/}
        <Modal title="资源详细信息" visible={this.state.methodModalInfo} wrapClassName="vertical-center-modal"
          onOk={this.infoMethod} onCancel={this.handleCancel}>
          <ul className="detailsFl">
            <li><label>方法名称:</label><span>{this.state.methodName}</span></li>
            <li><label>所属服务:</label><span>{this.state.serviceName}</span></li>
            <li><label>方法描述:</label><span>{this.state.methodDescr}</span></li>
            <li><label>方法地址:</label><span>{this.state.methodUrl}</span></li>
            <li><label>方法参数:</label><span>{this.state.paramName}</span></li>
            <li><label>参数简介:</label><span>{this.state.paramDescr}</span></li>
            <li><label>返&nbsp;&nbsp;回&nbsp;&nbsp;值:</label><span>{this.state.result}</span></li>
            <li><label>方法示例:</label><span>{this.state.example}</span></li>
            <li><label>更新时间:</label><span>{this.state.updataMethodTime}</span></li>
          </ul>
        </Modal>
        {/*修改方法模块*/}
        <Modal title="修改方法"
          visible={this.state.changeModal}
          onOk={this.changeUpdateMethod}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          <Form horizontal>
            <FormItem {...formItemLayout} label="方法名称" hasFeedback>
              <Input {...changeMethodName} placeholder="实时校验，输入 JasonWood 看看" />
            </FormItem>
            <FormItem {...formItemLayout} label="所属服务" required>
              <Select {...serverSelect} id="serviceSelect">
                {this.state.dataSelect.map(function (item, index) {
                  return <Option value={item.serviceId} key={index}>{item.serviceName}</Option>
                })}
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="描&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;述" hasFeedback>
              <Input {...changeMethodDescr} type="textarea" placeholder="方法描述" id="textarea" name="textarea" />
            </FormItem>
            <FormItem {...formItemLayout} label="地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址" hasFeedback>
              <Input {...changeMethodUrl} placeholder="方法地址" />
            </FormItem>
            <FormItem {...formItemLayout} label="参数名字" hasFeedback>
              <Input {...changeMethodParamName} placeholder="多个参数请用‘，’隔开" />
            </FormItem>
            <FormItem {...formItemLayout} label="参数简介" hasFeedback>
              <Input {...changeMethodParamDescr} type="textarea" placeholder="参数简介" id="changeMethodParamDescr"
                name="changeMethodParamDescr" />
            </FormItem>
            <FormItem {...formItemLayout} label="返&nbsp;&nbsp;回&nbsp;&nbsp;值" hasFeedback>
              <Input {...changeMethodResult} placeholder="方法返回值" />
            </FormItem>
            <FormItem {...formItemLayout} label="示&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;例" hasFeedback>
              <Input {...changeMethodExample} placeholder="方法示例" />
            </FormItem>
          </Form>
        </Modal>

        {/*删除模块*/}
        <Modal title="提示信息" visible={this.state.deleteModal}
          onOk={this.deleteMethod} onCancel={this.handleCancel}
        >
          <p>你真的要把这个方法删除吗？</p>
        </Modal>
      </div>
    )
  }
});
Method = createForm()(Method);
export default Method
