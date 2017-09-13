import React from 'react';
import { browserHistory } from 'react-router';
import ajax from '../../../common/ajax';
import {Form} from 'antd';

const createForm = Form.create;

let GSSI = React.createClass({
  render(){
    return(
      <div>我是组号组件</div>
    )
  }
});
GSSI = createForm()(GSSI);
export default GSSI
