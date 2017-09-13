import React from 'react';
import { browserHistory } from 'react-router';
import ajax from '../../../common/ajax';
import {Form} from 'antd';

const createForm = Form.create;

let Device = React.createClass({
  render(){
    return(
      <div>我是设备管理列表组件</div>
    )
  }
});
Device = createForm()(Device);
export default Device
