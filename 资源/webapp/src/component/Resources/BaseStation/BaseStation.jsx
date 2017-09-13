import React from 'react';
import { browserHistory } from 'react-router';
import ajax from '../../../common/ajax';
import {Form} from 'antd';

const createForm = Form.create;

let Base = React.createClass({
  render(){
    return(
      <div>我是基站组件</div>
    )
  }
});
Base = createForm()(Base);
export default Base
