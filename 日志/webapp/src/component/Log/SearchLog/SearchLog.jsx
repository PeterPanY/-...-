import React from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import ajax from '../../../common/ajax';
import { Row, Col, Button, Table, Input, Select, Icon, DatePicker, Modal, Form, Radio } from 'antd';
import AddSearchLog from './AddSearchLog'
import '../Search/Search.css'

const Option = Select.Option;
const createForm = Form.create;
const FormItem = Form.Item;

let SearchLog = React.createClass({
  getInitialState() {
    /*return 表格数据*/
    return ({
      //visible: false,
      addSearchLogModal: false, //添加模块
      changeSearchLogModal: false, //修改模块
      delServerLogModal: false, //删除模块
      //methodModalInfo: false, //详情模块
      logTypeData: [],
      deleteAllVisible: false,
      selectedRowKeys: [],
      columns: [
        { title: "日志名称", width: "10%", dataIndex: "blogName" },
        { title: "应用名称", width: "10%", dataIndex: "cmName" },
        { title: "日志内容", width: "30%", dataIndex: "content" },
        { title: "日志类型", width: "10%", dataIndex: "blogType.typeName" },
        { title: "操作人员", width: "10%", dataIndex: "userName" },
        { title: "更新时间", width: "10%", dataIndex: "methodUpdateTime" },
        {
          title: '操作', width: "20%", key: 'operation', render: (text, record) => (
            <span>
              <a href="javascript:;" onClick={this.SearchLogInfo.bind(null, record.blogId)}>修改</a>
              <span className="ant-divider"></span>
              <a href="javascript:;" onClick={this.deleteSearchLogClick.bind(null, record.blogId)}>删除</a>
            </span>)
        }
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
  //搜索类型列表
  logTypeList() {
    let _this = this;
    ajax({
      url: 'getLogTypeList.do',
      type: 'post',
      success: function (res) {
        let logTypeData
        if (typeof res.data == 'string') {
          Modal.warning({
            title: '日志类型为空，请先添加日志类型在来查看日志列表'
          })
          logTypeData = []
        } else {
          logTypeData = res.data
        }
        // console.log(typeof res.data)
        if (res.ret === 'SUCCESS') {
          _this.setState({
            logTypeData: logTypeData
          })
        } else {
          Modal.error({
            title: '获取日志类型失败，服务器异常'
          })
        }
      },
      error: function (res) {
        Modal.error({
          title: '服务器异常'
        })
      }
    })
  },
  //搜索类型
  blogTypeChange(value) {
    this.setState({
      blogTypeValue: value.key,
      blogTypeName: value.label
    });
  },
  //方法搜索
  handleSearch(searchUrl) {
    let _this = this;
    this.setState({
      blogName: this.refs.blogName.refs.input.value,
      blogType: {
        blogTypeId: this.state.blogTypeValue
      },
      userName: this.refs.userName.refs.input.value,
      startTime: this.state.dayStartString,
      endTime: this.state.dayEndString
    });
    let data = {
      curPage: 1,
      obj: {
        blogName: this.refs.blogName.refs.input.value,
        //blogType: this.state.blogTypeValue,
        blogType: {
          blogTypeId: this.state.blogTypeValue
        },
        userName: this.refs.userName.refs.input.value,
        startTime: this.state.dayStartString,
        endTime: this.state.dayEndString
      }
    };
    //console.log(data);
    this.setState({
      loading: true
    });
    ajax({
      url: searchUrl + '.do',
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
            searchDataArr[i].methodUpdateTime = _this.timeFormat(searchDataArr[i].updateTime)
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
  /*点击分页*/
  handlePageChange: function (current, searchUrl) {
    let _this = this;
    let data = {
      curPage: current,
      obj: {
        blogName: this.refs.blogName.refs.input.value,
        blogType: {
          blogTypeId: this.state.blogTypeValue
        },
        userName: this.refs.userName.refs.input.value,
        startTime: this.state.dayStart,
        endTime: this.state.dayEnd
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
            current: res.data.curPage,
            onChange(current) {
              _this.handlePageChange(current, searchUrl)
            }
          };
          let dataLog = res.data.data || []
          for (var i = 0; i < dataLog.length; i++) {
            dataLog[i].methodUpdateTime = _this.timeFormat(dataLog[i].updateTime)
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
  //方法列表----生命周期钩子函数
  componentDidMount: function () {
    this.handleSearch('getLogList');
    this.logTypeList()
  },
  //添加按钮显示添加对话框
  addSearchLogClick() {
    this.setState({
      addSearchLogModal: true
    })
  },
  //添加子组件回调函数
  addLogChangeTo(changeState) {
    this.setState({
      addSearchLogModal: changeState
    });
    this.handleSearch('getLogList')
  },
  //日志详情信息
  SearchLogInfo(blogId) {
    let _this = this;
    this.setState({
      loading: true
    });
    ajax({
      url: 'getLogInfo.do',
      type: 'post',
      data: { blogId: blogId },
      success: function (res) {
        // console.log(res);
        _this.setState({
          changeSearchLogModal: true,
          loading: false,
          changeBlogId: blogId
        });
        if (res.ret === 'SUCCESS') {
          _this.props.form.setFieldsValue({
            changeBlogName: res.data.blogName,
            changeCmName: res.data.cmName,
            textarea: res.data.content,
            select: res.data.blogType.blogTypeId
          })
        } else {
          Modal.error({
            title: '服务器异常'
          })
        }
      }
    });
  },
  //确定修改详情
  changSearchLogOk() {
    let _this = this
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        this.setState({
          changeConfirmLoading: true
        });
        let changeLogData = {
          blogId: this.state.changeBlogId,
          blogName: values.changeBlogName,
          content: values.textarea,
          cmName: values.changeCmName,
          blogType: {
            blogTypeId: values.select
          }
        };
        // console.log(changeLogData)
        ajax({
          url: 'updateLog.do',
          type: 'post',
          data: changeLogData,
          success: function (res) {
            _this.setState({
              changeSearchLogModal: false,
              changeConfirmLoading: false
            });
            if (res.ret == 'SUCCESS') {
              //_this.handlePageChange(_this.state.pagination.current,'getLogList')
              _this.handleSearch('getLogList');
            } else {
              Modal.error({
                title: '系统错误,修改日志失败'
              });
            }
          },
          error: function (res) {
            _this.setState({
              changeConfirmLoading: false
            })
            Modal.error({
              title: '服务连接失败'
            });
          }
        })
      }
    })
  },
  //删除日志
  deleteSearchLogClick(blogId) {
    this.setState({
      delServerLogModal: true,
      delBlogId: blogId
    })
  },
  //确定删除
  deleteServiceLogOk() {
    let _this = this;
    this.setState({
      loading: true,
    });
    let delLogId = this.state.delBlogId
    ajax({
      url: 'deleteLog.do',
      type: 'post',
      data: [delLogId],
      success: function (res) {
        _this.setState({
          loading: false,
          delServerLogModal: false
        });
        if (res.ret == 'SUCCESS') {
          Modal.success({
            title: '删除成功！'
          });
          _this.handleSearch('getLogList');
        } else {
          Modal.error({
            title: '系统错误',
          });
        }
      },
      error: function (res) {
        Modal.error({
          title: '服务器错误'
        })
      }
    })
  },
  /*弹窗里面 点击遮罩层或右上角叉或取消按钮的回调 */
  handleCancel(e) {
    this.setState({
      addSearchLogModal: false,
      changeSearchLogModal: false,
      delServerLogModal: false
    });
  },
  //选中项发生变化的时的回调
  onSelectChange(selectedRowKeys, selectedRows) {
    // console.log(selectedRowKeys);
    this.setState({
      selectedRowKeys: selectedRowKeys
    });
  },
  // 批量删除对话框显示
  deleteAll() {
    this.setState({
      deleteAllVisible: true
    })
  },
  // 确定批量删除
  deleteAllOk() {
    let _this = this;
    this.setState({
      deleteAllLoading: true
    });
    let data = this.state.selectedRowKeys;
    ajax({
      url: 'deleteLog.do',
      type: 'post',
      data: data,
      success(res) {
        _this.setState({
          deleteAllLoading: false
        });
        if (res.ret == 'SUCCESS') {
          _this.setState({
            deleteAllVisible: false
          });
          if (_this.state.pagination.total % _this.state.pagination.pageSize === _this.state.selectedRowKeys.length && _this.state.pagination.current === Math.ceil(_this.state.pagination.total / _this.state.pagination.pageSize) && _this.state.pagination.current !== 1) {
            _this.handlePageChange(_this.state.pagination.current - 1, 'getLogList')
          } else {
            _this.handlePageChange(_this.state.pagination.current, 'getLogList');
          }
          _this.setState({
            selectedRowKeys: []
          })
          Modal.success({
            title: res.data
          });
        } else {
          Modal.error({
            title: res.data
          });
        }
      },
      error() {
        _this.setState({
          deleteAllLoading: false
        });
        Modal.error({
          title: '服务器连接失败'
        });
      }
    })
  },
  // 取消批量删除
  deleteAllCancel() {
    this.setState({
      deleteAllVisible: false,
      deleteAllLoading: false
    })
  },
  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    const changeBlogName = getFieldProps('changeBlogName', {
      rules: [
        { required: true, min: 0, message: '方法名字不能为空' }
      ]
    });
    const changeCmName = getFieldProps('changeCmName', {
      rules: [
        { required: true, min: 0, message: '方法名字不能为空' }
      ]
    });
    const changeContent = getFieldProps('textarea', {
      rules: [
        { required: true, min: 0, message: '方法描述不能为空' },
      ]
    });
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };

    const { selectedRowKeys } = this.state;
    //table选项功能配置
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <div className="methodTitle">
          <h2>服务日志列表</h2>
        </div>
        {/*搜索限定条件*/}
        <Row className="methodSearch">
          <Col>
            <Button type="primary" onClick={this.deleteAll} disabled={!hasSelected} style={{ marginRight: 20 }}>删除</Button>
            <label>日志名称：</label>
            <Input type="text" ref="blogName" style={{ width: 80, marginRight: 10 }} />
            <label>日志类型：</label>
            <Select onChange={this.blogTypeChange} labelInValue style={{ width: 100, marginRight: 10 }}>
              <Option value='' key='123'>&nbsp;</Option>
              {this.state.logTypeData.map(function (item, index) {
                return <Option value={item.blogTypeId} key={index}>{item.typeName}</Option>
              })
              }
            </Select>
            <label>操作人员：</label>
            <Input type="text" ref="userName" style={{ width: 80, marginRight: 10 }} />
            <label>时间段：</label>
            <div id="trendDay">
              <DatePicker value={this.state.dayStartString} onChange={this.startTimeChange}
                disabledDate={this.startTimeStart} placeholder="开始日期" style={{ width: 100 }} />
              <span>-</span>
              <DatePicker value={this.state.dayEndString} onChange={this.endTimeChange} disabledDate={this.startTimeEnd}
                placeholder="结束日期" style={{ width: 100 }} />
            </div>
            <Button type="primary" style={{ marginLeft: 20 }} onClick={this.handleSearch.bind(null, 'getLogList')}><Icon
              type="search" /></Button>
            <Button type="primary" onClick={this.addSearchLogClick} style={{ float: 'right' }}>新增日志</Button>
          </Col>
        </Row>
        {/*表格详情*/}
        <Table className="logSearchTable"
          rowKey={function (item) { return item.blogId }}
          rowSelection={rowSelection}
          columns={this.state.columns}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          size="middle" bordered />
        {/*新增日志模块*/}
        <Modal title="添加日志" wrapClassName="vertical-center-modal" visible={this.state.addSearchLogModal} footer={null}
          onCancel={this.handleCancel}>
          <AddSearchLog addSearchLogState={this.state.addSearchLogModal}
            logTypeData={this.state.logTypeData}
            logCallback={this.addLogChangeTo}></AddSearchLog>
        </Modal>
        {/*详情模块*/}
        {/*修改模块*/}
        <Modal title="修改日志"
          visible={this.state.changeSearchLogModal}
          onOk={this.changSearchLogOk}
          onCancel={this.handleCancel}
          confirmLoading={this.state.changeConfirmLoading}>
          <Form horizontal>
            <FormItem {...formItemLayout} label="日志名称" hasFeedback>
              <Input {...changeBlogName} placeholder="请输入日志名称" />
            </FormItem>
            <FormItem {...formItemLayout} label="应用名称" hasFeedback>
              <Input {...changeCmName} placeholder="请输入应用名称" />
            </FormItem>
            <FormItem {...formItemLayout} label="日志类型" required>
              <Select {...getFieldProps('select') } id="searchLogSelect">
                {this.state.logTypeData.map(function (item, index) {
                  return <Option value={item.blogTypeId} key={index}>{item.typeName}</Option>
                })}
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="日志内容" hasFeedback>
              <Input {...changeContent} type="textarea" style={{ resize: 'none' }} rows={6} placeholder="日志内容描述" id="textarea" name="textarea" />
            </FormItem>
          </Form>
        </Modal>
        {/*删除模块*/}
        <Modal title="提示信息" visible={this.state.delServerLogModal}
          onOk={this.deleteServiceLogOk} onCancel={this.handleCancel}
        >
          <p>你真的要把这条日志删除吗？</p>
        </Modal>
        {/*批量删除操作*/}
        <Modal title="系统提示："
          visible={this.state.deleteAllVisible}
          onOk={this.deleteAllOk}
          onCancel={this.deleteAllCancel}
          confirmLoading={this.state.deleteAllLoading}>
          <h4>确定要删除已选择项吗？</h4>
        </Modal>
      </div>
    )
  }
});
SearchLog = createForm()(SearchLog);
export default SearchLog
