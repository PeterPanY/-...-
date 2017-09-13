import React from 'react';
import { browserHistory } from 'react-router';
import ajax from '../../../common/ajax';
import {Form} from 'antd';

const createForm = Form.create;

let TGSSI = React.createClass({
  render(){
    return(
      <div>我是直通号组件</div>
    )
  }
});
TGSSI = createForm()(TGSSI);
export default TGSSI
