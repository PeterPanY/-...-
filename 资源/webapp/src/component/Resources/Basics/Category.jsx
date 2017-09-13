import React from 'react';
import { browserHistory } from 'react-router';
import ajax from '../../../common/ajax';
import {Form} from 'antd';

const createForm = Form.create;

let Category = React.createClass({
  render(){
    return(
      <div>我是类别信息组件</div>
    )
  }
});
Category = createForm()(Category);
export default Category
