import React from 'react';
import {browserHistory} from 'react-router';
import $ from 'jquery';
import ajax from '../../../common/ajax';
import { Row,Col,Button,Input,Icon,Form,Modal,message,Select} from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

let AddMethod = React.createClass({
  getInitialState() {
    return {
      addto: this.props.addModal
    };
  },
  //把对话框的状态发送给父级
  onAddMethodChange(){
    let newAddIsShow = false;
    this.setState({
      addModal: newAddIsShow
    });
    this.props.callbackParent(newAddIsShow);
  },
  //提交按钮添加数据
  addMethodbtn(){
    let _this = this;
    this.props.form.validateFieldsAndScroll((errors, values)=> {
      if (!errors) {
        _this.setState({
          confirmLoading: true
        });
        let addMethodData = {
          methodName: values.addMethodName,
          methodDescr: values.textarea,
          methodUrl: values.addMethodUrl,
          example: values.addMethodExample,
          result: values.addMethodResult,
          service: {serviceId: values.select},
          params: [
            {
              paramName: values.addMethodParamName,
              paramDescr: values.textareaDescr
            }
          ]
        };
        ajax({
          url: 'addMethod.do',
          type: 'post',
          data: addMethodData,
          success: function (res) {
            _this.setState({
              confirmLoading: false
            });
            _this.onAddMethodChange();
            if (res.ret == 'SUCCESS') {
              Modal.success({
                title: res.data
              });
              //e.preventDefault();
              _this.props.form.resetFields();
            } else {
              Modal.error({
                title: '服务器错误，方法添加失败'
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
  render(){
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    const addMethodName = getFieldProps('addMethodName', {
      rules: [
        {required: true, min: 0, message: '方法名字不能为空'}
      ]
    });
    const addMethodDescr = getFieldProps('textarea', {
      rules: [
        {required: true, min: 0, message: '方法描述不能为空'},
      ]
    });
    const addMethodUrl = getFieldProps('addMethodUrl', {
      rules: [
        {required: true, min: 0, message: '方法地址不能为空'},
      ]
    });
    const addMethodExample = getFieldProps('addMethodExample', {
      rules: [
        {required: true, min: 0, message: '方法示例不能为空'},
      ]
    });
    const addMethodResult = getFieldProps('addMethodResult', {
      rules: [
        {required: true, min: 0, message: '方法返回值不能为空'},
      ]
    });
    const addMethodParamName = getFieldProps('addMethodParamName', {
      rules: [
        {required: true, min: 0, message: '方法参数名字不能为空'},
      ]
    });
    const addMethodParamDescr = getFieldProps('textareaDescr', {
      rules: [
        {required: true, min: 0, message: '方法参数简介不能为空'},
      ]
    });
    const formItemLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 12},
    };
    return (
      <Form horizontal>
        <FormItem {...formItemLayout} label="服务名字" required>
          <Select {...getFieldProps('select')} id="serviceSelect">
            {this.props.servicelist.map(function (item, index) {
              return <Option value={item.serviceId} key={index}>{item.serviceName}</Option>
            })}
          </Select>
        </FormItem>
        <FormItem {...formItemLayout} label="方&nbsp;&nbsp;法&nbsp;&nbsp;名" hasFeedback>
          <Input {...addMethodName} placeholder="请输入方法名"/>
        </FormItem>
        <FormItem {...formItemLayout} label="描&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;述" hasFeedback>
          <Input {...addMethodDescr} type="textarea" placeholder="方法描述" id="textarea" name="textarea"/>
        </FormItem>
        <FormItem {...formItemLayout} label="地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址" hasFeedback>
          <Input {...addMethodUrl} placeholder="方法地址"/>
        </FormItem>
        <FormItem {...formItemLayout} label="参数名字" hasFeedback>
          <Input {...addMethodParamName} placeholder="多个参数用‘，’隔开"/>
        </FormItem>
        <FormItem {...formItemLayout} label="参数简介" hasFeedback>
          <Input {...addMethodParamDescr} type="textarea" placeholder="方法参数简介" id="textareaDescr"   name="textareaDescr"/>
        </FormItem>
        <FormItem {...formItemLayout} label="返&nbsp;&nbsp;回&nbsp;&nbsp;值" hasFeedback>
          <Input {...addMethodResult} placeholder="方法返回值"/>
        </FormItem>
        <FormItem {...formItemLayout} label="示&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;例" hasFeedback>
          <Input {...addMethodExample} placeholder="方法示例"/>
        </FormItem>

        <div style={{marginLeft:175}}>
          <Button type="primary" onClick={this.onAddMethodChange} style={{marginRight:20}}>取消</Button>
          <Button type="primary" onClick={this.addMethodbtn} style={{marginRight:20}}
                  onChange={this.props.addchange} loading={this.state.confirmLoading}>提交</Button>
        </div>
      </Form>
    )
  }
});
AddMethod = createForm()(AddMethod);
export default AddMethod
