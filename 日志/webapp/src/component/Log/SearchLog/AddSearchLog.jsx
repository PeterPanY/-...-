import React from 'react';
import {browserHistory} from 'react-router';
import $ from 'jquery';
import ajax from '../../../common/ajax';
import { Row,Col,Button,Input,Icon,Form,Modal,message,Select} from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;

let AddSearchLog = React.createClass({
  getInitialState() {
    return {
      addSearchLogModal: this.props.addSearchLogState
    };
  },
  //把对话框的状态发送给父级
  onAddLogChange(){
    let newAddIsShow = false;
    this.setState({
      addSearchLogModal: newAddIsShow
    });
    this.props.logCallback(newAddIsShow);
  },
  addSearchLogBtn(){
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
          userName: values.addUserName,
          blogType: {blogTypeId: values.select}
        };
        // console.log(addSearchLogData)
        ajax({
          url: 'addLog.do',
          type: 'post',
          data: addSearchLogData,
          success: function (res) {
            // console.log(res)
            _this.setState({
              confirmLoading: false
            });
            _this.onAddLogChange();
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
    const addBlogName = getFieldProps('addBlogName', {
      rules: [
        {required: true, min: 0, message: '方法名字不能为空'}
      ]
    });
    const addCmName = getFieldProps('addCmName', {
      rules: [
        {required: true, min: 0, message: '方法名字不能为空'}
      ]
    });
    const addContent = getFieldProps('textarea', {
      rules: [
        {required: true, min: 0, message: '方法描述不能为空'},
      ]
    });
    const formItemLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 12},
    };

    return (
      <Form>
        <FormItem {...formItemLayout} label="日志名称" hasFeedback>
          <Input {...addBlogName} placeholder="请输入日志名称"/>
        </FormItem>
        <FormItem {...formItemLayout} label="应用名称" hasFeedback>
          <Input {...addCmName} placeholder="请输入应用名称"/>
        </FormItem>
        <FormItem {...formItemLayout} label="日志类型" required>
          <Select {...getFieldProps('select')} placeholder="请选择日志类型" id="searchLogSelect">
            {this.props.logTypeData.map(function (item, index) {
              return <Option value={item.blogTypeId} key={index}>{item.typeName}</Option>
            })}
          </Select>
        </FormItem>
        <FormItem {...formItemLayout} label="日志内容" hasFeedback>
          <Input {...addContent} type="textarea" style={{resize:'none'}} rows={6} placeholder="日志内容描述" id="textarea" name="textarea"/>
        </FormItem>
        <div style={{marginLeft:175}}>
          <Button type="primary" onClick={this.onAddLogChange} style={{marginRight:20}}>取消</Button>
          <Button type="primary" onClick={this.addSearchLogBtn} style={{marginRight:20}}
                  loading={this.state.confirmLoading}>提交</Button>
        </div>
      </Form>
    )
  }
});

AddSearchLog = createForm()(AddSearchLog);
export default AddSearchLog
