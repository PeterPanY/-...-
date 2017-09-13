import React from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import ajax from '../../../common/ajax';
import { Row, Col, Button, Input, Icon, Form, Modal, message, Select, Card,Table } from 'antd';
import '../../../common/Data.css';
import echarts from 'echarts'

const createForm = Form.create;
const FormItem = Form.Item;

let DataStatement = React.createClass({
  getInitialState(){
    return ({
      onlineReportData: [{
        name: '数据连接中...',
        value: 1
      }],
      //busOnlineData: ['数据连接中...'],
      //onlineData: [1],
      //nonlineData: [],
      columns: [
        {title: "服务名称", width: "33.3%", dataIndex: "name"},
        {
          title: "上下线", width: "33.3%", dataIndex: "fnOnline", render: (
          function (text, record) {
            if (text == '0') {
              return <span>下线</span>
            } else if (text == '1') {
              return <span>上线</span>
            }
          }
        )
        },
        {title: "更新时间", width: "33.3%", dataIndex: "onlineUpdateTime"}
      ],
    })
  },
  componentDidMount(){
    this.handleSearch();
    this.onlineEcharts();
    this.onlineReport();
    this.onlineTimeReport();
    this.onlineLineStack()
  },
  // 上下线饼图
  onlineEcharts() {
    let _this = this
    let onlineChart = echarts.init(document.getElementById('leftmian'));
    //onlineChart.showLoading();
    let option = {
      title: {
        text: '服务上下线数据统计',
        subtext: '数据来源于服务上下线统计',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['上线', '下线']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      series: [
        {
          name: '上下线具体情况',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          label: {
            normal: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              // shadowBlur:3,
              // shadowOffsetX: 2,
              // shadowOffsetY: 2,
              // shadowColor: '#999',
              // padding: [0, 7],
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                abg: {
                  backgroundColor: '#333',
                  width: '100%',
                  align: 'right',
                  height: 22,
                  borderRadius: [4, 4, 0, 0]
                },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            }
          },
          data: _this.state.onlineReportData,
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    onlineChart.setOption(option);
    onlineChart.on('click', function (param) {

      // console.log(param);//这里根据param填写你的跳转逻辑
      let onlineValue
      if (param.name == '上线') {
        onlineValue = 1
      } else {
        onlineValue = 0
      }
      _this.setState({
        onlineValue: onlineValue,
        busValue: undefined
      });
      _this.handleSearch()
    });
  },
  //上下线数据
  onlineReport() {
    let _this = this;
    ajax({
      url: 'onlineReport.do',
      type: 'post',
      success(res) {
        if (res.ret == "SUCCESS") {
          // console.log(res)
          let onlineReportData = []
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].name == 1) {
              onlineReportData.push({
                name: '上线',
                value: res.data[i].value
              })
            } else {
              onlineReportData.push({
                name: '下线',
                value: res.data[i].value
              })
            }
          }
          _this.setState({
            onlineReportData: onlineReportData
          })
          _this.onlineEcharts()
        } else {
          Modal.error({
            title: '服务器错误，获取数据失败'
          });
        }
      },
      error() {
        Modal.error({
          title: '服务器错误'
        });
      }
    })
    // console.log(_this.state.onlineReportData)

  },
  /* 转换时间个格式*/
  timeFormat: function (da) {
    da = new Date(da);
    var year = da.getFullYear();
    var month = da.getMonth() + 1;
    var date = da.getDate();
    return ([year, month, date].join('-'));
  },
  //上下线搜索
  handleSearch() {
    let _this = this;
    this.setState({
      searchOnline: this.state.onlineValue,
      //business: { businessName: this.state.busValue }
    });
    let data = {
      curPage: 1,
      obj: {
        svOnline: this.state.onlineValue,
        //business: { businessName: this.state.busValue },
      }
    };
    // console.log(data);
    this.setState({
      loading: true
    });
    ajax({
      url: 'getDataList.do',
      type: 'post',
      data: data,
      success: function (res) {
        console.log(res)
        _this.setState({
          loading: false
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
              _this.handlePageChange(current, searchUrl)
            }
          };
          let searchDataArr = res.data.data || []
          for (var i = 0; i < searchDataArr.length; i++) {
            searchDataArr[i].onlineUpdateTime = _this.timeFormat(searchDataArr[i].datefnUpdateTime)
          }
          _this.setState({
            data: searchDataArr,
            pagination: pagination,
            selectedRowKeys: []
          });
        } else {
          Modal.warning({
            title: '没有搜索到你所查的方法，请检查是否输入错误'
          });
        }
      },
      error() {
        _this.setState({
          loading: false
        });
        Modal.error({
          title: '服务连接失败'
        });
      }
    })

  },
  /*上下线点击分页*/
  handlePageChange: function (current) {
    let _this = this;
    let data = {
      curPage: current,
      obj: {
        svOnline: this.state.searchOnline,
        //business: this.state.business,
      }
    };
    this.setState({
      loading: true
    });
    ajax({
      url: 'getDataList.do',
      type: 'post',
      data: data,
      success: function (res) {
        _this.setState({
          loading: false
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
              _this.handlePageChange(current, searchUrl)
            }
          };
          let dataLog = res.data.data || []
          for (var i = 0; i < dataLog.length; i++) {
            dataLog[i].onlineUpdateTime = _this.timeFormat(dataLog[i].datefnUpdateTime)
          }
          _this.setState({
            data: res.data.data,
            pagination: pagination,
            selectedRowKeys: []
          });
        } else {
          Modal.error({
            title: '系统错误',
          });
        }
      },
      error: function (err) {
        Modal.error({
          title: '服务器错误'
        });
      }
    })

  },
  // 显示上下线
  onlineClick() {
    let _this = this;
    this.setState({
      onlineValue: undefined,
      //busValue: undefined
    });
    setTimeout(function () {
      _this.handleSearch()
    }, 40);
  },
  //上下线柱状图数据
  onlineTimeReport() {
    let _this = this;
    ajax({
      url: 'timeReport.do',
      type: 'post',
      success(res) {
        // console.log(res)
        if (res.ret == "SUCCESS") {
          let busOnlineData = [];
          let onlineData = [];
          let nonlineData = [];
          for (let i = 0; i < res.data.length; i++) {
            busOnlineData.push(res.data[i].mark);
            onlineData.push(res.data[i].online);
            nonlineData.push(res.data[i].nonline)
          }
          _this.setState({
            busOnlineData: busOnlineData,
            onlineData: onlineData,
            nonlineData: nonlineData
          });
          _this.onlineLineStack()
        } else {
          Modal.error({
            title: '服务器错误，获取数据失败'
          });
        }
      },
      error() {
        Modal.error({
          title: '服务器错误'
        });
      }
    })
  },
  // 上下线柱状图
  onlineLineStack() {
    //console.log(11);
    let _this = this;
    let businessChart = echarts.init(document.getElementById('leftLineStack'));
    businessChart.showLoading();
    let option = {
      title: {
        text: '业务上下线堆叠折线图'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['上线', '下线']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          dataView: {readOnly: false},
          magicType: {type: ['line', 'bar']},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: _this.state.busOnlineData
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '上线',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          areaStyle: {normal: {}},
          data: _this.state.onlineData
        },
        {
          name: '下线',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          areaStyle: {normal: {}},
          data: _this.state.nonlineData
        }
      ]
    };
    businessChart.setOption(option);
  },
  render(){
    return (
      <div>
        <div className="clearfix">
          <div id="leftmian" style={{ width: '40%', height: 400, float: 'left', marginLeft: '5%' }}></div>
          <Card title="上下线详情数据表"
                extra={<a href="javascript:;" onClick={this.onlineClick}>显示全部</a>}
                style={{ width: '40%', float: 'right', marginRight: '5%' }}>
            <Table className="logSearchTable"
                   columns={this.state.columns}
                   dataSource={this.state.data}
                   pagination={this.state.pagination}
                   loading={this.state.loading}
                   size="middle" bordered/>
          </Card>
        </div>
        <div id="leftLineStack"></div>
      </div>
    )
  }
});
DataStatement = createForm()(DataStatement);
export default DataStatement
