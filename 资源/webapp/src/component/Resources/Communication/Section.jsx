import React from 'react';
import { browserHistory } from 'react-router';
import ajax from '../../../common/ajax';
import {Form} from 'antd';

const createForm = Form.create;

let Goods = React.createClass({
  render(){
    return(
      <div>我是段号组件</div>
    )
  }
});
Goods = createForm()(Goods);
export default Goods
