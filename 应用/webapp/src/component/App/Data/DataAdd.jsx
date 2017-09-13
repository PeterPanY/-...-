import React from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import ajax from '../../../common/ajax';
import { Button, Input, Icon, Form, Modal, Radio, Upload, message } from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

let DataAdd = React.createClass({
  getInitialState() {
    return {
      value: 1,
      loading: false,
      fileList: []
    }
  },
  componentDidMount() {
  },
  onChangeRadio(e) {
    //console.log(e.target.value);
    this.setState({
      value: e.target.value,
    });
  },
  //判断应用名重名问题
  userExists(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      ajax({
        url: 'dataExist.do',
        type: 'post',
        data: { name: value },
        success: function (res) {
          //console.log(res);
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
  //确定添加数据
  handleSubmit(ev) {
    ev.preventDefault();
    let _this = this;
    let imgUploads = [];
    let fileUploads = [];
    this.props.form.validateFieldsAndScroll((errors, values) => {
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
        for (let i = 0; i < this.state.fileList.length; i++) {
          if (this.state.fileList[i].type == 'image/jpeg' || this.state.fileList[i].type == 'image/png' && this.state.fileList[i].response.ret == 'SUCCESS') {
            imgUploads.push({
              imgId: this.state.fileList[i].response.data.fileId,
              imgName: this.state.fileList[i].response.data.fileName,
              imgUrl: this.state.fileList[i].response.data.url,
              uploadTime: this.timeFormat(this.state.fileList[i].response.data.uploadTime)
            })
          } else if (this.state.fileList[i].type != 'image/jpeg' && this.state.fileList[i].type != 'image/png' && this.state.fileList[i].response.ret == 'SUCCESS') {
            fileUploads.push({
              fileId: this.state.fileList[i].response.data.fileId,
              fileName: this.state.fileList[i].response.data.fileName,
              fileUrl: this.state.fileList[i].response.data.url,
              uploadTime: this.timeFormat(this.state.fileList[i].response.data.uploadTime)
            })
          }
        }
        //console.log(imgUploads);
        //console.log(fileUploads);
        let data = {
          name: values.name,
          descr: values.descr,
          fnVersion: values.fnVersion,
          fnUrl: values.fnUrl,
          managerName: values.managerName,
          managerPhone: values.managerPhone,
          fnSys: values.fnSys,
          fnIp: values.fnIp,
          fnCpu: values.fnCpu,
          fnMemery: values.fnMemery,
          fnDisk: values.fnDisk,
          fnOnline: _this.state.value,
          imgUploads: imgUploads,
          fileUploads: fileUploads,
          companyName: values.companyName
        };
        console.log(data)
        ajax({
          url: 'addData.do',
          type: 'post',
          data: data,
          success(res) {
            _this.setState({
              loading: false
            });
            if (res.ret == 'SUCCESS') {
              _this.setState({
                value: 1
              });
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
          error() {
            _this.setState({
              loading: false
            });
            Modal.error({
              title: '服务器连接失败'
            })
          }
        })
      }
    })
  },
  //退出添加对话框改变的状态
  onCancel() {
    this.props.onCancel();
    this.setState({
      loading: false,
      fileList: []
    });
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
  upload(data) {
    //console.log(data);
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
  render() {
    const { getFieldProps } = this.props.form;
    const nameProps = getFieldProps('name', {
      rules: [
        { required: true, pattern: /^(?=[0-9a-zA-Z\u4e00-\u9fa5]+$)/, message: '请输入正确的应用名称（不能使用特殊字符）' },
        { validator: this.userExists }
      ],
      validateTrigger: ['onChange'],
    });
    const companyName = getFieldProps('companyName', {
      rules: [
        { required: true, pattern: /^(?=[0-9a-zA-Z\u4e00-\u9fa5]+$)/, message: '请输入正确的所属单位名（不能使用特殊字符）' },
        { validator: this.userExists }
      ],
      validateTrigger: ['onChange'],
    });
    const descrProps = getFieldProps('descr', {});
    const fnVersionProps = getFieldProps('fnVersion', {
      rules: [
        { required: true, pattern: /^\d+(\.\d+)*$/, message: '请输入正确的版本号' },
      ],
      validateTrigger: ['onChange'],
    });
    const fnUrlProps = getFieldProps('fnUrl', {
      rules: [
        { required: true, pattern: /^[\x01-\x7f]*$/, message: '非空且不能含有中文' },
      ],
      validateTrigger: ['onChange'],
    });
    const managerNameProps = getFieldProps('managerName', {
      rules: [
        { required: true, pattern: /^([a-zA-Z\u4e00-\u9fa5]){2,50}$/, message: '请输入正确的姓名（最少为两个字符）'},
      ],
      validateTrigger: ['onChange'],
    });
    const managerPhoneProps = getFieldProps('managerPhone', {
      rules: [
        { required: true, pattern: /^(13[0-9]|15[0-9]|17[0-3]|17[5-8]|18[0-9])[0-9]{8}$/, message: '请输入正确的手机号码' },
      ],
      validateTrigger: ['onChange'],
    });
    const fnSysProps = getFieldProps('fnSys', {});
    const fnIpProps = getFieldProps('fnIp', {
      rules: [
        {
          required: true,
          pattern: /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-5][0-5])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/,
          message: '请输入正确的IP地址'
        },
      ],
      validateTrigger: ['onChange'],
    });
    const fnCpuProps = getFieldProps('fnCpu', {});
    const fnMemeryProps = getFieldProps('fnMemery', {});
    const fnDiskProps = getFieldProps('fnDisk', {});
    //const fnOnlineProps = getFieldProps('fnOnline', {
    //  rules: [
    //    {required: true, message: '请选择上下线'},
    //  ],
    //});
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 12 },
    };
    //上传文件信息
    const props = {
      name: 'file',
      action: 'http://192.168.0.104:8080/frm/fileUpload.do',
      listType: 'text',
      accept: '.jpg,.jpeg,.png,.txt,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
      multiple: true,
      data(file) {
        if (file.type == 'image/jpeg' || file.type == 'image/png') {
          return { filePath: '/arm/img' }
        } else {
          return { filePath: '/arm/file' }
        }
      }
    };
    return (
      <Form horizontal>
        <FormItem {...formItemLayout} label="应用名称" hasFeedback >
          <Input  {...nameProps} placeholder="请输入应用名称" />
        </FormItem>
        <FormItem {...formItemLayout} label="所属单位" hasFeedback >
          <Input  {...companyName} placeholder="请输入应用名称" />
        </FormItem>
        <FormItem {...formItemLayout} label="应用描述">
          <Input {...descrProps} placeholder="请输入应用描述" />
        </FormItem>
        
        <FormItem {...formItemLayout} label="应用版本" hasFeedback>
          <Input {...fnVersionProps} placeholder="请输入应用版本" />
        </FormItem>
        <FormItem {...formItemLayout} label="应用地址" hasFeedback>
          <Input {...fnUrlProps} placeholder="请输入应用地址" />
        </FormItem>
        <FormItem {...formItemLayout} label="负责人姓名" hasFeedback>
          <Input {...managerNameProps} placeholder="请输入负责人姓名" />
        </FormItem>
        <FormItem {...formItemLayout} label="负责人手机" hasFeedback>
          <Input {...managerPhoneProps} placeholder="请输入负责人手机" />
        </FormItem>
        <FormItem {...formItemLayout} label="操作系统版本">
          <Input {...fnSysProps} placeholder="请输入操作系统版本" />
        </FormItem>
        <FormItem {...formItemLayout} label="服务器IP" hasFeedback>
          <Input {...fnIpProps} placeholder="请输入服务器IP" />
        </FormItem>
        <FormItem {...formItemLayout} label="CPU需求">
          <Input {...fnCpuProps} placeholder="请输入CPU需求" />
        </FormItem>
        <FormItem {...formItemLayout} label="内存需求">
          <Input {...fnMemeryProps} placeholder="请输入内存需求" />
        </FormItem>
        <FormItem {...formItemLayout} label="硬盘需求">
          <Input {...fnDiskProps} placeholder="请输入硬盘需求" />
        </FormItem>
        <FormItem {...formItemLayout} label="上下线">
          <RadioGroup onChange={this.onChangeRadio} value={this.state.value}>
            <Radio key='1' value={1}>上线</Radio>
            <Radio key='0' value={0}>下线</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem {...formItemLayout} label="上传">
          <Upload {...props} onChange={this.upload} fileList={this.state.fileList}>
            <Button type="ghost">
              <Icon type="upload" />点击上传
            </Button>
          </Upload>
        </FormItem>
        <div style={{ textAlign: 'center' }}>
          <Button type="ghost" onClick={this.onCancel}>取消</Button>
          <Button type="primary" onClick={this.handleSubmit} loading={this.state.loading}
            style={{ marginLeft: 20 }}>确定</Button>
        </div>
      </Form>
    )
  }
});
DataAdd = createForm()(DataAdd);
export default DataAdd;
