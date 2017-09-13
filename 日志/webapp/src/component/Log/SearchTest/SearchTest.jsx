import React from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import ajax from '../../../common/ajax';
import { Row, Col, Button, Table, Input, Select, Icon, DatePicker, Modal, Form, Radio, Upload } from 'antd';
import AddSearchTest from './AddSearchTest.jsx';
import '../Search/Search.css';
import { fileLoads } from '../../../common/fileUploads';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const createForm = Form.create;
const FormItem = Form.Item;


let SearchTest = React.createClass({
  //表格表头
  getInitialState() {
    /*return 表格数据*/
    return ({
      /*对话框是否可见  初始化对话框不可见*/
      infoSearchTestModal: false, /*详情对话框*/
      addSearchTestModal: false,  //添加对话框
      changeSearchTestModal: false, /*x修改对话框*/
      delSearchTestModal: false, /*删除对话框*/
      deleteTestAllVisible: false,
      testFileList: [],
      removeFileList: [],
      fileUploadData: [],
      selectedRowKeys: [],
      columns: [
        { title: "测试名字", width: "10%", dataIndex: "svName" },
        { title: "所属单位", width: "10%", dataIndex: "companyName" },
        { title: "负责人名字", width: "10%", dataIndex: "managerName" },
        { title: "负责人电话", width: "11%", dataIndex: "managerPhone" },
        { title: "测试操作系统", width: "11%", dataIndex: "stTestSys" },
        { title: "测试服务器ip", width: "11%", dataIndex: "stIp" },
        { title: "测试地址", width: "11%", dataIndex: "stUrl" },
        { title: "服务版本号", width: "11%", dataIndex: "stVersion" },
        {
          title: '操作', width: "15%", key: 'operation', render: (text, record) => (
            <span>
              <a href="javascript:;" id={record.serviceId}
                onClick={this.testInfoClick.bind(null, record.testId, 'searchTestInfo')}>详情</a>
              <span className="ant-divider"></span>
              <a href="javascript:;" onClick={this.testInfoClick.bind(null, record.testId, 'changeSearchTestInfo')}>修改</a>
              <span className="ant-divider"></span>
              <a href="javascript:;" onClick={this.deleteSearchTestClick.bind(null, record.testId)}>删除</a>
            </span>)
        },
      ]
    });
  },
  //点击搜索
  handleSearchTest(searchUrl) {
    let _this = this;
    this.setState({
      svName: this.refs.testName.refs.input.value,
      managerName: this.refs.testManagerName.refs.input.value,
     
      startTime: this.state.dayStartString,
      endTime: this.state.dayEndString
    });
    let data = {
      curPage: 1,
      obj: {
        svName: this.refs.testName.refs.input.value,
        managerName: this.refs.testManagerName.refs.input.value,
       
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
              _this.handlePageChange(current, 'getTestList')
            }
          };
          let dataArr = res.data.data || []
          for (var i = 0; i < dataArr.length; i++) {
            dataArr[i].methodUpdateTime = _this.timeFormat(dataArr[i].stUpdateTime)
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
  /*点击分页*/
  handlePageChange: function (current, searchTestUrl) {
    let _this = this;
    let data = {
      curPage: current,
      obj: {
        svName: this.state.svName,
        managerName: this.state.managerName,
       
        startTime: this.state.dayStartString,
        endTime: this.state.dayEndString
      }
    };
    this.setState({
      loading: true,
    });
    ajax({
      url: searchTestUrl + '.do',
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
              _this.handlePageChange(current, 'getTestList')
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
  componentDidMount: function () {
    this.handleSearchTest('getTestList');
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
  //点击详情里面加载文件信息
  file: function (res) {
    /*  清除上一次加载的信息*/
    $("#changeFile").empty('');
    var fileUpload = res.data.fileUploads;
    if (fileUpload.length != 0) {
      var html = '<div class="info-title"> <h4>上传文件信息</h4></div>'
      $("#changeFile").append(html);
    }
    return false;
  },
  //详情页面展示数据
  testInfoClick(testId, test) {
    let _this = this;
    this.setState({
      loading: true
    });
    ajax({
      url: 'getTestInfo.do',
      type: 'post',
      data: { testId: testId },
      success: function (res) {
        // console.log(res);
        _this.setState({
          loading: false
        });
        if (res.ret === 'SUCCESS') {
          if (test === 'searchTestInfo') {
            //详情页面数据处理
            _this.setState({
              infoSearchTestModal: true
            });
            _this.setState({
              infoSvName: res.data.svName,
              infoSvDescr: res.data.svDescr,
              infoCompanyName: res.data.companyName,
              infoManagerPhone: res.data.managerPhone,
              infoManagerName: res.data.managerName,
              infoStTestSys: res.data.stTestSys,
              infoStIp: res.data.stIp,
              infoStVersion: res.data.stVersion,
              infoStDb: res.data.stDb,
              infoStCpu: res.data.stCpu,
              infoStMemery: res.data.stMemery,
              infoStDisk: res.data.stDisk,
              infoStUrl: res.data.stUrl,
              infoStUpdateTime: _this.timeFormat(res.data.stUpdateTime),
              fileUploadData: res.data.fileUploads
            });
            //文件详情
            _this.file(res)
          } else if (test === 'changeSearchTestInfo') {
            //修改对话框初始化数据
            _this.setState({
              changeSearchTestModal: true,
              testId: testId
            });
            // Form表单 初始化数据
            _this.props.form.setFieldsValue({
              changeSvName: res.data.svName,
              changeSvDescr: res.data.svDescr,
              changeCompanyName: res.data.companyName,
              changeManagerName: res.data.managerName,
              changeManagerPhone: res.data.managerPhone,
              changeStTestSys: res.data.stTestSys,
              changeStVersion: res.data.stVersion,
              changeStIp: res.data.stIp,
              changeStDb: res.data.stDb,
              changeStCpu: res.data.stCpu,
              changeStMemery: res.data.stMemery,
              changeStDisk: res.data.stDisk,
              changeStUrl: res.data.stUrl
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
            console.log(testFileArr);
            _this.setState({
              testFileList: testFileArr
            });
          }
        }
      }
    });
  },
  //详情页面确定键
  infoSearchTestOk() {
    let _this = this
    this.setState({
      infoSearchTestModal: false,
    })
    setTimeout(function () {
      _this.setState({
        fileUploadData: []
      })
    }, 40);
  },
  //新增方法
  addSearchTestClick() {
    this.setState({
      addSearchTestModal: true //显示添加方法对话框
    })
  },
  //父子组件传值回调函数
  searchTestChange(testChange) {
    this.setState({
      addSearchTestModal: testChange
    });
    this.handleSearchTest('getTestList');
  },
  //修改操作
  changeSearchTestOk() {
    let _this = this
    let testFileArr = [];
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        for (let i = 0; i < this.state.testFileList.length; i++) {
          if (this.state.testFileList[i].status != 'done') {
            Modal.error({
              title: '请等待图片上传完成'
            });
            return
          }
        }
        this.setState({
          changeConfirmLoading: true
        });
        for (var i = 0; i < this.state.testFileList.length; i++) {
          let testFileUploadObj = {};
          if (this.state.testFileList[i].url) {
            //console.log('url', this.state.testFileList[i].url)
          } else {
            testFileUploadObj.fileId = this.state.testFileList[i].response.data.fileId;
            testFileUploadObj.fileName = this.state.testFileList[i].response.data.fileName;
            testFileUploadObj.fileUrl = this.state.testFileList[i].response.data.url;
            let fileUploadTime = this.timeFormat(this.state.testFileList[i].response.data.uploadTime);
            testFileUploadObj.uploadTime = fileUploadTime;
            testFileArr.push(testFileUploadObj)
          }
        }
        let changeTestData = {
          testId: _this.state.testId,
          svName: values.changeSvName,
          svDescr: values.changeSvDescr,
          companyName: values.changeCompanyName,
          managerName: values.changeManagerName,
          managerPhone: values.changeManagerPhone,
          stTestSys: values.changeStTestSys,
          stIp: values.changeStIp,
          stDb: values.changeStDb,
          stVersion: values.changeStVersion,
          stCpu: values.changeStCpu,
          stMemery: values.changeStMemery,
          stDisk: values.changeStDisk,
          stUrl: values.changeStUrl,
          fileUploads: testFileArr
        };
        console.log(changeTestData)
        ajax({
          url: 'updateTest.do',
          type: 'post',
          data: changeTestData,
          success: function (res) {
            console.log(_this.state.removeFileList);
            if (res.ret == 'SUCCESS') {
              //删除文件操作
              const removefileUrls = _this.state.removeFileList;

              //for (var j = 0; j < removefileUrls.length; j++) {
              //  let removefileUrl = removefileUrls[j].url;
              if (removefileUrls.length != 0) {
                ajax({
                  url: 'deleteUpload.do',
                  type: 'post',
                  data: removefileUrls,
                  success: function (res) {
                    console.log(res);
                    if (res.ret == 'SUCCESS') {
                      //_this.setState({
                      //  removeFileList: []
                      //})
                      Modal.success({
                        title: '测试文件修改成功'
                      });
                      _this.setState({
                        changeSearchTestModal: false,
                        changeConfirmLoading: false,
                        testFileUploadArr: [],
                        testFileList: [],
                        removeFileList: []
                      });
                      _this.handlePageChange(_this.state.pagination.current, 'getTestList')
                    } else {
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
                  changeSearchTestModal: false,
                  changeConfirmLoading: false,
                  testFileUploadArr: [],
                  testFileList: [],
                  removeFileList: []
                });
                _this.handlePageChange(_this.state.pagination.current, 'getTestList')
              }
              //}


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
  //删除测试信息对话框
  deleteSearchTestClick(testId) {
    this.setState({
      delSearchTestModal: true,
      testId: testId
    })
  },
  //确定删除
  deleteSearchTestOk() {
    let _this = this
    this.setState({
      loading: true
    });
    ajax({
      url: 'deleteTest.do',
      type: 'post',
      data: [this.state.testId],
      success: function (res) {
        _this.setState({
          loading: false,
          delSearchTestModal: false
        });
        if (res.ret == 'SUCCESS') {
          Modal.success({
            title: '删除方法成功！'
          });
          _this.handleSearchTest('getTestList');
        } else {
          Modal.error({
            title: '系统错误，删除方法失败'
          });
        }
      },
      error: function (res) {
        Modal.error({
          title: '服务器错误'
        });
      }
    })
  },
  /*弹窗里面 点击遮罩层或右上角叉或取消按钮的回调 */
  handleCancel() {
    let _this = this;
    this.setState({
      infoSearchTestModal: false,
      addSearchTestModal: false,
      changeSearchTestModal: false,
      delSearchTestModal: false,
    });
    setTimeout(function () {
      _this.setState({
        fileUploadData: []
      })
    }, 40);
  },
  testFileChange(info) {
    this.setState({
      testFileList: info.fileList
    });
    // let testFileArr = [];
    // for (var i = 0; i < info.fileList.length; i++) {
    //   let testFileUploadObj = {};
    //   if (info.fileList[i].url) {
    //     //console.log('url', info.fileList[i].url)
    //   } else {
    //     if (info.file.status === 'done') {
    //       testFileUploadObj.fileId = info.fileList[i].response.data.fileId;
    //       testFileUploadObj.fileName = info.fileList[i].response.data.fileName;
    //       testFileUploadObj.fileUrl = info.fileList[i].response.data.url;
    //       let fileUploadTime = this.timeFormat(info.fileList[i].response.data.uploadTime);
    //       testFileUploadObj.uploadTime = fileUploadTime;
    //       testFileArr.push(testFileUploadObj)
    //     }
    //   }
    // }
    // this.setState({
    //   testFileUploadArr: testFileArr
    // })
  },
  removeFileChange(info) {
    //保存移除文件的url
    console.log(this.state.testFileList);
    let url = info.url || info.response.data.url;

    let fileUploadArr = this.state.testFileList;
    let obj = { fileUrl: url };
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
      testFileList: fileUploadArr
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
      deleteTestAllVisible: true
    })
  },
  // 确定批量删除
  deleteTestAllOk(){
    let _this = this;
    this.setState({
      deleteTestAllLoading: true
    });
    let data = this.state.selectedRowKeys;
    ajax({
      url: 'deleteTest.do',
      type: 'post',
      data: data,
      success(res) {
        _this.setState({
          deleteTestAllLoading: false
        });
        if (res.ret == 'SUCCESS') {
          _this.setState({
            deleteTestAllVisible: false
          });
          if (_this.state.pagination.total % _this.state.pagination.pageSize === _this.state.selectedRowKeys.length && _this.state.pagination.current === Math.ceil(_this.state.pagination.total / _this.state.pagination.pageSize) && _this.state.pagination.current !== 1) {
            _this.handlePageChange(_this.state.pagination.current - 1, 'getTestList')
          } else {
            _this.handlePageChange(_this.state.pagination.current, 'getTestList');
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
          deleteTestAllLoading: false
        });
        Modal.error({
          title: '服务器连接失败'
        });
      }
    })
  },
  // 取消批量删除对话框
  deleteTestAllCancel() {
    this.setState({
      deleteTestAllVisible: false,
      deleteTestAllLoading: false
    })
  },
  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    const changeSvName = getFieldProps('changeSvName', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const changeSvDescr = getFieldProps('changeSvDescr', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const changeCompanyName = getFieldProps('changeCompanyName', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const changeManagerName = getFieldProps('changeManagerName', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const changeManagerPhone = getFieldProps('changeManagerPhone', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const changeStTestSys = getFieldProps('changeStTestSys', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const changeStVersion = getFieldProps('changeStVersion', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const changeStIp = getFieldProps('changeStIp', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const changeStDb = getFieldProps('changeStDb', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const changeStCpu = getFieldProps('changeStCpu', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const changeStMemery = getFieldProps('changeStMemery', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const changeStDisk = getFieldProps('changeStDisk', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const changeStUrl = getFieldProps('changeStUrl', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };

    //上传文件
    const testFileUpload = {
      action: fileLoads + 'fileUpload.do',
      fileList: this.state.testFileList,
      onChange: this.testFileChange,
      onRemove: this.removeFileChange,
      multiple: true,
      data(file) {
        return { filePath: '/arm/file' }
      }
    };

    // 批量删除选择按钮
    const { selectedRowKeys } = this.state;
    //table选项功能配置
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;

    return (
      <div>
        <div className="logTitle">
          <h2>服务测试列表</h2>
        </div>
        {/*搜索限定条件*/}
        <Row className="logSearch">
          <Col>
            <Button type="primary" onClick={this.deleteAll} disabled={!hasSelected} style={{ marginRight: 20 }}>删除</Button>
            <label>测试名称</label>
            <Input type="text" ref="testName" style={{ width: 80, marginRight: 10 }} />
            <label>负责人名字</label>
            <Input type="text" ref="testManagerName" style={{ width: 80, marginRight: 10 }} />
            <label>时间段</label>
            <div id="trendDay">
              <DatePicker value={this.state.dayStartString} onChange={this.startTimeChange}
                disabledDate={this.startTimeStart} placeholder="开始日期" style={{ width: 100 }} />
              <span>-</span>
              <DatePicker value={this.state.dayEndString} onChange={this.endTimeChange} disabledDate={this.startTimeEnd}
                placeholder="结束日期" style={{ width: 100 }} />
            </div>
            <Button type="primary" style={{ marginLeft: 20 }}
              onClick={this.handleSearchTest.bind(null, 'getTestList')}><Icon type="search" /></Button>
            <Button type="primary" onClick={this.addSearchTestClick} style={{ float: 'right' }}>新增测试信息</Button>
          </Col>
        </Row>
        {/*表格详情*/}
        <Table className="logSearchTable"
          rowKey={function (item) { return item.testId }}
          rowSelection={rowSelection}
          columns={this.state.columns}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          size="middle" bordered />

        {/*资源详细信息*/}
        <Modal title="资源详细信息" visible={this.state.infoSearchTestModal}
          onOk={this.infoSearchTestOk} onCancel={this.handleCancel}>
          <ul className="detailsFl">
            <li><label>测试名称:</label><span>{this.state.infoSvName}</span></li>
            <li><label>业务简介:</label><span>{this.state.infoSvDescr}</span></li>
            <li><label>所属单位:</label><span>{this.state.infoCompanyName}</span></li>
            <li><label>负责人名字:</label><span>{this.state.infoManagerPhone}</span></li>
            <li><label>负责人电话:</label><span>{this.state.infoManagerName}</span></li>
            <li><label>测试服务器系统:</label><span>{this.state.infoStTestSys}</span></li>
            <li><label>测试服务器ip:</label><span>{this.state.infoStIp}</span></li>
            <li><label>服务版本号:</label><span>{this.state.infoStVersion}</span></li>
            <li><label>数据库详细参数:</label><span>{this.state.infoStDb}</span></li>
            <li><label>CPU性能要求:</label><span>{this.state.infoStCpu}</span></li>
            <li><label>内存需求:</label><span>{this.state.infoStMemery}</span></li>
            <li><label>硬盘需求:</label><span>{this.state.infoStDisk}</span></li>
            <li><label>测试地址:</label><span>{this.state.infoStUrl}</span></li>
            <li><label>更新时间:</label><span>{this.state.infoStUpdateTime}</span></li>
          </ul>
          <div className="info" id="changeFile"></div>
          {
            this.state.fileUploadData.map(function (item, index) {
              return (
                <div key={index} className="fileData">
                  <Icon className="copyFile" type="copy" />
                  <p>{item.fileName}</p>
                  <a href={item.fileUrl}>下载</a>
                </div>
              )
            })
          }
        </Modal>

        {/*新增测试模块*/}
        <Modal title="新增测试"
          style={{ top: 20 }}
          visible={this.state.addSearchTestModal}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          footer={null}>
          <AddSearchTest addSearchTestShow={this.state.addSearchTestModal}
            searchTestCallback={this.searchTestChange}></AddSearchTest>
        </Modal>
        {/*修改测试模块*/}
        <Modal title="修改测试"
          visible={this.state.changeSearchTestModal}
          onOk={this.changeSearchTestOk}
          onCancel={this.handleCancel}
          confirmLoading={this.state.changeConfirmLoading}>
          <Form horizontal>
            <FormItem {...formItemLayout} label="测&nbsp;试&nbsp;名&nbsp;字" hasFeedback>
              <Input {...changeSvName} placeholder="请输入测试名字" />
            </FormItem>
            <FormItem {...formItemLayout} label="业&nbsp;务&nbsp;描&nbsp;述">
              <Input {...changeSvDescr} placeholder="请输入业务描述" />
            </FormItem>
            <FormItem {...formItemLayout} label="所&nbsp;属&nbsp;公&nbsp;司">
              <Input {...changeCompanyName} placeholder="请输入所属公司" />
            </FormItem>
            <FormItem {...formItemLayout} label="负责人名字">
              <Input {...changeManagerName} placeholder="请输入负责人名字" />
            </FormItem>
            <FormItem {...formItemLayout} label="负责人电话">
              <Input {...changeManagerPhone} placeholder="请输入负责人联系方式" />
            </FormItem>
            <FormItem {...formItemLayout} label="测试服务器版本">
              <Input {...changeStTestSys} placeholder="请输入测试服务器版本" />
            </FormItem>
            <FormItem {...formItemLayout} label="服&nbsp;务&nbsp;版&nbsp;本">
              <Input {...changeStVersion} placeholder="请输入系统版本" />
            </FormItem>
            <FormItem {...formItemLayout} label="测试服务器Ip">
              <Input {...changeStIp} placeholder="请输入测试服务器Ip" />
            </FormItem>
            <FormItem {...formItemLayout} label="数据库详细参数">
              <Input {...changeStDb} placeholder="请输入数据库详细参数" />
            </FormItem>
            <FormItem {...formItemLayout} label="CPU性能要求">
              <Input {...changeStCpu} placeholder="请输入CPU性能要求" />
            </FormItem>
            <FormItem {...formItemLayout} label="内&nbsp;存&nbsp;需&nbsp;求">
              <Input {...changeStMemery} placeholder="请输入内存需求" />
            </FormItem>
            <FormItem {...formItemLayout} label="硬&nbsp;盘&nbsp;需&nbsp;求">
              <Input {...changeStDisk} placeholder="请输入硬盘需求" />
            </FormItem>
            <FormItem {...formItemLayout} label="测&nbsp;试&nbsp;地&nbsp;址">
              <Input {...changeStUrl} placeholder="请输入测试地址" />
            </FormItem>
          </Form>
          {/*文件上传*/}
          <div className="info">
            <div className="info-title">
              <h4>文件上传信息</h4>
            </div>
            <div className="info-content">
              <div className="clearfix">
                <Upload {...testFileUpload}>
                  <Button type="ghost">
                    <Icon type="upload" /> 点击上传
                  </Button>
                </Upload>
              </div>
            </div>
          </div>
        </Modal>
        {/*删除模块*/}
        <Modal title="删除测试提示" visible={this.state.delSearchTestModal}
          onOk={this.deleteSearchTestOk} onCancel={this.handleCancel}
          wrapClassName="vertical-center-modal"
        >
          <p>你真的要把这个测试信息删除吗？</p>
        </Modal>
        {/*批量删除操作*/}
        <Modal title="批量删除操作提示："

          visible={this.state.deleteTestAllVisible}
          onOk={this.deleteTestAllOk}
          onCancel={this.deleteTestAllCancel}
          confirmLoading={this.state.deleteTestAllLoading}>
          <h4>确定要删除已选择项吗？</h4>
        </Modal>
      </div>
    )
  }
});
SearchTest = createForm()(SearchTest);
export default SearchTest
