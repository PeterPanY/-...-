import React from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import ajax from '../../../common/ajax';
import { Row, Col, Button, Input, Icon, Form, Modal, Radio, Upload, message } from 'antd';
import { fileLoads } from '../../../common/fileUploads';


const RadioGroup = Radio.Group;
const createForm = Form.create;
const FormItem = Form.Item;

let AddSearchTest = React.createClass({
  getInitialState() {
    return {
      addSearchTestShow: this.props.addSearchTestShow,
      testUploadsList: []
    };
  },
  onTextChange() {
    let newAddSearchTestShow = false;
    this.setState({
      addSearchTestShow: newAddSearchTestShow
    });
    //console.log(this.props.callbackParent);
    this.props.searchTestCallback(newAddSearchTestShow);
  },
  //添加按钮
  addSearchTestBtn() {
    let _this = this;
    let fileUploads = [];
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        for (let i = 0; i < this.state.testUploadsList.length; i++) {
          if (this.state.testUploadsList[i].status != 'done') {
            Modal.error({
              title: '请等待上传完成'
            });
            return
          }
        }
        this.setState({
          confirmLoading: true
        });
        for (let i = 0; i < this.state.testUploadsList.length; i++) {
            fileUploads.push({
              fileId: this.state.testUploadsList[i].response.data.fileId,
              fileName: this.state.testUploadsList[i].response.data.fileName,
              fileUrl: this.state.testUploadsList[i].response.data.url,
              uploadTime: this.timeFormat(this.state.testUploadsList[i].response.data.uploadTime)
            })
        }
        let addSearchTestData = {
          svName: values.addSvName,
          svDescr: values.addSvDescr,
          companyName: values.addCompanyName,
          managerName: values.addManagerName,
          managerPhone: values.addManagerPhone,
          stTestSys: values.addStTestSys,
          stVersion: values.addStVersion,
          stIp: values.addStIp,
          stDb: values.addStDb,
          stCpu: values.addStCpu,
          stMemery: values.addStMemery,
          stDisk: values.addStDisk,
          stUrl: values.addStUrl,
          fileUploads: fileUploads
        };
        console.log(addSearchTestData);
        ajax({
          url: 'addTest.do',
          type: 'post',
          data: addSearchTestData,
          success: function (res) {
            _this.setState({
              confirmLoading: false
            });
            if (res.ret === 'SUCCESS') {
              _this.onTextChange();
              Modal.success({
                title: res.data
              });
              //e.preventDefault();
              _this.setState({
                testUploadsList: []
              });
              _this.props.form.resetFields();
            } else {
              Modal.error({
                title: '测试信息添加失败'
              });
            }
          },
          error: function (res) {
            Modal.error({
              title: '服务器异常'
            });
          }
        })
      }
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
  //上传文件操作
  testHandleChange(data) {
    data.fileList = data.fileList.map((file) => {
      if (file.response) {
        file.url = file.response.data.url;
      }
      return file;
    });
    this.setState({
      testUploadsList: data.fileList
    });
    // //console.log(info);
    // let testUploadArr = [];
    // const status = info.file.status;
    // let fileList = info.fileList;
    // fileList = fileList.map((file) => {
    //   if (file.response) {
    //     // 组件会将 file.url 作为链接进行展示
    //     file.url = file.response.data.url;
    //   }
    //   return file;
    // });
    // this.setState({
    //   testUploadsList: fileList
    // });
    // //处理response返回值
    // if (status === 'done') {
    //   for (var i = 0; i < info.fileList.length; i++) {
    //     //console.log(info.fileList[i]);
    //     let fileUploadObj = {};
    //     fileUploadObj.fileId = info.fileList[i].response.data.fileId;
    //     fileUploadObj.fileName = info.fileList[i].response.data.fileName;
    //     fileUploadObj.fileUrl = info.fileList[i].response.data.url;
    //     let fileUploadTime = this.timeFormat(info.fileList[i].response.data.uploadTime);
    //     fileUploadObj.uploadTime = fileUploadTime;
    //     testUploadArr.push(fileUploadObj)
    //   }
    //   //console.log(testUploadArr);
    //   this.setState({
    //     testUploadArr: testUploadArr
    //   })
    // }
  },
  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    const addSvName = getFieldProps('addSvName', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const addSvDescr = getFieldProps('addSvDescr', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const addCompanyName = getFieldProps('addCompanyName', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const addManagerName = getFieldProps('addManagerName', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const addManagerPhone = getFieldProps('addManagerPhone', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const addStTestSys = getFieldProps('addStTestSys', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const addStVersion = getFieldProps('addStVersion', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const addStIp = getFieldProps('addStIp', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const addStDb = getFieldProps('addStDb', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const addStCpu = getFieldProps('addStCpu', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const addStMemery = getFieldProps('addStMemery', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const addStDisk = getFieldProps('addStDisk', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const addStUrl = getFieldProps('addStUrl', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    //测试文件信息
    const fileUpload = {
      action: fileLoads + 'fileUpload.do',
      fileList: this.state.testUploadsList,
      onChange: this.testHandleChange,
      multiple: true,
      data(file) {
        return { filePath: '/arm/file' }
      }
    };
    return (
      <div>
        <Form horizontal>
          <FormItem {...formItemLayout} label="测&nbsp;试&nbsp;名&nbsp;字" hasFeedback>
            <Input {...addSvName} placeholder="请输入测试名字" />
          </FormItem>
          <FormItem {...formItemLayout} label="业&nbsp;务&nbsp;描&nbsp;述">
            <Input {...addSvDescr} placeholder="请输入业务描述" />
          </FormItem>
          <FormItem {...formItemLayout} label="所&nbsp;属&nbsp;公&nbsp;司">
            <Input {...addCompanyName} placeholder="请输入所属公司" />
          </FormItem>
          <FormItem {...formItemLayout} label="负责人名字">
            <Input {...addManagerName} placeholder="请输入负责人名字" />
          </FormItem>
          <FormItem {...formItemLayout} label="负责人电话">
            <Input {...addManagerPhone} placeholder="请输入负责人联系方式" />
          </FormItem>
          <FormItem {...formItemLayout} label="测试服务器版本">
            <Input {...addStTestSys} placeholder="请输入测试服务器版本" />
          </FormItem>
          <FormItem {...formItemLayout} label="服&nbsp;务&nbsp;版&nbsp;本">
            <Input {...addStVersion} placeholder="请输入系统版本" />
          </FormItem>
          <FormItem {...formItemLayout} label="测试服务器Ip">
            <Input {...addStIp} placeholder="请输入测试服务器Ip" />
          </FormItem>
          <FormItem {...formItemLayout} label="数据库详细参数">
            <Input {...addStDb} placeholder="请输入数据库详细参数" />
          </FormItem>
          <FormItem {...formItemLayout} label="CPU性能要求">
            <Input {...addStCpu} placeholder="请输入CPU性能要求" />
          </FormItem>
          <FormItem {...formItemLayout} label="内&nbsp;存&nbsp;需&nbsp;求">
            <Input {...addStMemery} placeholder="请输入内存需求" />
          </FormItem>
          <FormItem {...formItemLayout} label="硬&nbsp;盘&nbsp;需&nbsp;求">
            <Input {...addStDisk} placeholder="请输入硬盘需求" />
          </FormItem>
          <FormItem {...formItemLayout} label="测&nbsp;试&nbsp;地&nbsp;址">
            <Input {...addStUrl} placeholder="请输入测试地址" />
          </FormItem>
        </Form>
        {/*文件上传*/}
        <div className="info">
          <div className="info-title">
            <h4>测试文件上传信息</h4>
          </div>
          <div className="info-content">
            <div className="clearfix">
              <Upload {...fileUpload}>
                <Button type="ghost">
                  <Icon type="upload" /> 点击上传
                </Button>
              </Upload>
            </div>
          </div>
        </div>
        {/*对话框按钮组*/}
        <div style={{ marginLeft: 175 }}>
          <Button type="primary" onClick={this.onTextChange} style={{ marginRight: 20 }}>取消</Button>
          <Button type="primary" onClick={this.addSearchTestBtn} style={{ marginRight: 20 }}
            loading={this.state.confirmLoading}>提交</Button>
        </div>
      </div>
    )
  }
});
AddSearchTest = createForm()(AddSearchTest);
export default AddSearchTest;
