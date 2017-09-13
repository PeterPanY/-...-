import React from 'react';
import {browserHistory} from 'react-router';
import $ from 'jquery';
import ajax from '../../../common/ajax';
import { Row,Col,Button,Table,Input,Icon,Modal,Form,Radio,Card } from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;

let DataTest = React.createClass({
  getInitialState() {
    return ({
      logTypeData: [],
      visible: false,
      addLogTypeModal: false,
      changeLogTypeModal: false,
      delLogTypeModal: false
    })
  },
  componentDidMount() {
    this.LogTypeList()
  },
  //获取日志类型数据
  LogTypeList() {
    this.setState({
      loading: true
    });
    let _this = this;
    ajax({
      url: 'getLogTypeList.do',
      type: 'post',
      success: function (res) {
        _this.setState({
          loading: false
        });
        let logTypeData;
        if (typeof res.data == 'string') {
          logTypeData = []
        } else {
          logTypeData = res.data
        }
        if (res.ret === 'SUCCESS') {
          _this.setState({
            logTypeData: logTypeData
          })
        } else {
          Modal.error({
            title: '服务器数据连接失败'
          })
        }
      },
      error: function (res) {
        _this.setState({
          loading: false
        });
        Modal.error({
          title: '服务器错误'
        })
      }
    })
  },
  //添加类型,显示添加对话框
  addLogType() {
    this.setState({
      addLogTypeModal: true
    });
  },
  //确定添加日志类型
  addLogTypeOk() {
    let _this = this;
    this.props.form.validateFieldsAndScroll((errors, values) => {
      this.setState({
        confirmLoading: true
      });
      let addType;
      if (!values.addLogTypeName.trim()) {
        this.setState({
          confirmLoading: false
        });
        Modal.error({
          title: '添加类型不能为空格'
        });
        this.props.form.resetFields();
        return
      } else {
        addType = values.addLogTypeName.trim()
      }
      // console.log(addType);
      ajax({
        url: 'addLogType.do',
        type: 'post',
        data: {typeName: addType},
        success: function (res) {
          if (res.ret === 'SUCCESS') {
            _this.setState({
              confirmLoading: false
            });
            _this.setState({
              addLogTypeModal: false
            });
            Modal.success({
              title: "添加日志类型成功"
            });
            _this.LogTypeList();
            _this.props.form.resetFields();
          } else {
            Modal.error({
              title: '服务器错误，日志类型添加失败'
            });
          }
        },
        error: function (res) {
          _this.setState({
            confirmLoading: false
          });
          Modal.error({
            title: '服务器异常'
          });
        }
      })

    })
  },
  //修改类型
  changeLogType(changeTypeId, changeTypeName) {
    this.setState({
      changeLogTypeModal: true,
      changeLogTypeId: changeTypeId
    });
    this.props.form.setFieldsValue({
      changeLogTypeName: changeTypeName
    })
  },
  //确定修改
  changeLogTypeOk() {
    let _this = this;
    this.props.form.validateFieldsAndScroll((errors, values) => {
      _this.setState({
        changeconfirmLoading: true
      });
      let changeTypeData;
      if (!values.changeLogTypeName || !values.changeLogTypeName.trim()) {
        this.setState({
          changeconfirmLoading: false
        });
        Modal.error({
          title: '修改业务不能为空'
        });
        this.props.form.resetFields();
        return
      } else {
        changeTypeData = values.changeLogTypeName.trim()
      }
      let changeLogTypeData = {
        blogTypeId: this.state.changeLogTypeId,
        typeName: changeTypeData
      };
      ajax({
        url: 'updateLogType.do',
        type: 'post',
        data: changeLogTypeData,
        success: function (res) {
          _this.setState({
            changeconfirmLoading: false
          });
          if (res.ret == 'SUCCESS') {
            _this.setState({
              changeLogTypeModal: false
            });
            Modal.success({
              title: '日志类型修改成功'
            });
            _this.LogTypeList()
          } else {
            Modal.error({
              title: '日志类型修改失败'
            });
          }
        },
        error: function (res) {
          _this.setState({
            changeconfirmLoading: false
          });
          Modal.error({
            title: '服务连接失败',
          });
        }
      })
    })
  },
  //删除类型
  delLogType(delTypeId) {
    this.setState({
      delLogTypeModal: true,
      delLogTypeId: delTypeId
    });
  },
  //确定删除
  delLogTypeOk() {
    let _this = this;
    this.setState({
      loading: true
    });
    ajax({
      url: 'deleteLogType.do',
      type: 'post',
      data: {blogTypeId: this.state.delLogTypeId},
      success: function (res) {
        // console.log(res)
        _this.setState({
          loading: false,
          delLogTypeModal: false
        });
        if (res.ret == 'SUCCESS') {
          Modal.success({
            title: '删除方法成功！'
          });
          _this.LogTypeList()
        } else {
          Modal.error({
            title: '删除失败，' + res.data
          });
        }
      },
      error(){
        _this.setState({
          loading: false
        });
        Modal.error({
          title: '服务器错误'
        });
      }
    })
  },
  /*弹窗里面 点击遮罩层或右上角叉或取消按钮的回调 */
  handleCancel(e) {
    this.setState({
      addLogTypeModal: false,
      changeLogTypeModal: false,
      delLogTypeModal: false,
      confirmLoading: false,
      changeconfirmLoading: false,
      loading: false
    });
  },
  render() {
    let _this = this;
    const { getFieldProps} = this.props.form;
    const addLogTypeName = getFieldProps('addLogTypeName', {
      rules: [
        {required: true, pattern: /\S/, message: '日志类型名字不能为空'}
      ]
    });
    const changeLogTypeName = getFieldProps('changeLogTypeName', {
      rules: [
        {required: true, min: /\S/, message: '日志类型名字不能为空'}
      ]
    });
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 12},
    };
    return (
      <div className="CardTitle">
        <Card title="日志类型列表"
              loading={this.state.loading}
              extra={<a href="javascript:;" onClick={this.addLogType}>添加类型</a>}
              style={{ width: '50%' }}>
          <ul>
            {this.state.logTypeData.map(function (item, index) {
              return (
                <li key={index}>{item.typeName}
                  <div style={{ float: 'right' }}>
                    <a href="javascript:;"
                       onClick={_this.changeLogType.bind(null, item.blogTypeId, item.typeName)}>修改</a>
                    <a href="javascript:;" style={{ marginLeft: '10px' }}
                       onClick={_this.delLogType.bind(null, item.blogTypeId)}>删除</a>
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>
        {/*添加日志类型*/}
        <Modal
          title="添加日志类型"
          wrapClassName="vertical-center-modal"
          visible={this.state.addLogTypeModal}
          onOk={this.addLogTypeOk}
          onCancel={this.handleCancel}
          confirmLoading={this.state.confirmLoading}
        >
          <Form horizontal>
            <FormItem {...formItemLayout} label="类型名称" hasFeedback>
              <Input {...addLogTypeName} placeholder="请输入需要添加的日志类型"/>
            </FormItem>
          </Form>
        </Modal>
        {/*修改日志类型*/}
        <Modal
          title="修改日志类型"
          wrapClassName="vertical-center-modal"
          visible={this.state.changeLogTypeModal}
          onOk={this.changeLogTypeOk}
          onCancel={this.handleCancel}
          confirmLoading={this.state.changeconfirmLoading}
        >
          <Form horizontal>
            <FormItem {...formItemLayout} label="类型名称" hasFeedback>
              <Input {...changeLogTypeName} placeholder="请输入需要添加的日志类型"/>
            </FormItem>
          </Form>
        </Modal>
        {/*删除日志类型*/}
        <Modal
          title="删除日志类型"
          wrapClassName="vertical-center-modal"
          visible={this.state.delLogTypeModal}
          onOk={this.delLogTypeOk}
          onCancel={this.handleCancel}
        >
          <p>你真的要把这个日志类型删除吗？</p>
        </Modal>
      </div>
    )
  }
});
DataTest = createForm()(DataTest);
export default DataTest;
