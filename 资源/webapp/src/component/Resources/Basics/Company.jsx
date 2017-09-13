import React from 'react';
import { browserHistory } from 'react-router';
import ajax from '../../../common/ajax';
import {Form} from 'antd';

const createForm = Form.create;

let Company = React.createClass({
  render(){
    return(
      <div>我是厂商管理信息组件</div>
    )
  }
});
Company = createForm()(Company);
export default Company
