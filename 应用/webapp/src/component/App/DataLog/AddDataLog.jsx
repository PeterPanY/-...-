import React from 'react';
import {browserHistory} from 'react-router';
import $ from 'jquery';
import ajax from '../../../common/ajax';
import { Button, Input, Icon, Form, Modal, Radio, Upload, message,Select } from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

let AddDataLog = React.createClass({
  getInitialState(){
    return {
      loading: false
    }
  },
  //确定添加
  onDataLogOk(ev){
    ev.preventDefault();
    let _this = this;
    this.props.form.validateFieldsAndScroll((errors, values)=> {
      if (!errors) {
        _this.setState({
          confirmLoading: true
        });
        let addSearchLogData = {
          blogName: values.addBlogName,
          cmName: values.addCmName,
          content: values.textarea,
          blogType: {blogTypeId: values.select}
        };
         //console.log(addSearchLogData)
        ajax({
          url: 'addLog.do',
          type: 'post',
          data: addSearchLogData,
          success: function (res) {
             //console.log(res)
            _this.setState({
              confirmLoading: false
            });
            if (res.ret == 'SUCCESS') {
              Modal.success({
                title: res.data
              });
              _this.props.onOk();
            } else {
              Modal.error({
                title: '服务器错误，日志添加失败'
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
  //退出添加对话框改变的状态
  onCancel(){
    this.props.onCancel();
    this.setState({
      loading: false
    });
  },

  render(){
    const {getFieldProps} = this.props.form;
    const addBlogName = getFieldProps('addBlogName', {
      rules: [
        {required: true, pattern:/^(?=[0-9a-zA-Z\u4e00-\u9fa5]+$)/, message: '请输入正确的日志名称'}
      ]
    });
    const addCmName = getFieldProps('addCmName', {
      rules: [
        {required: true,pattern:/^(?=[0-9a-zA-Z\u4e00-\u9fa5]+$)/, message: '请输入正确的应用名称'}
      ]
    });
    const addContent = getFieldProps('textarea', {
      rules: [
        {required: true, min: 0, message: '日志描述不能为空'},
      ]
    });
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 12}
    };
    return (
      <Form horizontal>
        <FormItem {...formItemLayout} label="日志名称" hasFeedback>
          <Input {...addBlogName} placeholder="请输入日志名称"/>
        </FormItem>
        <FormItem {...formItemLayout} label="应用名称" hasFeedback>
          <Input {...addCmName} placeholder="请输入应用名称"/>
        </FormItem>
        <FormItem {...formItemLayout} label="日志类型" required>
          <Select {...getFieldProps('select')} placeholder="请选择日志类型" id="LogSelect">
            {this.props.logTypeData.map(function (item, index) {
              return <Option value={item.blogTypeId} key={index}>{item.typeName}</Option>
            })}
          </Select>
        </FormItem>
        <FormItem {...formItemLayout} label="日志内容" hasFeedback>
          <Input {...addContent} type="textarea" style={{resize:'none'}} rows={6} placeholder="日志内容描述" id="textarea" name="textarea"/>
        </FormItem>
        <div style={{textAlign:'center'}}>
          <Button type="ghost" onClick={this.onCancel}>取消</Button>
          <Button type="primary" onClick={this.onDataLogOk} loading={this.state.confirmLoading}
                  style={{marginLeft:20}}>确定</Button>
        </div>
      </Form>
    )
  }
});
AddDataLog = createForm()(AddDataLog);
export default AddDataLog;
