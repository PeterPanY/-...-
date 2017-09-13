import React from 'react';
import { browserHistory } from 'react-router';
import ajax from '../../../common/ajax';
import {Form,Table,Modal,Row,Col,Input,DatePicker,Button,Icon} from 'antd';

const createForm = Form.create;

let Goods = React.createClass({
  getInitialState() {
    return({
      columns: [
        { title: "服务名字", width: "10%", dataIndex: "serviceName" },
        { title: "服务描述", width: "10%", dataIndex: "svDescr" },


      ]
    })
  },
  componentDidMount(){
    this.handleSearch()
  },
  /*点击搜索*/
  handleSearch: function () {
    let _this = this;
    this.setState({

    });
    let data = {

    };
    console.log(data);
    this.setState({
      loading: true
    });
    ajax({
      url: 'getBrandList.do',
      type: 'post',
      data: data,
      success: function (res) {
        _this.setState({
          loading: false,
        });
        if (res.ret == 'SUCCESS') {
          let pagination = {
            total: res.data.rowCount,
            showTotal: function () {
              return ('共' + res.data.rowCount + '条')
            },
            pageSize: res.data.pageSize,
            current: 1,
            onChange(current) {
              _this.handlePageChange(current)
            }
          };
          _this.setState({
            data: res.data.data,
            pagination: pagination
          });
        } else {
          Modal.error({
            title: '系统错误',
          });
        }
      },
      error() {
        _this.setState({
          loading: false,
        });
        Modal.error({
          title: '服务连接失败',
        });
      }
    })

  },
  /*点击分页*/
  handlePageChange: function (current) {
    let _this = this;
    let data = {

    };
    this.setState({
      loading: true
    });
    console.log(data)
    ajax({
      url: 'getBrandList.do',
      type: 'post',
      data: data,
      success: function (res) {
        _this.setState({
          loading: false,
        });
        if (res.ret == 'SUCCESS') {
          let pagination = {
            total: res.data.rowCount,
            showTotal: function () {
              return ('共' + res.data.rowCount + '条')
            },
            pageSize: res.data.pageSize,
            current: res.data.curPage,
            onChange(current) {
              _this.handlePageChange(current)
            }
          };
          _this.setState({
            data: res.data.data,
            pagination: pagination
          });
        } else {
          Modal.error({
            title: '系统错误',
          });
        }
      },
      error() {
        _this.setState({
          loading: false,
        });
        Modal.error({
          title: '服务连接失败',
        });
      }
    })

  },
  render(){
    return(
      <div>
        {/*搜索限定条件*/}
        <Row className="logSearch">
          <Col>
            <label>服务名称</label>
            <Input type="text" ref="name" style={{ width: 80, marginRight: 10 }} />
            <label>时间段</label>
            <div id="trendDay">
              <DatePicker value={this.state.dayStartString} onChange={this.startTimeChange}
                          disabledDate={this.startTimeStart} placeholder="开始日期" style={{ width: 100 }} />
              <span>-</span>
              <DatePicker value={this.state.dayEndString} onChange={this.endTimeChange} disabledDate={this.startTimeEnd}
                          placeholder="结束日期" style={{ width: 100 }} />
            </div>
            <Button type="primary" style={{ marginLeft: 20 }} onClick={this.handleSearch}><Icon type="search" /></Button>
            <Button type="primary" onClick={this.handleAdd} style={{ float: 'right' }}>新增类型</Button>
          </Col>
        </Row>
        <Table
          columns={this.state.columns}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          size="middle" bordered/>
      </div>
    )
  }
});
Goods = createForm()(Goods);
export default Goods
