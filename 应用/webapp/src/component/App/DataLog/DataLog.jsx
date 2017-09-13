import React from 'react';
import {browserHistory} from 'react-router';
import ajax from '../../../common/ajax';
import { Row,Col,Button,Table,Input,Icon,Modal,Form,Radio,DatePicker,Select } from 'antd';
import AddDataLog from './AddDataLog'
import '../../../common/Data.css';
import { fileLoads } from '../../../common/fileUploads';

const createForm = Form.create;
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

let DataLog = React.createClass({
  getInitialState(){
    let _this = this;
    return {
      columns: [
        {title: "日志名称", width: "10%", dataIndex: "blogName"},
        {title: "应用名称", width: "10%", dataIndex: "cmName"},
        {title: "日志内容", width: "30%", dataIndex: "content"},
        {title: "日志类型", width: "10%", dataIndex: "blogType.typeName"},
        {title: "操作人员", width: "10%", dataIndex: "userName"},
        {title: "更新时间", width: "10%", dataIndex: "Updated"},
        {
          title: "操作", width: "20%", dataindex: "operation", render: function (text, record, index) {
          return (
            <div className="operationbtn">
              <a href="javascript:" onClick={_this.dataLogInfoClick.bind(null,record.blogId)}>修改</a>
              <span className="ant-divider"></span>
              <a href="javascript:" onClick={_this.delDataLogClick.bind(null,record.blogId)}>删除</a>
            </div>
          )
        }
        }
      ],
      selectedRowKeys: [],
      logTypeData: [],
      addLogVisible: false,
      changeDataLogVisible: false,
      changeDataLogLoading: false,
      deleteDataLogVisible: false,
      deleteDataLogLoading: false,
      deleteAllLogVisible: false,
      deleteAllLogLoading: false
    }
  },
  componentDidMount(){
    this.logTypeAll();
    let _this = this;
    this.setState({
      loading: true
    });
    let data = {
      curPage: 1
    };
    ajax({
      url: 'getLogList.do',
      type: 'post',
      data: data,
      success(res){
        //console.log(res);
        _this.setState({
          loading: false
        });
        if (res.ret == 'SUCCESS') {
          let dataList = res.data.data || [];
          for (var i = 0; i < dataList.length; i++) {
            dataList[i].Updated = _this.timeFormat(dataList[i].updateTime)
          }
          let pagination = {
            total: res.data.rowCount,
            showTotal: function () {
              return ('共' + res.data.rowCount + '条')
            },
            pageSize: res.data.pageSize,
            current: 1,
            onChange(current){
              _this.handlePageChange(current)
            }
          };
          _this.setState({
            data: res.data.data,
            pagination: pagination,
            selectedRowKeys: []
          });
        } else {
          Modal.error({
            title: '系统错误'
          });
        }
      },
      error(){
        _this.setState({
          loading: false,
        });
        Modal.error({
          title: '服务器连接失败',
        });
      }
    })
  },
  //搜索时间段的开始时间点击函数
  dayStartChange(date, dateString){
    this.setState({
      dayStart: date,
      dayStartString: dateString
    })
  },
  //搜索时间段的结束时间点击函数
  dayEndChange(date, dateString){
    this.setState({
      dayEnd: date,
      dayEndString: dateString
    })
  },
  //搜索时间段的开始时间函数
  disabledDayStart(disabledDayStart){
    if (!disabledDayStart || !this.state.dayEnd) {
      return false;
    }
    return disabledDayStart.getTime() + 3600000 >= this.state.dayEnd.getTime();
  },
  //搜索时间段的结束时间函数
  disabledDayEnd(disabledDayEnd){
    if (!disabledDayEnd || !this.state.dayStart) {
      return false;
    }
    return disabledDayEnd.getTime() - 3600000 <= this.state.dayStart.getTime();
  },
  //时间格式化
  timeFormat: function (da) {
    da = new Date(da);
    let year = da.getFullYear();
    let month = da.getMonth() + 1;
    let date = da.getDate();
    return ([year, month, date].join('-'));
  },
  //获取所有的测试类型
  logTypeAll(){
    let _this = this;
    ajax({
      url: 'getLogTypeList.do',
      type: 'post',
      success: function (res) {
        if (res.ret === 'SUCCESS') {
          let logTypeData;
          if (typeof res.data == 'string') {
            Modal.warning({
              title: '日志类型为空，请先添加日志类型在来查看日志列表'
            });
            logTypeData = [];
            return;
          } else {
            logTypeData = res.data
          }
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
  //改变类型回调
  blogTypeChange(value){
    console.log(value);
    let blogTypeValue;
    if (value == 'changeType') {
      blogTypeValue = undefined
    } else {
      blogTypeValue = value
    }
    this.setState({
      blogTypeValue: blogTypeValue
    })
  },
  //点击搜索查询
  handleSearch(){
    let _this = this;
    this.setState({
      loading: true,
      searchBlogName: this.refs.searchName.refs.input.value,
      searchTypeValue: this.state.blogTypeValue,
      searchDayStart: this.state.dayStartString,
      searchDayEnd: this.state.dayEndString
    });
    let data = {
      curPage: 1,
      obj: {
        blogName: this.refs.searchName.refs.input.value,
        blogType: {blogTypeId: this.state.blogTypeValue},
        startTime: this.state.dayStartString,
        endTime: this.state.dayEndString
      }
    };
    //console.log(data);
    ajax({
      url: 'getLogList.do',
      type: 'post',
      data: data,
      success(res){
        //console.log(res);
        _this.setState({
          loading: false
        });
        if (res.ret == 'SUCCESS') {
          let dataList = res.data.data || [];
          for (var i = 0; i < dataList.length; i++) {
            dataList[i].Updated = _this.timeFormat(dataList[i].updateTime)
          }
          let pagination = {
            total: res.data.rowCount,
            showTotal: function () {
              return ('共' + res.data.rowCount + '条')
            },
            pageSize: res.data.pageSize,
            current: 1,
            onChange(current){
              _this.handlePageChange(current)
            }
          };
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
      error(){
        _this.setState({
          loading: false
        });
        Modal.error({
          title: '服务器连接失败',
        });
      }
    })
  },
  //分页操作
  handlePageChange(current){
    let _this = this;
    this.setState({
      loading: true
    });
    let data = {
      curPage: current,
      obj: {
        blogName: this.state.searchBlogName,
        blogType: {blogTypeId: this.state.searchTypeValue},
        startTime: this.state.searchDayStart,
        endTime: this.state.searchDayEnd
      }
    };
    ajax({
      url: 'getLogList.do',
      type: 'post',
      data: data,
      success(res){
        _this.setState({
          loading: false
        });
        if (res.ret == 'SUCCESS') {
          let dataList = res.data.data || [];
          for (var i = 0; i < dataList.length; i++) {
            dataList[i].Updated = _this.timeFormat(dataList[i].updateTime)
          }
          let pagination = {
            total: res.data.rowCount,
            showTotal: function () {
              return ('共' + res.data.rowCount + '条')
            },
            pageSize: res.data.pageSize,
            current: current,
            onChange(current){
              _this.handlePageChange(current)
            }
          };
          _this.setState({
            data: res.data.data,
            pagination: pagination,
            selectedRowKeys: []
          });
        } else {
          Modal.error({
            title: '系统错误'
          });
        }
      },
      error(){
        _this.setState({
          loading: false
        });
        Modal.error({
          title: '服务器连接失败'
        });
      }
    })
  },
  //添加对话框显示
  addDataLogClick(){
    this.setState({
      addLogVisible: true
    })
  },
  //确定添加
  addDataLogOk(){
    this.setState({
      addLogVisible: false
    });
    this.refs.dataLogAdd.resetFields();
    this.handlePageChange(this.state.pagination.current);
  },
  //取消添加
  addDataLogCancel(){
    this.setState({
      addLogVisible: false
    });
    this.refs.dataLogAdd.resetFields();
  },

  //详情信息
  dataLogInfoClick(id){
    let _this = this;
    this.setState({
      loading: true
    });
    ajax({
      url: 'getLogInfo.do',
      type: 'post',
      data: {blogId: id},
      success(res){
        // console.log(res);
        _this.setState({
          loading: false
        });
        if (res.ret === 'SUCCESS') {
          _this.setState({
            changeDataLogVisible: true,
            changeBlogId: id
          });
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
      },
      error(){
        _this.setState({
          loading: false
        });
        Modal.error({
          title: '服务器异常'
        })
      }
    })
  },
  //确定修改
  changeDataLogOk(){
    let _this = this;
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        this.setState({
          changeDataLogLoading: true
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
              changeDataLogVisible: false,
              changeDataLogLoading: false
            });
            if (res.ret == 'SUCCESS') {
              _this.handleSearch();
            } else {
              Modal.error({
                title: '系统错误,修改日志失败'
              });
            }
          },
          error: function (res) {
            Modal.error({
              title: '服务连接失败'
            });
          }
        })
      }
    })
  },
  //退出修好对话框
  changeDataLogCancel(){
    this.setState({
      changeDataLogVisible: false,
      changeDataLogLoading: false
    })
  },

  //单项删除对话框显示
  delDataLogClick(id){
    //console.log(id);
    this.setState({
      deleteDataLogVisible: true,
      delBlogId: id
    })
  },
  //单项删除确定
  deleteDataLogOk(){
    let _this = this;
    this.setState({
      deleteDataLogLoading: true
    });
    let data = [this.state.delBlogId];
    ajax({
      url: 'deleteLog.do',
      type: 'post',
      data: data,
      success(res){
        _this.setState({
          deleteDataLogLoading: false
        });
        if (res.ret == 'SUCCESS') {
          _this.setState({
            deleteDataLogVisible: false
          });
          Modal.success({
            title: res.data
          });
          if (_this.state.pagination.total % _this.state.pagination.pageSize === 1 && _this.state.pagination.current === Math.ceil(_this.state.pagination.total / _this.state.pagination.pageSize) && _this.state.pagination.current !== 1) {
            _this.handlePageChange(_this.state.pagination.current - 1)
          } else {
            _this.handlePageChange(_this.state.pagination.current);
          }
        } else {
          Modal.error({
            title: res.data
          });
        }
      },
      error(){
        _this.setState({
          deleteDataLogLoading: false
        });
        Modal.error({
          title: '服务器连接失败'
        });
      }
    })
  },
  //退出单项删除对话框
  deleteDataLogCancel(){
    this.setState({
      deleteDataLogVisible: false,
      deleteDataLogLoading: false
    })
  },
  //选中项发生变化的时的回调
  onSelectChange(selectedRowKeys, selectedRows){
    //console.log(selectedRowKeys);
    this.setState({
      selectedRowKeys: selectedRowKeys
    });
  },
  //批量删除对话框显示
  deleteAllLog(){
    this.setState({
      deleteAllLogVisible: true
    })
  },
  //确定批量删除
  deleteAllogOk(){
    let _this = this;
    this.setState({
      deleteAllLogLoading: true
    });
    let data = this.state.selectedRowKeys;
    ajax({
      url: 'deleteLog.do',
      type: 'post',
      data: data,
      success(res){
        _this.setState({
          deleteAllLogLoading: false
        });
        if (res.ret == 'SUCCESS') {
          _this.setState({
            deleteAllLogVisible: false
          });
          Modal.success({
            title: res.data
          });
          if (_this.state.pagination.total % _this.state.pagination.pageSize === _this.state.selectedRowKeys.length && _this.state.pagination.current === Math.ceil(_this.state.pagination.total / _this.state.pagination.pageSize) && _this.state.pagination.current !== 1) {
            _this.handlePageChange(_this.state.pagination.current - 1)
          } else {
            _this.handlePageChange(_this.state.pagination.current);
          }
          _this.setState({
            selectedRowKeys: []
          })
        } else {
          Modal.error({
            title: res.data
          });
        }
      },
      error(){
        _this.setState({
          deleteAllLogLoading: false
        });
        Modal.error({
          title: '服务器连接失败'
        });
      }
    })
  },
  //取消批量删除操作
  deleteAllogCancel(){
    this.setState({
      deleteAllLogVisible: false,
      deleteAllLogLoading: false
    })
  },
  render(){

    const { selectedRowKeys } = this.state;
    //table选项功能配置
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;

    const { getFieldProps } = this.props.form;
    const changeBlogName = getFieldProps('changeBlogName', {
      rules: [
        {required: true,  pattern:/^(?=[0-9a-zA-Z\u4e00-\u9fa5]+$)/, message: '请输入正确的日志名称'}
      ]
    });
    const changeCmName = getFieldProps('changeCmName', {
      rules: [
        {required: true, pattern:/^(?=[0-9a-zA-Z\u4e00-\u9fa5]+$)/, message: '请输入正确的应用名称'}
      ]
    });
    const changeContent = getFieldProps('textarea', {
      rules: [
        {required: true, min: 0, message: '日志描述不能为空'},
      ]
    });
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 12}
    };
    return (
      <div>
        <div className="dataTitle">
          <h2>资料日志记录查询：</h2>
        </div>
        {/*搜索需求*/}
        <Row className="dataSearch">
          <Col>
            <Button type="primary" onClick={this.deleteAllLog} disabled={!hasSelected}
                    style={{marginRight:20}}>删除</Button>
            <label>日志名称</label>
            <Input type="text" ref="searchName" style={{width:80,marginRight:10}}/>
            <label>日志类型：</label>
            <Select onChange={this.blogTypeChange} defaultValue="changeType" style={{ width: 90, marginRight: 10 }}>
              <Option value='changeType' key='123'>全部</Option>
              {this.state.logTypeData.map(function (item, index) {
                return <Option value={item.blogTypeId} key={index}>{item.typeName}</Option>
              })
              }
            </Select>
            <label>开始时间</label>
            <DatePicker value={this.state.dayStart}
                        onChange={this.dayStartChange}
                        disabledDate={this.disabledDayStart}
                        placeholder="开始日期"
                        style={{width:100,marginRight:10}}/>
            <label>结束时间</label>
            <DatePicker value={this.state.dayEnd}
                        onChange={this.dayEndChange}
                        disabledDate={this.disabledDayEnd}
                        placeholder="结束日期"
                        style={{width:100,marginRight:20}}/>
            <Button type="primary" onClick={this.handleSearch}><Icon type="search"/></Button>
            <Button type="primary" onClick={this.addDataLogClick} style={{float:'right'}}>新增资料</Button>
          </Col>
        </Row>
        {/*数据列表*/}
        <Table rowKey={function(item){return item.blogId}}
               className="dataSearchTable"
               rowSelection={rowSelection}
               columns={this.state.columns}
               dataSource={this.state.data}
               pagination={this.state.pagination}
               loading={this.state.loading}
               size="middle" bordered/>
        {/*添加操作*/}
        <Modal title="新增日志"
               wrapClassName="vertical-center-modal"
               visible={this.state.addLogVisible}
               closable={false}
               maskClosable={false}
               footer="">
          <AddDataLog onOk={this.addDataLogOk} onCancel={this.addDataLogCancel} logTypeData={this.state.logTypeData}
                      ref="dataLogAdd"/>
        </Modal>
        {/*修改日志*/}
        <Modal title="修改日志"
               visible={this.state.changeDataLogVisible}
               onOk={this.changeDataLogOk}
               onCancel={this.changeDataLogCancel}
               confirmLoading={this.state.changeDataLogLoading}>
          <Form horizontal>
            <FormItem {...formItemLayout} label="日志名称" hasFeedback>
              <Input {...changeBlogName} placeholder="请输入日志名称"/>
            </FormItem>
            <FormItem {...formItemLayout} label="应用名称" hasFeedback>
              <Input {...changeCmName} placeholder="请输入应用名称"/>
            </FormItem>
            <FormItem {...formItemLayout} label="日志类型" required>
              <Select {...getFieldProps('select') } id="searchLogSelect">
                {this.state.logTypeData.map(function (item, index) {
                  return <Option value={item.blogTypeId} key={index}>{item.typeName}</Option>
                })}
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="日志内容" hasFeedback>
              <Input {...changeContent} type="textarea" style={{ resize: 'none' }} rows={6} placeholder="日志内容描述"
                                        id="textarea" name="textarea"/>
            </FormItem>
          </Form>
        </Modal>
        {/*删除操作*/}
        <Modal title="删除提示："
               visible={this.state.deleteDataLogVisible}
               onOk={this.deleteDataLogOk}
               onCancel={this.deleteDataLogCancel}
               confirmLoading={this.state.deleteDataLogLoading}
               maskClosable={false}>
          <h4>确定要删除吗？</h4>
        </Modal>


        {/*批量删除操作*/}
        <Modal title="批量删除提示："
               visible={this.state.deleteAllLogVisible}
               onOk={this.deleteAllogOk}
               onCancel={this.deleteAllogCancel}
               confirmLoading={this.state.deleteAllLogLoading}
               maskClosable={false}>
          <h4>确定要删除已选择项吗？</h4>
        </Modal>
      </div>
    )
  }
});
DataLog = createForm()(DataLog);
export default DataLog;
