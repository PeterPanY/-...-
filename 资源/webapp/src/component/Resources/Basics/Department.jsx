import React from 'react';
import { browserHistory } from 'react-router';
import ajax from '../../../common/ajax';
import {Form,Tree,Modal,Tabs,Input,Button } from 'antd';
const createForm = Form.create;
const TreeNode = Tree.TreeNode;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

var setting = {
  view: {
    addHoverDom: addHoverDom,
    removeHoverDom: removeHoverDom,
    selectedMulti: false
  },
  edit: {
    enable: true,
    editNameSelectAll: true,
    showRemoveBtn: showRemoveBtn,
    showRenameBtn: showRenameBtn
  },
  data: {
    simpleData: {
      enable: true
    }
  },
  callback: {
    beforeDrag: beforeDrag,
    beforeEditName: beforeEditName,
    beforeRemove: beforeRemove,
    beforeRename: beforeRename,
    onRemove: onRemove,
    onRename: onRename
  }
};

var zNodes = [
  {id: 1, pId: 0, name: "父节点 1", open: true},
  {id: 11, pId: 1, name: "叶子节点 1-1"},
  {id: 12, pId: 1, name: "叶子节点 1-2"},
  {id: 13, pId: 1, name: "叶子节点 1-3"},
  {id: 2, pId: 0, name: "父节点 2", open: true},
  {id: 21, pId: 2, name: "叶子节点 2-1"},
  {id: 22, pId: 2, name: "叶子节点 2-2"},
  {id: 23, pId: 2, name: "叶子节点 2-3"},
  {id: 3, pId: 0, name: "父节点 3", open: true},
  {id: 31, pId: 3, name: "叶子节点 3-1"},
  {id: 32, pId: 3, name: "叶子节点 3-2"},
  {id: 33, pId: 3, name: "叶子节点 3-3"}
];
var log, className = "dark";
function beforeDrag(treeId, treeNodes) {
  return false;
}
function beforeEditName(treeId, treeNode) {
  className = (className === "dark" ? "" : "dark");
  showLog("[ " + getTime() + " beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
  var zTree = $.fn.zTree.getZTreeObj("treeDemo");
  zTree.selectNode(treeNode);
  setTimeout(function () {
    if (confirm("进入节点 -- " + treeNode.name + " 的编辑状态吗？")) {
      setTimeout(function () {
        zTree.editName(treeNode);
      }, 0);
    }
  }, 0);
  return false;
}
function beforeRemove(treeId, treeNode) {
  className = (className === "dark" ? "" : "dark");
  showLog("[ " + getTime() + " beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
  var zTree = $.fn.zTree.getZTreeObj("treeDemo");
  zTree.selectNode(treeNode);
  return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
}
function onRemove(e, treeId, treeNode) {
  showLog("[ " + getTime() + " onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
}
function beforeRename(treeId, treeNode, newName, isCancel) {
  className = (className === "dark" ? "" : "dark");
  showLog((isCancel ? "<span style='color:red'>" : "") + "[ " + getTime() + " beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>" : ""));
  if (newName.length == 0) {
    setTimeout(function () {
      var zTree = $.fn.zTree.getZTreeObj("treeDemo");
      zTree.cancelEditName();
      alert("节点名称不能为空.");
    }, 0);
    return false;
  }
  return true;
}
function onRename(e, treeId, treeNode, isCancel) {
  showLog((isCancel ? "<span style='color:red'>" : "") + "[ " + getTime() + " onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name + (isCancel ? "</span>" : ""));
}
function showRemoveBtn(treeId, treeNode) {
  return !treeNode.isFirstNode;
}
function showRenameBtn(treeId, treeNode) {
  return !treeNode.isLastNode;
}
function showLog(str) {
  if (!log) log = $("#log");
  log.append("<li class='" + className + "'>" + str + "</li>");
  if (log.children("li").length > 8) {
    log.get(0).removeChild(log.children("li")[0]);
  }
}
function getTime() {
  var now = new Date(),
    h = now.getHours(),
    m = now.getMinutes(),
    s = now.getSeconds(),
    ms = now.getMilliseconds();
  return (h + ":" + m + ":" + s + " " + ms);
}

var newCount = 1;
function addHoverDom(treeId, treeNode) {
  var sObj = $("#" + treeNode.tId + "_span");
  if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
  var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
    + "' title='add node' onfocus='this.blur();'></span>";
  sObj.after(addStr);
  var btn = $("#addBtn_" + treeNode.tId);
  if (btn) btn.bind("click", function () {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    zTree.addNodes(treeNode, {id: (100 + newCount), pId: treeNode.id, name: "new node" + (newCount++)});
    return false;
  });
};
function removeHoverDom(treeId, treeNode) {
  $("#addBtn_" + treeNode.tId).unbind().remove();
};
function selectAll() {
  var zTree = $.fn.zTree.getZTreeObj("treeDemo");
  zTree.setting.edit.editNameSelectAll = $("#selectAll").attr("checked");
}

$(document).ready(function () {
  $.fn.zTree.init($("#treeDemo"), setting, zNodes);
  $("#selectAll").bind("click", selectAll);
});


let Department = React.createClass({
  getInitialState() {
    return ({})
  },
  componentDidMount(){
    let _this = this;
    ajax({
      url: 'getDepartmentTree.do',
      type: 'post',
      success(res){
        console.log(res);
        if (res.ret == 'SUCCESS') {

          _this.setState({
            treeData: res.data
          })
        } else {
          Modal.error({
            title: '系统错误'
          });
        }
      },
      error(){
        Modal.error({
          title: '服务连接失败'
        });
      }
    })
  },


  depCallback(key) {
    console.log(key);
  },
  render(){


    const { getFieldProps } = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 10}
    };
    return (
      <div className="department">
        <div className="logTitle">
          <h2>部门信息管理</h2>
        </div>
        <div className="dep_tree">
          <h3>部门详情</h3>

        </div>
        <div className="dep_operation">
          <h3>部门操作详情</h3>
          <div class="zTreeDemoBackground left">
            <ul id="treeDemo" class="ztree"></ul>
          </div>
          <Tabs defaultActiveKey="1" onChange={this.depCallback}>
            <TabPane tab="添加部门" key="1">
              <Form horizontal className="add_dep" onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="新增部门">
                  <Input type="password" {...getFieldProps('pass', {initialValue: ''})} placeholder="请输入部门"/>
                </FormItem>
                <FormItem wrapperCol={{ span: 12, offset: 14 }} style={{ marginTop: 24 }}>
                  <Button type="primary" htmlType="submit">确定</Button>
                </FormItem>
              </Form>
            </TabPane>
            <TabPane tab="修改部门" key="2">选项卡二内容</TabPane>
            <TabPane tab="删除部门" key="3">选项卡三内容</TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
})

Department = createForm()(Department);
export default Department
