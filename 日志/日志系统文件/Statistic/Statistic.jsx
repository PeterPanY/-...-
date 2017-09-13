import React from 'react';
import {browserHistory} from 'react-router';
import $ from 'jquery';
import ajax from '../../../common/ajax';
import { Row,Col,Button,Table,Input,Select,Icon,DatePicker,Modal } from 'antd';
import './Statistic.css';

const Option = Select.Option;

const Statistic = React.createClass({
  getInitialState(){
    return ({
      columns: [
        {title: "子系统名称", width: "20%", dataIndex: "systemCode"},
        {title: "DEBUG", width: "20%", dataIndex: "debugCount"},
        {title: "INFO", width: "20%", dataIndex: "infoCount"},
        {title: "WARN", width: "20%", dataIndex: "warnCount"},
        {title: "ERROR", width: "20%", dataIndex: "errorCount"},
      ],
      data: [],
      pagination: false,
      loading: false,
      statisticSystem: '',
    })
  },
  componentDidMount(){
    let _this = this;
    this.setState({
      loading: true,
    });
    ajax({
      url: 'logCount/findLogCountList.do',
      type: 'post',
      success(res){
        _this.setState({
          loading: false,
        });
        if (res.result == 1) {
          _this.setState({
            data: res.logCountList,
          });
        } else {
          Modal.error({
            title: '系统错误',
          });
        }
      },
      error(){
        _this.setState({
          loading: false,
        });
        Modal.error({
          title: '服务器连接失败',
        });
      }
    })
  },
  statisticSystemChange(value){
    this.setState({
      statisticSystem: value,
    });
  },
  handleSearch(){
    let _this = this;
    this.setState({
      loading: true,
    });
    let data = {
      systemName: this.state.statisticSystem,
    };
    ajax({
      url: 'logCount/findLogCountList.do',
      type: 'post',
      data: data,
      success(res){
        _this.setState({
          loading: false,
        });
        if (res.result == 1) {
          _this.setState({
            data: res.logCountList,
          });
        } else {
          Modal.error({
            title: '系统错误',
          });
        }
      },
      error(){
        _this.setState({
          loading: false,
        });
        Modal.error({
          title: '服务器连接失败',
        });
      }
    })
  },
  handleDownload(){
    window.location.href = "http://192.168.0.104:8085/lrmmanage/logCount/exportExcel.do"
  },
  render(){
    return (
      <div>
        <div className="statisticTitle">
          <h2>日志报表统计：</h2>
        </div>
        <Row className="statisticSearch">
          <Col>
            <label>子系统名称</label>
            <Select value={this.state.statisticSystem} onChange={this.statisticSystemChange}
                    style={{width:140,marginRight:20}}>
              <Option value=''>全部</Option>
              <Option value='URM'>用户管理</Option>
              <Option value='OSM'>运维管理</Option>
              <Option value='RRM'>资源管理</Option>
              <Option value='LRM'>日志管理</Option>
              <Option value='ARM'>应用管理</Option>
              <Option value='SRM'>服务管理</Option>
              <Option value='IRM'>接口管理</Option>
              <Option value='SSO'>单点登录</Option>
              <Option value='FRM'>文件管理</Option>
              <Option value='MRM'>终端监控</Option>
              <Option value='CAPCLOUND'>登陆中心</Option>
            </Select>
            <Button type="primary" onClick={this.handleSearch}><Icon type="search"/></Button>
            <Button type="primary" onClick={this.handleDownload} style={{float:'right'}}><Icon
              type="download"/>导出</Button>
          </Col>
        </Row>
        <Table rowKey={function(item){return item.systemName}} className="statisticSearchTable"
               columns={this.state.columns} dataSource={this.state.data} pagination={this.state.pagination}
               loading={this.state.loading} size="middle" bordered/>
      </div>
    )
  }
});
export default Statistic;
