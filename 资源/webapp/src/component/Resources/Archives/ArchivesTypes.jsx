import React from 'react';
import { browserHistory } from 'react-router';
import ajax from '../../../common/ajax';
import {Form} from 'antd';

const createForm = Form.create;

let ArchivesTypes = React.createClass({
  render(){
    return(
      <div>我是档案类别管理组件</div>
    )
  }
});
ArchivesTypes = createForm()(ArchivesTypes);
export default ArchivesTypes
