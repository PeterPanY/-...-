import React from 'react';
import {browserHistory} from 'react-router';
import $ from 'jquery';
import { Row,Col,Button,Table,Input,Select,Icon,DatePicker,Modal } from 'antd';
import echarts from 'echarts';
import ajax from '../../../common/ajax';
import './Tren.css';

const Option = Select.Option;
const MonthPicker = DatePicker.MonthPicker;

const Trend=React.createClass({
  getInitialState(){
    return({
      trendSystem:{key:'URM'},
      trendSystemName:'用户管理',
      trendRate:'day',
      dayStart:null,
      dayStartString:'',
      dayEnd:null,
      dayEndString:'',
      monthStart:null,
      monthStartString:'',
      monthEnd:null,
      monthEndString:''
    })
  },
  componentDidMount(){
    this.showHide(this.state.trendRate);
  },
  trendSystemChange(value){
    this.setState({
      trendSystem:{key:value.key},
      trendSystemName:value.label
    });
  },
  trendRateChange(value){
    this.setState({
      trendRate:value,
      dayStart:null,
      dayStartString:'',
      dayEnd:null,
      dayEndString:'',
      monthStart:null,
      monthStartString:'',
      monthEnd:null,
      monthEndString:''
    });
    this.showHide(value);
  },
  dayStartChange(date,dateString){
    this.setState({
      dayStart:date,
      dayStartString:dateString
    })
  },
  dayEndChange(date,dateString){
    this.setState({
      dayEnd:date,
      dayEndString:dateString
    })
  },
  disabledDayStart(disabledDayStart){
    if (!disabledDayStart || !this.state.dayEnd) {
      return false;
    }
    return disabledDayStart.getTime()+3600000 >= this.state.dayEnd.getTime()||disabledDayStart.getTime()+3600000+2592000000 <= this.state.dayEnd.getTime();
  },
  disabledDayEnd(disabledDayEnd){
    if (!disabledDayEnd || !this.state.dayStart) {
      return false;
    }
    return disabledDayEnd.getTime()-3600000 <= this.state.dayStart.getTime()||disabledDayEnd.getTime()-3600000-2592000000 >= this.state.dayStart.getTime();
  },
  monthStartChange(date,dateString){
    this.setState({
      monthStart:date,
      monthStartString:dateString
    });
  },
  monthEndChange(date,dateString){
    this.setState({
      monthEnd:date,
      monthEndString:dateString
    })
  },
  disabledMonthStart(disabledMonthStart){
    if (!disabledMonthStart || !this.state.monthEnd) {
      return false;
    }
    return disabledMonthStart.getTime()+86400000 >= this.state.monthEnd.getTime();
  },
  disabledMonthEnd(disabledMonthEnd){
    if (!disabledMonthEnd || !this.state.monthStart) {
      return false;
    }
    return disabledMonthEnd.getTime()-86400000 <= this.state.monthStart.getTime();
  },
  showHide(value){
    if(value=='day'){
      $('#trendDay').show();
      $('#trendMonth').hide();
    }else if(value=='month'){
      $('#trendDay').hide();
      $('#trendMonth').show();
    }
  },
  handleSearch(){
    let _this=this;
    if(this.state.trendRate=='day'){
      if(this.state.dayStartString==''||this.state.dayEndString==''){
        Modal.error({
          title:'请填写开始日期/结束日期'
        })
      }else {
        let myChart=echarts.init(document.getElementById('trend'));
        myChart.showLoading();
        ajax({
          url:'subLog/countLogByDay.do',
          type:'post',
          data:{
            systemName:this.state.trendSystem.key,
            startTime:this.state.dayStartString,
            endTime:this.state.dayEndString
          },
          success(res){
            myChart.hideLoading();
            myChart.setOption({
              title: {
                text: _this.state.trendSystemName+'各级别日志走势'
              },
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data:['debug','info','warn','error']
              },
              grid: {
                left: '2%',
                right: '4%',
                bottom: '2%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: res.logCount.map(function (data) {
                  return data.createTimeText
                })
              },
              yAxis: {
                type: 'value',
                splitLine:{
                  lineStyle:{
                    type:'dotted'
                  }
                }
              },
              series: [
                {
                  name:'debug',
                  type:'line',
                  data:res.logCount.map(function (data) {
                    return data.debugCount
                  })
                },
                {
                  name:'info',
                  type:'line',
                  data:res.logCount.map(function (data) {
                    return data.infoCount
                  })
                },
                {
                  name:'warn',
                  type:'line',
                  data:res.logCount.map(function (data) {
                    return data.warnCount
                  })
                },
                {
                  name:'error',
                  type:'line',
                  data:res.logCount.map(function (data) {
                    return data.errorCount
                  })
                }
              ],
              color:['#2df5b4','#61a5a8','#e0cb91','#c23531']
            })
          },
          error(){
            myChart.hideLoading();
            Modal.error({
              title:'服务器连接失败'
            })
          }
        })
      }
    }else if(this.state.trendRate=='month'){
      if(this.state.monthStartString==''||this.state.monthEndString==''){
        Modal.error({
          title:'请填写开始日期/结束日期'
        })
      }else {
        let myChart=echarts.init(document.getElementById('trend'));
        myChart.showLoading();
        ajax({
          url:'subLog/countLogByMon.do',
          type:'post',
          data:{
            systemName:this.state.trendSystem.key,
            startTime:this.state.monthStartString,
            endTime:this.state.monthEndString
          },
          success(res){
            myChart.hideLoading();
            myChart.setOption({
              title: {
                text: _this.state.trendSystemName+'各级别日志走势'
              },
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data:['debug','info','warn','error']
              },
              grid: {
                left: '2%',
                right: '4%',
                bottom: '2%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: res.logCount.map(function (data) {
                  return data.createTimeText
                })
              },
              yAxis: {
                type: 'value',
                splitLine:{
                  lineStyle:{
                    type:'dotted'
                  }
                }
              },
              series: [
                {
                  name:'debug',
                  type:'line',
                  data:res.logCount.map(function (data) {
                    return data.debugCount
                  })
                },
                {
                  name:'info',
                  type:'line',
                  data:res.logCount.map(function (data) {
                    return data.infoCount
                  })
                },
                {
                  name:'warn',
                  type:'line',
                  data:res.logCount.map(function (data) {
                    return data.warnCount
                  })
                },
                {
                  name:'error',
                  type:'line',
                  data:res.logCount.map(function (data) {
                    return data.errorCount
                  })
                }
              ],
              color:['#2df5b4','#61a5a8','#e0cb91','#c23531']
            })
          },
          error(){
            myChart.hideLoading();
            Modal.error({
              title:'服务器连接失败'
            })
          }
        })
      }
    }
  },
  render(){
    return(
      <div>
        <div className="trendTitle">
          <h2>日志走势分析：</h2>
        </div>
        <Row className="trendSearch">
          <Col>
            <label>子系统名称</label>
            <Select value={this.state.trendSystem} onChange={this.trendSystemChange} labelInValue style={{width:140,marginRight:10}}>
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
            <label>统计频率</label>
            <Select value={this.state.trendRate} onChange={this.trendRateChange} style={{width:140,marginRight:10}}>
              <Option value='day'>按日统计</Option>
              <Option value='month'>按月统计</Option>
            </Select>
            <label>时间段</label>
            <div id="trendDay">
              <DatePicker value={this.state.dayStart} onChange={this.dayStartChange} disabledDate={this.disabledDayStart} placeholder="开始日期" style={{width:140}} />
              <span>-</span>
              <DatePicker value={this.state.dayEnd} onChange={this.dayEndChange} disabledDate={this.disabledDayEnd} placeholder="结束日期" style={{width:140}} />
            </div>
            <div id="trendMonth">
              <MonthPicker value={this.state.monthStart} onChange={this.monthStartChange} disabledDate={this.disabledMonthStart} placeholder="开始日期" style={{width:120}} />
              <span>-</span>
              <MonthPicker value={this.state.monthEnd} onChange={this.monthEndChange} disabledDate={this.disabledMonthEnd} placeholder="结束日期" style={{width:120}} />
            </div>
            <Button type="primary" onClick={this.handleSearch} style={{marginLeft:20}}><Icon type="search" /></Button>
          </Col>
        </Row>
        <div id="trend" style={{height:450}}></div>
      </div>
    )
  }
});
export default Trend;
