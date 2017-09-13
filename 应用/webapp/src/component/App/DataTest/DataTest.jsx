import React from 'react';
import {browserHistory} from 'react-router';
import ajax from '../../../common/ajax';
import $ from 'jquery';
import { Row,Col,Button,Table,Input,Icon,Modal,Form,Radio,DatePicker,Upload } from 'antd';
import { fileLoads } from '../../../common/fileUploads';
import AddDataTest from './AddDataTest'
const createForm = Form.create;
const FormItem = Form.Item;

let DataTest = React.createClass({
  getInitialState(){
    let _this = this;
    return {
      columns: [
        {title: "测试名称", width: "10%", dataIndex: "fnName"},
        {title: "所属单位", width: "10%", dataIndex: "companyName"},
        {title: "负责人姓名", width: "10%", dataIndex: "managerName"},
        {title: "负责人手机", width: "10%", dataIndex: "managerPhone"},
        {title: "测试地址", width: "15%", dataIndex: "fnUrl"},
        {title: "测试服务器IP", width: "10%", dataIndex: "fnIp"},
        {title: "应用版本", width: "10%", dataIndex: "fnVersion"},
        {title: "更新时间", width: "10%", dataIndex: "Updated"},
        {
          title: "操作", width: "15%", dataindex: "operation", render: function (text, record, index) {
          return (
            <div className="operationbtn">
              <a href="javascript:" onClick={_this.InfoTestClick.bind(null,record.testId,'info')}>详情</a>
              <span className="ant-divider"></span>
              <a href="javascript:" onClick={_this.InfoTestClick.bind(null,record.testId,'change')}>修改</a>
              <span className="ant-divider"></span>
              <a href="javascript:" onClick={_this.delTestClick.bind(null,record.testId)}>删除</a>
            </div>
          )
        }
        }
      ],
      selectedRowKeys: [],
      addVisible: false,
      deleteVisible: false,
      deleteAllVisible: false,
      infoVisible: false,
      changeTestVisible: false,
      fileUploadsList: [],
      removeFileList: [],
      fileUploadData: []
    }
  },
  componentDidMount(){
    let _this = this;
    this.setState({
      loading: true
    });
    let data = {
      curPage: 1
    };
    ajax({
      url: 'getTestList.do',
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
            dataList[i].Updated = _this.timeFormat(dataList[i].dateUpdateTime)
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
  //点击搜索查询
  handleSearch(){
    let _this = this;
    this.setState({
      loading: true,
      testfnName: this.refs.testfnName.refs.input.value,
      testManagerName: this.refs.testManagerName.refs.input.value,
      testDayStart: this.state.dayStartString,
      testDayEnd: this.state.dayEndString
    });
    let data = {
      curPage: 1,
      obj: {
        fnName: this.refs.testfnName.refs.input.value,
        managerName: this.refs.testManagerName.refs.input.value,
        startTime: this.state.dayStartString,
        endTime: this.state.dayEndString
      }
    };
    ajax({
      url: 'getTestList.do',
      type: 'post',
      data: data,
      success(res){
        _this.setState({
          loading: false
        });
        if (res.ret == 'SUCCESS') {
          let dataList = res.data.data || [];
          for (var i = 0; i < dataList.length; i++) {
            dataList[i].Updated = _this.timeFormat(dataList[i].dateUpdateTime)
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
        fnName: this.state.testfnName,
        managerName: this.state.testManagerName,
        startTime: this.state.testDayStart,
        endTime: this.state.testDayEnd
      }
    };
    ajax({
      url: 'getTestList.do',
      type: 'post',
      data: data,
      success(res){
        _this.setState({
          loading: false
        });

        if (res.ret == 'SUCCESS') {
          let dataList = res.data.data || [];
          for (var i = 0; i < dataList.length; i++) {
            dataList[i].Updated = _this.timeFormat(dataList[i].dateUpdateTime)
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

  //添加测试对话框显示
  addTestClick(){
    this.setState({
      addVisible: true
    })
  },
  //添加操作确定
  addTestOk(){
    this.setState({
      addVisible: false
    });
    this.refs.testAdd.resetFields();
    this.handlePageChange(this.state.pagination.current);
  },
  //取消添加
  addTestCancel(){
    this.setState({
      addVisible: false
    });
    this.refs.testAdd.resetFields();
  },

  //详情数据
  InfoTestClick(id, classify){
    let _this = this;
    this.setState({
      loading: true
    });
    ajax({
      url: 'getTestInfo.do',
      type: 'post',
      data: {testId: id},
      success(res){
        //console.log(res);
        _this.setState({
          loading: false
        });
        if (res.ret == 'SUCCESS') {
          if (classify == 'info') {
            let testTime = _this.timeFormat(res.data.dateUpdateTime);
            _this.setState({
              infoVisible: true,
              infoFnName: res.data.fnName,
              infoDescr: res.data.descr,
              infoCompanyName: res.data.companyName,
              infoManagerName: res.data.managerName,
              infoManagerPhone: res.data.managerPhone,
              infoFnTestSys: res.data.fnTestSys,
              infoFnIp: res.data.fnIp,
              infoFnVersion: res.data.fnVersion,
              infoFnDb: res.data.fnDb,
              infoFnCpu: res.data.fnCpu,
              infoFnMenmery: res.data.fnMemery,
              infoFnMnDisk: res.data.fnDisk,
              infoFnUrl: res.data.fnUrl,
              infoTestTime: testTime,
              fileUploadData: res.data.fileUploads
            });
            //文件详情
            _this.file(res)
          } else if (classify == 'change') {
            _this.setState({
              changeTestVisible: true,
              changeTestId: res.data.testId
            });
            _this.props.form.setFieldsValue({
              changeFnName: res.data.fnName,
              textarea: res.data.descr,
              changeCompanyName: res.data.companyName,
              changeManagerName: res.data.managerName,
              changeManagerPhone: res.data.managerPhone,
              changeFnTestSys: res.data.fnTestSys,
              changeFnIp: res.data.fnIp,
              changeFnVersion: res.data.fnVersion,
              addFnDbValue: res.data.fnDb,
              changeFnCpu: res.data.fnCpu,
              changeFnMemery: res.data.fnMemery,
              changeFnMnDisk: res.data.fnDisk,
              changeFnUrl: res.data.fnUrl,
            });
            //文件处理
            let testFileArr = [];
            for (var j = 0; j < res.data.fileUploads.length; j++) {
              let testFileObj = {
                uid: -j,
                name: res.data.fileUploads[j].fileName,
                fileId: res.data.fileUploads[j].fileId,
                status: 'done',
                url: res.data.fileUploads[j].fileUrl,
                thumbUrl: res.data.fileUploads[j].fileUrl
              };
              testFileArr.push(testFileObj)
            }
            //console.log(testFileArr);
            _this.setState({
              fileUploadsList: testFileArr
            });
          }
        } else {
          Modal.error({
            title: '系统错误，文件加载失败'
          });
        }
      },
      error(){
        _this.setState({
          loading: false
        });
        Modal.error({
          title: '服务器错误'
        });
      }
    })
  },
  //点击详情里面加载文件信息
  file: function (res) {
    /*  清除上一次加载的信息*/
    $("#fileDataTitle").empty('');
    var fileUpload = res.data.fileUploads;
    if (fileUpload.length != 0) {
      var html = '<div class="info-title"> <h4>上传文件信息</h4></div>'
      $("#fileDataTitle").append(html);
    }
    return false;
  },
  //确定详情对话框
  infoTestOk(){
    let _this = this;
    this.setState({
      infoVisible: false
    });
    setTimeout(function () {
      _this.setState({
        fileUploadData: []
      })
    }, 40);
  },
  //取消详情对话框
  infoTestCancel(){
    let _this = this;
    this.setState({
      infoVisible: false
    });
    setTimeout(function () {
      _this.setState({
        fileUploadData: []
      })
    }, 40);
  },


  //修改时新增文件的数组
  fileHandleChange(info){
    //console.log(info.fileList);
    this.setState({
      fileUploadsList: info.fileList
    });
  },
  //修改时，需要删除文件的数组
  removeFileUpload(info){
    //保存移除文件的url
    //console.log(this.state.fileUploadsList);
    let url = info.url || info.response.data.url;

    let fileUploadArr = this.state.fileUploadsList;
    let obj = {fileUrl: url};
    //清除预览文件中删除的部分
    for (var i = 0; i < fileUploadArr.length; i++) {
      if (fileUploadArr[i].url == url) {
        fileUploadArr.splice(i, 1);
      } else {
        if (fileUploadArr[i].status == 'removed' && fileUploadArr[i].response.data.url == url) {
          fileUploadArr.splice(i, 1);
        }
      }
    }
    //需要清除的数组
    let removefileArr = this.state.removeFileList.concat([obj]);
    this.setState({
      removeFileList: removefileArr,
      fileUploadsList: fileUploadArr
    });
  },
  //确定修改
  changeTestOk(){
    let _this = this;
    let fileUploads = [];
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        //console.log(this.state.fileUploadsList);
        for (let i = 0; i < this.state.fileUploadsList.length; i++) {
          if (this.state.fileUploadsList[i].status != 'done') {
            Modal.error({
              title: '请等待图片上传完成'
            });
            return
          }
        }
        this.setState({
          changeTestLoading: true
        });
        for (let i = 0; i < this.state.fileUploadsList.length; i++) {
          let testFileUploadObj = {};
          if (this.state.fileUploadsList[i].url) {
            //console.log('url', this.state.fileUploadsList[i].url)
          } else {
            testFileUploadObj.fileId = this.state.fileUploadsList[i].response.data.fileId;
            testFileUploadObj.fileName = this.state.fileUploadsList[i].response.data.fileName;
            testFileUploadObj.fileUrl = this.state.fileUploadsList[i].response.data.url;
            let fileUploadTime = this.timeFormat(this.state.fileUploadsList[i].response.data.uploadTime);
            testFileUploadObj.uploadTime = fileUploadTime;
            fileUploads.push(testFileUploadObj)
          }
        }
        let changeTestData = {
          testId:this.state.changeTestId,
          fnName: values.changeFnName,
          descr: values.textarea,
          companyName: values.changeCompanyName,
          managerName: values.changeManagerName,
          managerPhone: values.changeManagerPhone,
          fnTestSys: values.changeFnTestSys,
          fnVersion: values.changeFnVersion,
          fnIp: values.changeFnIp,
          fnDb: values.addFnDbValue,
          fnCpu: values.changeFnCpu,
          fnMemery: values.changeFnMemery,
          fnDisk: values.changeFnMnDisk,
          fnUrl: values.changeFnUrl,
          fileUploads: fileUploads
        };
        //console.log(changeTestData);
        ajax({
          url: 'updateTest.do',
          type: 'post',
          data: changeTestData,
          success(res){
            //_this.setState({
            //  changeTestLoading: false
            //});
            //console.log(res);
            if (res.ret == 'SUCCESS') {
              //删除文件操作
              const removefileUrls = _this.state.removeFileList;

              if (removefileUrls.length != 0) {
                ajax({
                  url: 'deleteUpload.do',
                  type: 'post',
                  data: removefileUrls,
                  success: function (res) {
                    //console.log(res);
                    if (res.ret == 'SUCCESS') {

                      Modal.success({
                        title: '测试文件修改成功'
                      });
                      _this.setState({
                        changeTestVisible: false,
                        changeTestLoading: false,
                        fileUploadsList: [],
                        removeFileList: []
                      });
                      _this.handlePageChange(_this.state.pagination.current)
                    } else {
                      _this.setState({
                        changeTestLoading: false,
                      });
                      Modal.error({
                        title: '上传文件修改失败'
                      });
                    }
                  }
                })
              } else {
                Modal.success({
                  title: '测试文件修改成功'
                });
                _this.setState({
                  changeTestVisible: false,
                  changeTestLoading: false,
                  fileUploadsList: [],
                  removeFileList: []
                });
                _this.handlePageChange(_this.state.pagination.current)
              }
              //}


            } else {
              _this.setState({
                changeTestLoading: false
              });
              Modal.error({
                title: '测试信息修改失败'
              });
            }


            //  Modal.success({
            //    title: '应用测试资料修改成功'
            //  });
            //  _this.setState({
            //    changeTestVisible: false
            //  });
            //  _this.handleSearch()
            //} else {
            //  Modal.error({
            //    title: '应用测试资料修改失败，原因是文件删除失败或者图片删除失败'
            //  });
            //}
          },
          error(){
            _this.setState({
              changeTestLoading: false
            });
            Modal.error({
              title: '服务器错误'
            });
          }
        })
      }
    })
  },
  //取消修改
  changeTestCancel(){
    this.setState({
      changeTestVisible: false,
      changeTestLoading: false
    })
  },

  //单项删除操作
  delTestClick(id){
    this.setState({
      deleteVisible: true,
      delId: id
    })
  },
  //确定删除
  deleteTestOk(){
    let _this =this;
    this.setState({
      deleteTestLoading: true
    });
    ajax({
      url: 'deleteTest.do',
      type: 'post',
      data: [this.state.delId],
      success(res){
        _this.setState({
          deleteTestLoading: false
        });
        if (res.ret == 'SUCCESS') {
          _this.setState({
            deleteVisible: false
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
          deleteVisible: false
        });
        Modal.error({
          title: '服务器连接失败'
        });
      }
    })
  },
  //取消删除
  deleteTestCancel(){
    this.setState({
      deleteVisible: false,
      deleteTestLoading: false
    })
  },
  //选中项发生变化的时的回调
  onSelectChange(selectedRowKeys, selectedRows){
    //console.log(selectedRowKeys);
    this.setState({
      selectedRowKeys: selectedRowKeys
    });
  },
  //显示批量删除对话框
  deleteAllTestClick(){
    //console.log(this.state.selectedRowKeys);
    this.setState({
      deleteAllVisible: true
    })
  },
  //确定批量删除
  delAllTestOk(){
    let _this = this;
    this.setState({
      deleteAllLoading: true
    });
    let data = this.state.selectedRowKeys;
    ajax({
      url: 'deleteTest.do',
      type: 'post',
      data: data,
      success(res){
        _this.setState({
          deleteAllLoading: false
        });
        if (res.ret == 'SUCCESS') {
          _this.setState({
            deleteAllVisible: false
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
          deleteAllLoading: false
        });
        Modal.error({
          title: '服务器连接失败'
        });
      }
    })
  },
  //取消批量删除
  delAllTestCancel(){
    this.setState({
      deleteAllVisible: false,
      deleteAllLoading: false
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

    //修改表单
    const {getFieldProps} = this.props.form;
    const changeFnName = getFieldProps('changeFnName', {
      rules: [
        {required: true, message: '请输入测试名称'}
      ],
      validateTrigger: ['onChange']
    });
    const changeDescr = getFieldProps('textarea', {
      rules: [
        {required: true, message: '请输入测试描述'}
      ],
      validateTrigger: ['onChange']
    });
    const changeCompanyName = getFieldProps('changeCompanyName', {
      rules: [
        {required: true,  pattern: /^(?=[0-9a-zA-Z\u4e00-\u9fa5]+$)/, message: '请输入正确的所属单位名（不能使用特殊字符）'}
      ],
      validateTrigger: ['onChange']
    });
    const changeManagerName = getFieldProps('changeManagerName', {
      rules: [
        {required: true,pattern: /^([a-zA-Z\u4e00-\u9fa5]){2,50}$/, message: '请输入正确的姓名（最少为两个字符）'}
      ],
      validateTrigger: ['onChange']
    });
    const changeManagerPhone = getFieldProps('changeManagerPhone', {
      rules: [
        {required: true, pattern: /^(13[0-9]|15[0-9]|17[0-3]|17[5-8]|18[0-9])[0-9]{8}$/, message: '请输入正确的联系方式'}
      ],
      validateTrigger: ['onChange']
    });
    const changeFnTestSys = getFieldProps('changeFnTestSys', {
      rules: [
        {required: true, message: '请输入测试操作系统'}
      ],
      validateTrigger: ['onChange']
    });
    const changeFnVersion = getFieldProps('changeFnVersion', {
      rules: [
        {required: true, message: '请输入应用版本'}
      ],
      validateTrigger: ['onChange']
    });
    const changeFnIp = getFieldProps('changeFnIp', {
      rules: [
        {required: true,  pattern: /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-5][0-5])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/,
        message: '请输入正确的测试Ip地址'}
      ],
      validateTrigger: ['onChange']
    });
    const changeFnDb = getFieldProps('addFnDbValue', {
      rules: [
        {required: true, message: '数据库参数不能为空'}
      ],
      validateTrigger: ['onChange']
    });
    const changeFnCpu = getFieldProps('changeFnCpu', {
      rules: [
        {required: true, message: 'cpu性能要求不能为空'}
      ],
      validateTrigger: ['onChange']
    });
    const changeFnMemery = getFieldProps('changeFnMemery', {
      rules: [
        {required: true, message: '内存要求不能为空'}
      ],
      validateTrigger: ['onChange']
    });
    const changeFnMnDisk = getFieldProps('changeFnMnDisk', {
      rules: [
        {required: true, message: '硬盘要求不能为空'}
      ],
      validateTrigger: ['onChange']
    });
    const changeFnUrl = getFieldProps('changeFnUrl', {
      rules: [
        {required: true, message: '测试地址不能为空'}
      ],
      validateTrigger: ['onChange']
    });
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 12}
    };

    //上传文件
    const fileUpload = {
      action: fileLoads + 'fileUpload.do',
      fileList: this.state.fileUploadsList,
      onChange: this.fileHandleChange,
      onRemove: this.removeFileUpload,
      multiple: true,
      data(file) {
        return {filePath: '/arm/file'}
      }
    };
    return (
      <div>
        <div className="dataTitle">
          <h2>资料测试记录查询：</h2>
        </div>
        {/*搜索需求*/}
        <Row className="dataSearch">
          <Col>
            <Button type="primary" onClick={this.deleteAllTestClick} disabled={!hasSelected}
                    style={{marginRight:20}}>删除</Button>
            <label>测试名称</label>
            <Input type="text" ref="testfnName" style={{width:80,marginRight:10}}/>
            <label>负责人姓名</label>
            <Input type="text" ref="testManagerName" style={{width:80,marginRight:10}}/>
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
            <Button type="primary" onClick={this.addTestClick} style={{float:'right'}}>新增测试信息</Button>
          </Col>
        </Row>
        {/*数据列表*/}
        <Table rowKey={function(item){return item.testId}}
               className="dataSearchTable"
               rowSelection={rowSelection}
               columns={this.state.columns}
               dataSource={this.state.data}
               pagination={this.state.pagination}
               loading={this.state.loading}
               size="middle" bordered/>
        {/*添加数据模块*/}
        <Modal title="新增测试信息"
               style={{ top: 20 }}
               visible={this.state.addVisible}
               closable={false}
               maskClosable={false}
               footer="">
          <AddDataTest onOk={this.addTestOk} onCancel={this.addTestCancel} ref="testAdd"></AddDataTest>
        </Modal>
        {/*详情数据模块*/}
        <Modal title="资源详细信息："
               visible={this.state.infoVisible}
               onOk={this.infoTestOk}
               onCancel={this.infoTestCancel}
               confirmLoading={this.state.infoLoading}
               maskClosable={false}>
          <ul className="detailsFl">
            <li><label>测试名称:</label><span>{this.state.infoFnName}</span></li>
            <li><label>业务简介:</label><span>{this.state.infoDescr}</span></li>
            <li><label>所属单位:</label><span>{this.state.infoCompanyName }</span></li>
            <li><label>负责人姓名:</label><span>{this.state.infoManagerName }</span></li>
            <li><label>负责人电话:</label><span>{this.state.infoManagerPhone}</span></li>
            <li><label>服务器操作系统:</label><span>{this.state.infoFnTestSys}</span></li>
            <li><label>服务器ip:</label><span>{this.state.infoFnIp}</span></li>
            <li><label>应用版本:</label><span>{this.state.infoFnVersion}</span></li>
            <li><label>数据库参数:</label><span>{this.state.infoFnDb}</span></li>
            <li><label>cpu需求:</label><span>{this.state.infoFnCpu}</span></li>
            <li><label>内存需求:</label><span>{this.state.infoFnMenmery}</span></li>
            <li><label>硬盘需求:</label><span>{this.state.infoFnMnDisk}</span></li>
            <li><label>应用地址:</label><span>{this.state.infoFnUrl}</span></li>
            <li><label>更新时间:</label><span>{this.state.infoTestTime}</span></li>
          </ul>
          <div className="info" id="fileDataTitle"></div>
          {this.state.fileUploadData.map(function (item, index) {
            return (
              <div key={index} className="fileData">
                <Icon className="copyFile" type="copy"/>
                <p>{item.fileName}</p>
                <a href={item.fileUrl}>下载</a>
              </div>
            )
          })}
        </Modal>
        {/*修改数据模块*/}
        <Modal title="资源信息修改："
               style={{ top: 20 }}
               visible={this.state.changeTestVisible}
               onOk={this.changeTestOk}
               onCancel={this.changeTestCancel}
               confirmLoading={this.state.changeTestLoading}
               maskClosable={false}>
          <Form horizontal>
            <FormItem {...formItemLayout} label="测试名称" hasFeedback>
              <Input {...changeFnName} placeholder="请输入测试名称"/>
            </FormItem>
            <FormItem {...formItemLayout} label="描述" hasFeedback>
              <Input {...changeDescr} type="textarea" rows={4} style={{resize:'none'}} placeholder="请输入测试描述"
                                      id="textarea"
                                      name="textarea"/>
            </FormItem>
            <FormItem {...formItemLayout} label="所属单位" hasFeedback>
              <Input {...changeCompanyName} placeholder="请输入所属单位"/>
            </FormItem>
            <FormItem {...formItemLayout} label="负责人姓名" hasFeedback>
              <Input {...changeManagerName} placeholder="请输入测试负责人姓名"/>
            </FormItem>
            <FormItem {...formItemLayout} label="联系方式" hasFeedback>
              <Input {...changeManagerPhone} placeholder="请输入联系方式"/>
            </FormItem>
            <FormItem {...formItemLayout} label="操作系统" hasFeedback>
              <Input {...changeFnTestSys} placeholder="请输入测试操作系统"/>
            </FormItem>
            <FormItem {...formItemLayout} label="应用版本" hasFeedback>
              <Input {...changeFnVersion} placeholder="请输入应用版本"/>
            </FormItem>
            <FormItem {...formItemLayout} label="测试Ip" hasFeedback>
              <Input {...changeFnIp} placeholder="请输入测试服务器Ip"/>
            </FormItem>
            <FormItem {...formItemLayout} label="数据库参数" hasFeedback>
              <Input {...changeFnDb} type="textarea" rows={4} style={{resize:'none'}} placeholder="请输入测试描述"
                                     id="addFnDbValue"
                                     name="addFnDbValue"/>
            </FormItem>
            <FormItem {...formItemLayout} label="CPU性能" hasFeedback>
              <Input {...changeFnCpu} placeholder="请输入测试CPU性能"/>
            </FormItem>
            <FormItem {...formItemLayout} label="内存要求" hasFeedback>
              <Input {...changeFnMemery} placeholder="请输入测试内存要求"/>
            </FormItem>
            <FormItem {...formItemLayout} label="硬盘要求" hasFeedback>
              <Input {...changeFnMnDisk} placeholder="请输入测试硬盘要求"/>
            </FormItem>
            <FormItem {...formItemLayout} label="测试地址" hasFeedback>
              <Input {...changeFnUrl} placeholder="请输入测试地址"/>
            </FormItem>
            <FormItem {...formItemLayout} label="测试地址" hasFeedback>
              <Upload {...fileUpload}>
                <Button type="ghost">
                  <Icon type="upload"/> 点击上传
                </Button>
              </Upload>
            </FormItem>
          </Form>

        </Modal>

        {/*单项删除数据模块*/}
        <Modal title="系统提示："
               visible={this.state.deleteVisible}
               onOk={this.deleteTestOk}
               onCancel={this.deleteTestCancel}
               confirmLoading={this.state.deleteTestLoading}
               maskClosable={false}>
          <h4>确定要删除吗？</h4>
        </Modal>
        {/*批量删除数据模块*/}
        <Modal title="系统提示："
               visible={this.state.deleteAllVisible}
               onOk={this.delAllTestOk}
               onCancel={this.delAllTestCancel}
               confirmLoading={this.state.deleteAllLoading}
               maskClosable={false}>
          <h4>确定要删除已选择项吗？</h4>
        </Modal>
      </div>
    )
  }
});
DataTest = createForm()(DataTest);
export default DataTest;
