import React from 'react';
import { browserHistory } from 'react-router';
import ajax from '../../../common/ajax';
import {Form,Tabs,Icon } from 'antd';
import Brand from './GoodsBrand'
import Attribute from './GoodsAttribute'
import Type from './GoodsType'
import Specification from './GoodsSpecification.jsx'



const createForm = Form.create;
const TabPane = Tabs.TabPane;

let Goods = React.createClass({
  /*callback(key) {
    console.log(key);
  },*/
  render(){
    return (
      <Tabs defaultActiveKey="1" onChange={this.callback}>
        <TabPane tab={<span><Icon type="tags" />品牌管理</span>} key="1">
          <Brand></Brand>
        </TabPane>
        <TabPane tab={<span><Icon type="hdd" />规格管理</span>} key="2">
          <Specification></Specification>
        </TabPane>
        <TabPane tab={<span><Icon type="scan" />类型管理</span>} key="3">
          <Type></Type>
        </TabPane>
        <TabPane tab={<span><Icon type="book" />属性管理</span>} key="4">
          <Attribute></Attribute>
        </TabPane>
      </Tabs>
    )
  }
});
Goods = createForm()(Goods);
export default Goods
