import React from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import ajax from '../../../common/ajax';
import { Row, Col, Button, Input, Icon, Form, Modal, Radio, Upload, message, Select } from 'antd';
import './Search.css';
import { fileLoads } from '../../../common/fileUploads';


const RadioGroup = Radio.Group;
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

let NewlyAdded = React.createClass({
  getInitialState() {
    return {
      value: 1,
      addto: this.props.addModal,
      imgUploadsList: [],
      fileUploadsList: [],
      businessAll: this.props.businessAll
    };
  },
  onChange(e) {
    this.setState({
      value: e.target.value,
    });
  },
  onTextChange() {
    let newaddto = false;
    this.setState({
      addto: newaddto,
      imgUploadsList: [],
      fileUploadsList: []
    });
    this.props.callbackParent(newaddto);
  },
  //判断服务器重名问题
  userExists(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      ajax({
        url: 'serviceExist.do',
        type: 'post',
        data: { serviceName: value },
        success: function (res) {
          if (res.ret == 'SUCCESS') {
            //没有重名则可以使用，否定不能使用
            if (res.data) {
              callback();
            } else {
              callback([new Error('抱歉，该服务名字已被占用。')]);
            }
          } else {
            Modal.error({
              title: '连接服务器失败'
            });
          }
        },
        error: function (res) {
          Modal.error({
            title: '服务器异常'
          });
        }
      });
    }
  },
  //添加按钮提交数据
  addService() {
    this.props.form.validateFieldsAndScroll((errors, values) => {
      let _this = this;
      let imgUploadArr = []
      let fileUploadArr = []
      if (!errors) {
        for (let i = 0; i < this.state.imgUploadsList.length; i++) {
          if (this.state.imgUploadsList[i].status != 'done') {
            Modal.error({
              title: '请等待图片上传完成'
            });
            return
          }
        }
        for (let i = 0; i < this.state.fileUploadsList.length; i++) {
          if (this.state.fileUploadsList[i].status != 'done') {
            Modal.error({
              title: '请等待文件上传完成'
            });
            return
          }
        }

        //提交loading
        this.setState({
          confirmLoading: true
        });
        for (var i = 0; i < this.state.imgUploadsList.length; i++) {
          imgUploadArr.push({
            imgId: this.state.imgUploadsList[i].response.data.fileId,
            imgName: this.state.imgUploadsList[i].response.data.fileName,
            imgUrl: this.state.imgUploadsList[i].response.data.url,
            uploadTime: this.timeFormat(this.state.imgUploadsList[i].response.data.uploadTime)
          })
        }
        for (var i = 0; i < this.state.fileUploadsList.length; i++) {
          fileUploadArr.push({
            fileId: this.state.fileUploadsList[i].response.data.fileId,
            fileName: this.state.fileUploadsList[i].response.data.fileName,
            fileUrl: this.state.fileUploadsList[i].response.data.url,
            uploadTime: this.timeFormat(this.state.fileUploadsList[i].response.data.uploadTime)
          })
        }
        let addData = {
          serviceName: values.addSerName,
          svDescr: values.addDesr,
          managerName: values.addManagerName,
          managerPhone: values.addManagerPhone,
          company: values.addcompany,
          systemVersion: values.addSystemVersion,
          business: { businessId: values.select },
          svIp: values.addSvIp,
          svVersion: values.addSvVersion,
          svCpu: values.addSvCpu,
          svMemery: values.addSvMemery,
          svDisk: values.addSvDisk,
          svUrl: values.addSvUrl,
          svDb: values.addSvDb,
          svOnline: _this.state.value,
          imgUploads: imgUploadArr,
          fileUploads: fileUploadArr
        };
        // console.log(addData)
        ajax({
          url: 'addService.do',
          type: 'post',
          data: addData,
          success: function (res) {
            // console.log(res)
            _this.setState({
              value: 1,
              confirmLoading: false,
              imgUploadsList: [],
              fileUploadsList: []
            });
            _this.onTextChange();
            if (res.ret == 'SUCCESS') {
              Modal.success({
                title: res.data
              });
              //e.preventDefault();
              _this.props.form.resetFields();
            } else {
              Modal.error({
                title: '服务添加失败'
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
  //上传图片
  handleChange(data) {
    data.fileList = data.fileList.map((file) => {
      if (file.response) {
        file.url = file.response.data.url;
      }
      return file;
    });
    this.setState({
      imgUploadsList: data.fileList
    });

  },
  //上传文件
  fileHandleChange(data) {
    data.fileList = data.fileList.map((file) => {
      if (file.response) {
        file.url = file.response.data.url;
      }
      return file;
    });
    this.setState({
      fileUploadsList: data.fileList
    });

  },
  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    const addSerName = getFieldProps('addSerName', {
      rules: [
        { required: true,pattern: /^(?=[0-9a-zA-Z\u4e00-\u9fa5]+$)/, message: '请输入正确的服务名称' },
        { validator: this.userExists }
      ]
    });
    const addDesr = getFieldProps('addDesr', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ]
    });
    const addManagerName = getFieldProps('addManagerName', {
      rules: [
        { required: true,pattern: /^([a-zA-Z\u4e00-\u9fa5]){2,50}$/, message: '请输入正确的姓名（最少为两个字符）' },
      ]
    });
    const addManagerPhone = getFieldProps('addManagerPhone', {
      rules: [
        { required: true,pattern: /^(13[0-9]|15[0-9]|17[0-3]|17[5-8]|18[0-9])[0-9]{8}$/, message: '请输入正确的手机号码' },
      ]
    });
    const addcompany = getFieldProps('addcompany', {
      rules: [
        { required: true, pattern: /^(?=[0-9a-zA-Z\u4e00-\u9fa5]+$)/, message: '请输入正确的所属单位名（不能使用特殊字符）' },
      ]
    });
    const addSystemVersion = getFieldProps('addSystemVersion', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ]
    });
    const addSvFunction = getFieldProps('select', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ]
    });
    const addSvIp = getFieldProps('addSvIp', {
      rules: [
        { required: true, pattern: /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-5][0-5])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/,
        message: '请输入正确的IP地址' },
      ]
    });
    const addSvVersion = getFieldProps('addSvVersion', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ]
    });
    const addSvCpu = getFieldProps('addSvCpu', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ]
    });
    const addSvMemery = getFieldProps('addSvMemery', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ]
    });
    const addSvDisk = getFieldProps('addSvDisk', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ]
    });
    const addSvUrl = getFieldProps('addSvUrl', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ]
    });
    const addSvDb = getFieldProps('addSvDb', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ]
    });
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    //上传图片信息
    const props = {
      action: fileLoads + 'fileUpload.do',
      listType: 'picture-card',
      accept: '.jpg,.jpeg,.png,gif,',
      fileList: this.state.imgUploadsList,
      onChange: this.handleChange,
      multiple: true,
      //上传文件之前的钩子，进行判断是不是我所需要的格式
      beforeUpload(file) {
        const isjpg = file.type == 'image/jpg';
        const isjpeg = file.type == 'image/jpeg';
        const ispng = file.type == 'image/png';
        const isgif = file.type == 'image/gif';
        if (!isjpg && !isjpeg && !ispng && !isgif) {
          message.error('只能上传图片哦！');
          return false;
        }
      },
      data(file) {
        return { filePath: '/arm/img' }
      },
    };
    const fileUpload = {
      action: fileLoads + 'fileUpload.do',
      fileList: this.state.fileUploadsList,
      onChange: this.fileHandleChange,
      multiple: true,
      data(file) {
        return { filePath: '/arm/file' }
      }
    };
    return (
      <div>
        {/*form表单*/}
        <Form horizontal>
          <FormItem {...formItemLayout} label="服&nbsp;务&nbsp;名&nbsp;字" hasFeedback>
            <Input {...addSerName} placeholder="请输入服务名字" />
          </FormItem>
          <FormItem {...formItemLayout} label="所&nbsp;属&nbsp;公&nbsp;司" hasFeedback>
            <Input {...addcompany} placeholder="请输入所属公司" />
          </FormItem>
          <FormItem {...formItemLayout} label="服&nbsp;务&nbsp;描&nbsp;述">
            <Input {...addDesr} placeholder="请输入服务描述" />
          </FormItem>
          <FormItem {...formItemLayout} label="负责人名字" hasFeedback>
            <Input {...addManagerName} placeholder="请输入负责人名字" / >
          </FormItem>
          <FormItem {...formItemLayout} label="负责人电话" hasFeedback>
            <Input {...addManagerPhone} placeholder="请输入联系方式" />
          </FormItem>
          
          <FormItem {...formItemLayout} label="系&nbsp;统&nbsp;版&nbsp;本">
            <Input {...addSystemVersion} placeholder="请输入系统版本" />
          </FormItem>
          <FormItem {...formItemLayout} label="业&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务">
            <Select {...addSvFunction } placeholder="请选择业务" id="searcSelect">
              {this.props.businessAll.map(function (item, index) {
                return <Option value={item.businessId} key={index}>{item.businessName}</Option>
              })}
            </Select>
          </FormItem>
          <FormItem {...formItemLayout} label="服&nbsp;务&nbsp;器&nbsp;IP" hasFeedback>
            <Input {...addSvIp} placeholder="请输入服务器Ip" />
          </FormItem>
          <FormItem {...formItemLayout} label="应用版本号">
            <Input {...addSvVersion} placeholder="请输入应用版本号" />
          </FormItem>
          <FormItem {...formItemLayout} label="CPU性能要求">
            <Input {...addSvCpu} placeholder="请输入CPU性能要求" />
          </FormItem>
          <FormItem {...formItemLayout} label="内&nbsp;存&nbsp;要&nbsp;求">
            <Input {...addSvMemery} placeholder="请输入内存要求" />
          </FormItem>
          <FormItem {...formItemLayout} label="硬&nbsp;盘&nbsp;要&nbsp;求">
            <Input {...addSvDisk} placeholder="请输入硬盘要求" />
          </FormItem>
          <FormItem {...formItemLayout} label="应&nbsp;用&nbsp;地&nbsp;址">
            <Input {...addSvUrl} placeholder="请输入应用地址" />
          </FormItem>
          <FormItem {...formItemLayout} label="数据库详细参数">
            <Input {...addSvDb} placeholder="请输入数据库详细参数" />
          </FormItem>
          <FormItem {...formItemLayout} label="上下线">
            <RadioGroup onChange={this.onChange} value={this.state.value}>
              <Radio key="1" value={1}>上线</Radio>
              <Radio key="0" value={0}>下线</Radio>
            </RadioGroup>
            <span><Icon type="info-circle-o" /> 暂不支持其它选择</span>
          </FormItem>
        </Form>

        {/*图片上传*/}
        <div className="info">
          <div className="info-title">
            <h4>图片上传信息</h4>
          </div>
          <div className="info-content">
            <div className="clearfix">
              <Upload {...props} >
                <Icon type="plus" />
                <div className="ant-upload-text">上传照片</div>
              </Upload>
            </div>
          </div>
        </div>
        {/*文件上传*/}
        <div className="info">
          <div className="info-title">
            <h4>文件上传信息</h4>
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
        <div className="clearfix">
          <div style={{ float: 'right' }}>
            <Button type="primary" onClick={this.onTextChange} style={{ marginRight: 20 }}>取消</Button>
            <Button type="primary" onClick={this.addService} style={{ marginRight: 20 }}
              onChange={this.props.addchange} loading={this.state.confirmLoading}>提交</Button>
          </div>
        </div>
      </div>
    )
  }
});
NewlyAdded = createForm()(NewlyAdded);
export default NewlyAdded;
