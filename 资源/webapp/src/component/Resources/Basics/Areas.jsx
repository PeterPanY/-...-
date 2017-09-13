import React from 'react';
import { browserHistory } from 'react-router';
import ajax from '../../../common/ajax';
import {Form} from 'antd';

const createForm = Form.create;

let Areas = React.createClass({
  render(){
    return(
      <div>我是区域管理信息组件</div>
    )
  }
});
Areas = createForm()(Areas);
export default Areas
