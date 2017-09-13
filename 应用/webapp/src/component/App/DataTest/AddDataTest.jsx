import React from 'react';
import {browserHistory} from 'react-router';
import $ from 'jquery';
import ajax from '../../../common/ajax';
import { Button, Input, Icon, Form, Modal, Radio, Upload, message } from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

let AddDataTest = React.createClass({
  getInitialState(){
    return {
      loading: false,
      fileList: []
    }
  },
  //时间格式化
  timeFormat: function (da) {
    da = new Date(da);
    let year = da.getFullYear();
    let month = da.getMonth() + 1;
    let date = da.getDate();
    return ([year, month, date].join('-'));
  },
  //上传文件改变时的状态
  upload(data){
    data.fileList = data.fileList.map((file) => {
      if (file.response) {
        file.url = file.response.data.url;
      }
      return file;
    });
    this.setState({
      fileList: data.fileList
    });
  },
  //确定添加
  handleSubmit(ev){
    ev.preventDefault();
    let _this = this;
    let fileUploads = [];
    this.props.form.validateFieldsAndScroll((errors, values)=> {
      if (!errors) {
        for (let i = 0; i < this.state.fileList.length; i++) {
          if (this.state.fileList[i].status != 'done') {
            Modal.error({
              title: '请等待上传完成'
            });
            return
          }
        }
        this.setState({
          loading: true
        });
        for (var i = 0; i < this.state.fileList.length; i++) {
          fileUploads.push({
            fileId: this.state.fileList[i].response.data.fileId,
            fileName: this.state.fileList[i].response.data.fileName,
            fileUrl: this.state.fileList[i].response.data.url,
            uploadTime: this.timeFormat(this.state.fileList[i].response.data.uploadTime)
          })
        }
        let addTestData = {
          fnName: values.addFnName,
          descr: values.textarea,
          companyName: values.addCompanyName,
          managerName: values.addManagerName,
          managerPhone: values.addManagerPhone,
          fnTestSys: values.addFnTestSys,
          fnVersion: values.addFnVersion,
          fnIp: values.addFnIp,
          fnDb: values.addFnDbValue,
          fnCpu: values.addFnCpu,
          fnMemery: values.addFnMemery,
          fnDisk: values.addFnDisk,
          fnUrl: values.addFnUrl,
          fileUploads: fileUploads
        };
        //console.log(addTestData);
        ajax({
          url: 'addTest.do',
          type: 'post',
          data: addTestData,
          success(res){
            _this.setState({
              loading: false
            });
            if (res.ret == 'SUCCESS') {
              Modal.success({
                title: res.data
              });
              _this.props.onOk();
              _this.setState({
                fileList: []
              })
            } else {
              Modal.error({
                title: '添加' + res.data
              })
            }
          },
          error(){
            _this.setState({
              loading: false
            });
            Modal.error({
              title: '服务器连接失败'
            })
          }
        })
      } else {
        Modal.error({
          title: '添加操作错误'
        })
      }
    })

  },
  //取消添加
  onCancel(){
    this.props.onCancel();
    this.setState({
      loading: false,
      fileList: []
    });
  },
  render(){
    const {getFieldProps} = this.props.form;
    const addFnName = getFieldProps('addFnName', {
      rules: [
        {required: true, pattern:/^(?=[0-9a-zA-Z\u4e00-\u9fa5]+$)/,message: '请输入测试名称（不能使用特殊字符）'}
      ],
      validateTrigger: ['onChange']
    });
    const addDescr = getFieldProps('textarea', {
      rules: [
        {required: true, message: '请输入测试描述'}
      ],
      validateTrigger: ['onChange']
    });
    const addCompanyName = getFieldProps('addCompanyName', {
      rules: [
        {required: true,  pattern: /^(?=[0-9a-zA-Z\u4e00-\u9fa5]+$)/, message: '请输入正确的所属单位名（不能使用特殊字符）' }
      ],
      validateTrigger: ['onChange']
    });
    const addManagerName = getFieldProps('addManagerName', {
      rules: [
        {required: true, pattern: /^([a-zA-Z\u4e00-\u9fa5]){2,50}$/, message: '请输入正确的姓名（最少为两个字符）' }
      ],
      validateTrigger: ['onChange']
    });
    const addManagerPhone = getFieldProps('addManagerPhone', {
      rules: [
        {required: true,pattern: /^(13[0-9]|15[0-9]|17[0-3]|17[5-8]|18[0-9])[0-9]{8}$/, message: '请输入正确的联系方式'}
      ],
      validateTrigger: ['onChange']
    });
    const addFnTestSys = getFieldProps('addFnTestSys', {
      rules: [
        {required: true, message: '请输入测试操作系统'}
      ],
      validateTrigger: ['onChange']
    });
    const addFnVersion = getFieldProps('addFnVersion', {
      rules: [
        {required: true, message: '请输入应用版本'}
      ],
      validateTrigger: ['onChange']
    });
    const addFnIp = getFieldProps('addFnIp', {
      rules: [
        {required: true,  pattern: /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-5][0-5])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/,
         message: '请输入正确的测试Ip地址'}
      ],
      validateTrigger: ['onChange']
    });
    const addFnDb = getFieldProps('addFnDbValue', {
      rules: [
        {required: true, message: '数据库参数不能为空'}
      ],
      validateTrigger: ['onChange']
    });
    const addFnCpu = getFieldProps('addFnCpu', {
      rules: [
        {required: true, message: 'cpu性能要求不能为空'}
      ],
      validateTrigger: ['onChange']
    });
    const addFnMemery = getFieldProps('addFnMemery', {
      rules: [
        {required: true, message: '内存要求不能为空'}
      ],
      validateTrigger: ['onChange']
    });
    const addFnDisk = getFieldProps('addFnDisk', {
      rules: [
        {required: true, message: '硬盘要求不能为空'}
      ],
      validateTrigger: ['onChange']
    });
    const addFnUrl = getFieldProps('addFnUrl', {
      rules: [
        {required: true, message: '测试地址不能为空'}
      ],
      validateTrigger: ['onChange']
    });
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 12},
    };

    //上传文件信息
    const props = {
      name: 'file',
      action: 'http://192.168.0.104:8080/frm/fileUpload.do',
      listType: 'text',
      multiple: true,
      data(file){
        return {filePath: '/arm/file'}
      }
    };
    return (
      <Form horizontal>
        <FormItem {...formItemLayout} label="测试名称" hasFeedback>
          <Input {...addFnName} placeholder="请输入测试名称"/>
        </FormItem>
        <FormItem {...formItemLayout} label="描述" hasFeedback>
          <Input {...addDescr} type="textarea" rows={4} style={{resize:'none'}} placeholder="请输入测试描述" id="textarea"
                               name="textarea"/>
        </FormItem>
        <FormItem {...formItemLayout} label="所属单位" hasFeedback>
          <Input {...addCompanyName} placeholder="请输入所属单位"/>
        </FormItem>
        <FormItem {...formItemLayout} label="负责人姓名" hasFeedback>
          <Input {...addManagerName} placeholder="请输入测试负责人姓名"/>
        </FormItem>
        <FormItem {...formItemLayout} label="联系方式" hasFeedback>
          <Input {...addManagerPhone} placeholder="请输入联系方式"/>
        </FormItem>
        <FormItem {...formItemLayout} label="操作系统" hasFeedback>
          <Input {...addFnTestSys} placeholder="请输入测试操作系统"/>
        </FormItem>
        <FormItem {...formItemLayout} label="应用版本" hasFeedback>
          <Input {...addFnVersion} placeholder="请输入应用版本"/>
        </FormItem>
        <FormItem {...formItemLayout} label="测试Ip" hasFeedback>
          <Input {...addFnIp} placeholder="请输入测试服务器Ip"/>
        </FormItem>
        <FormItem {...formItemLayout} label="数据库参数" hasFeedback>
          <Input {...addFnDb} type="textarea" rows={4} style={{resize:'none'}} placeholder="请输入测试描述" id="addFnDbValue"
                              name="addFnDbValue"/>
        </FormItem>
        <FormItem {...formItemLayout} label="CPU性能" hasFeedback>
          <Input {...addFnCpu} placeholder="请输入测试CPU性能"/>
        </FormItem>
        <FormItem {...formItemLayout} label="内存要求" hasFeedback>
          <Input {...addFnMemery} placeholder="请输入测试内存要求"/>
        </FormItem>
        <FormItem {...formItemLayout} label="硬盘要求" hasFeedback>
          <Input {...addFnDisk} placeholder="请输入测试硬盘要求"/>
        </FormItem>
        <FormItem {...formItemLayout} label="测试地址" hasFeedback>
          <Input {...addFnUrl} placeholder="请输入测试地址"/>
        </FormItem>
        <FormItem {...formItemLayout} label="上传">
          <Upload {...props} onChange={this.upload} fileList={this.state.fileList}>
            <Button type="ghost">
              <Icon type="upload"/>点击上传
            </Button>
          </Upload>
        </FormItem>
        <div style={{textAlign:'center'}}>
          <Button type="ghost" onClick={this.onCancel}>取消</Button>
          <Button type="primary" onClick={this.handleSubmit} loading={this.state.loading}
                  style={{marginLeft:20}}>确定</Button>
        </div>
      </Form>
    )
  }
});

AddDataTest = createForm()(AddDataTest);
export default AddDataTest;
