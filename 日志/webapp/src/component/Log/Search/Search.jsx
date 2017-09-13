import React from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import ajax from '../../../common/ajax';
import { Row, Col, Button, Table, Input, Select, Icon, DatePicker, Modal, Form, Radio, Upload } from 'antd';
import NewlyAdded from './NewlyAdded';
import './Search.css';
import { fileLoads } from '../../../common/fileUploads';


const Option = Select.Option;
const RadioGroup = Radio.Group;
const createForm = Form.create;
const FormItem = Form.Item;


let Search = React.createClass({
  //表格表头
  getInitialState() {
    /*return 表格数据*/
    let _this = this;
    return ({
      /*对话框是否可见  初始化对话框不可见*/
      visible: false, /*详情对话框*/
      xiuGai: false, /*x修改对话框*/
      delServer: false, /*删除对话框*/
      deleteSearchAllVisible: false,
      imgUploads: [],
      removeUploads: [],
      fileUploadsList: [],
      removeUploadsList: [],
      fileUploadData: [],
      businessAllData: [],
      selectedRowKeys: [],
      columns: [
        { title: "服务名字", width: "9%", dataIndex: "serviceName" },
        { title: "所属公司", width: "10%", dataIndex: "company" },
        { title: "服务描述", width: "10%", dataIndex: "svDescr" },
        { title: "负责人名字", width: "9%", dataIndex: "managerName" },
        { title: "负责人电话", width: "10%", dataIndex: "managerPhone" },
        { title: "操作系统", width: "9%", dataIndex: "systemVersion" },
        { title: "服务器ip", width: "10%", dataIndex: "svIp" },
       
        { title: "业务", width: "10%", dataIndex: "business.businessName" },
        {
          title: "上下线", width: "13%", dataIndex: "svOnline", render: (
            function (text, record) {
              if (text == '0') {
                return <span>下线<a href="javascript:;" style={{ marginLeft: '25%' }} type="primary"
                  onClick={_this.changeOnlineClick.bind(null, text, record.serviceId)}>切换状态</a></span>
              } else if (text == '1') {
                return <span>上线<a href="javascript:;" style={{ marginLeft: '25%' }} type="primary"
                  onClick={_this.changeOnlineClick.bind(null, text, record.serviceId)}>切换状态</a></span>
              }
            }
          )
        },
        {
          title: '操作', width: "10%", key: 'operation', render: (text, record) => (
            <span>
              <a href="javascript:;" id={record.serviceId} onClick={this.detailsClick}>详情</a>
              <span className="ant-divider"></span>
              <a href="javascript:;" id={record.serviceId} onClick={this.modifyClick}>修改</a>
              <span className="ant-divider"></span>
              <a href="javascript:;" id={record.serviceId} onClick={this.deleteServiceClick}>删除</a>
            </span>)
        },
      ]
    });
  },
  // 获取所有的业务
  businessAll() {
    let _this = this
    ajax({
      url: 'getBusinessList.do',
      type: 'post',
      success(res) {
        console.log(typeof res.data )
        let businessAllData
        if (typeof res.data == 'string') {
          Modal.warning({
            title: '服务业务为空，请先添加业务信息，不然服务资料查询将无法实现！'
          });
          console.log(11)
          businessAllData=[]
        }else{
          businessAllData=res.data
        }
        if (res.ret == "SUCCESS") {
          _this.setState({
            businessAllData: businessAllData
          })
        } else {
          Modal.error({
            title: '服务器异常,业务加载失败'
          });
        }
      },
      error() {
        Modal.error({
          title: '服务器异常,业务加载失败'
        });
      }
    })
  },
  componentDidMount: function () {
    this.handleSearch();
    this.businessAll()
  },
  /*搜索时间段的开始时间点击函数*/
  startTimeChange(date, dateString) {
    this.setState({
      dayStart: date,
      dayStartString: dateString
    })
  },
  /*搜索时间段的结束时间点击函数*/
  endTimeChange(date, dateString) {
    this.setState({
      dayEnd: date,
      dayEndString: dateString
    })
  },
  /*搜索时间段的开始时间函数*/
  startTimeStart(startTimeStart) {
    if (!startTimeStart || !this.state.dayEnd) {
      return false;
    }
    return startTimeStart.getTime() + 3600000 >= this.state.dayEnd.getTime() || startTimeStart.getTime() + 3600000 + 2592000000 <= this.state.dayEnd.getTime();
  },
  /*搜索时间段的结束时间函数*/
  startTimeEnd(startTimeEnd) {
    if (!startTimeEnd || !this.state.dayStart) {
      return false;
    }
    return startTimeEnd.getTime() - 3600000 <= this.state.dayStart.getTime() || startTimeEnd.getTime() - 3600000 - 2592000000 >= this.state.dayStart.getTime();
  },
  //搜索类型
  onlineChange(value) {

    let key
    if (value == '111') {
      key = undefined
    } else {
      key = value
    }
    this.setState({
      onlineValue: key
    });
  },
  //搜索业务变更
  onBusinessChange(value) {
    // console.log(value)
    let busValue
    if (value == 'changebus') {
      busValue = undefined
    } else {
      busValue = value
    }
    this.setState({
      busValue: busValue
    })
  },
  /*点击搜索*/
  handleSearch: function () {
    let _this = this;
    this.setState({
      serviceName: this.refs.name.refs.input.value,
      managerName: this.refs.managerName.refs.input.value,
      svOnline: this.state.onlineValue,
      business: { businessId: this.state.busValue },
      startTime: this.state.dayStartString,
      endTime: this.state.dayEndString,
    });
    let data = {
      curPage: 1,
      obj: {
        serviceName: this.refs.name.refs.input.value,
        managerName: this.refs.managerName.refs.input.value,
        svOnline: this.state.onlineValue,
        business: { businessId: this.state.busValue },
        startTime: this.state.dayStartString,
        endTime: this.state.dayEndString
      }
    };
    console.log(data);
    this.setState({
      loading: true
    });
    ajax({
      url: 'getServiceList.do',
      type: 'post',
      data: data,
      success: function (res) {
        // console.log(res)
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
      curPage: current,
      obj: {
        serviceName: this.state.serviceName,
        managerName: this.state.managerName,
        svOnline: this.state.onlineValue,
        business: this.state.business,
        startTime: this.state.dayStart,
        endTime: this.state.dayEnd
      }
    };
    this.setState({
      loading: true
    });
    console.log(data)
    ajax({
      url: 'getServiceList.do',
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
  /* 转换时间个格式*/
  timeFormat: function (da) {
    da = new Date(da);
    var year = da.getFullYear();
    var month = da.getMonth() + 1;
    var date = da.getDate();
    return ([year, month, date].join('-'));
  },
  /*点击详情*/
  detailsClick: function (ev) {
    ev = ev || window.event;
    let _this = this;
    let id = {
      serviceId: ev.target.id,
    };
    this.setState({
      loading: true
    })
    ajax({
      url: 'getServiceInfo.do',
      type: 'post',
      data: id,
      success: function (res) {
        _this.setState({
          visible: true,
          loading: false
        });
        if (res.ret == 'SUCCESS') {
          // console.log(res)
          let sUdaTime = _this.timeFormat(res.data.svUpdateTime);
          let nsy = res.data.svOnline;
          var shangXia = "";
          if (nsy == 0) {
            shangXia = "下线"
          } else {
            shangXia = "上线"
          }
          _this.setState({
            serName: res.data.serviceName,
            svDescr: res.data.svDescr,
            manNam: res.data.managerName,
            manPhone: res.data.managerPhone,
            sysVersion: res.data.systemVersion,
            svIp: res.data.svIp,
            svVer: res.data.svVersion,
            svFun: res.data.business.businessName,
            svDb: res.data.svDb,
            svCpu: res.data.svCpu,
            svMemery: res.data.svMemery,
            svDisk: res.data.svDisk,
            svUrl: res.data.svUrl,
            company: res.data.company,
            svOnline: shangXia,
            svUpdateTime: sUdaTime,
            startTime: res.data.startTime,
            endTime: res.data.endTime,
            fileUploadData: res.data.fileUploads
          });


          /*方法*/
          _this.fangFa(res);
          /*图片上传*/
          _this.tuPian(res);
          //文件上传信息
          _this.file(res)
        } else {
          _this.setState({
            visible: false
          });
          Modal.error({
            title: '系统错误'
          });
        }
      },
      error: function (res) {
        _this.setState({
          visible: false
        });
        Modal.error({
          title: '服务连接失败',
        });
      }
    });
    return false
  },

  /*点击详情里面加载方法信息函数*/
  fangFa: function (res) {
    /*  清除上一次加载的信息*/
    $("#fangFa").empty('');
    var metnods = res.data.methods;
    if (metnods.length != 0) {
      var resData = "";
      var html = '<div class="info-title"> <h4>方法信息</h4></div>'
      for (var i = 0; metnods.length > i; i++) {
        resData = metnods[i];
        let MethodUpdateTime = this.timeFormat(resData.mdUpdateTime);
        html += '<div class="info-title"> <h4>方法' + (i + 1) + '：</h4></div>' +
          '<div class="info-content">' +
          '<ul>' +
          '<li><label>方&nbsp;&nbsp;法&nbsp;&nbsp;名:&nbsp;</label><span>' + resData.methodName + '</span></li>' +
          '<li><label>方法描述:&nbsp;</label><span>' + resData.methodDescr + '</span></li>' +
          '<li><label>方法地址:&nbsp;</label><span>' + resData.methodUrl + '</span></li>' +
          '<li><label>参&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数:&nbsp;</label><span>' + resData.params[0].paramName + '</span></li>' +
          '<li><label>参数描述:&nbsp;</label><span>' + resData.params[0].paramDescr + '</span></li>' +
          '<li><label>返&nbsp&nbsp回&nbsp&nbsp值:&nbsp;</label><span>' + resData.result + '</span></li>' +
          '<li><label>示&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;例:&nbsp;</label><span>' + resData.example + '</span></li>' +
          '<li><label>更新时间:&nbsp;</label><span>' + MethodUpdateTime + '</span></li>' +
          '</ul>' +
          '</div>'
      }
      $("#fangFa").append(html);
    }
    return false;
  },
  /*点击详情里面加载图片信息函数*/
  tuPian: function (res, changePick) {
    /*  清楚上一次加载的信息*/
    $("#tuPian").empty('');
    let _this = this
    var imgUploads = res.data.imgUploads;
    if (imgUploads.length) {
      var imgUp = "";
      var html = '<div class="info-title"> <h4>图片信息</h4></div>';
      for (var i = 0; imgUploads.length > i; i++) {
        imgUp = res.data.imgUploads[i];
        if (!changePick) {
          html += '<div class="img-custom" width ="200px" padding="0"  > ' +
            '<div className="custom-image"> ' +
            '<img alt="图片加载失败" width="200px" src="' + imgUp.imgUrl + '" /> ' +
            '</div> ' +
            '</div>'
        }
      }
      if (!changePick) {
        $("#tuPian").append(html);
      } else {
        $("#pick").append(html);
      }
    }
    return false;
  },
  //点击详情里面加载文件信息
  file: function (res) {
    /*  清除上一次加载的信息*/
    $("#file").empty('');
    var fileUpload = res.data.fileUploads;
    if (fileUpload.length != 0) {
      var html = '<div class="info-title"> <h4>上传文件信息</h4></div>'
      $("#file").append(html);
    }
    return false;
  },
  /*点击修改*/
  modifyClick: function (ev) {
    ev = ev || window.event;
    let _this = this;
    let id = {
      serviceId: ev.target.id
    };
    this.setState({
      xgID: ev.target.id,
      fileUploadsList: [],
      loading: true
    });
    ajax({
      url: 'getServiceInfo.do',
      type: 'post',
      data: id,
      success: function (res) {
        _this.setState({
          xiuGai: true,
          loading: false
        });
        if (res.ret == 'SUCCESS') {
          let xsSvUdaTime = _this.timeFormat(res.data.svUpdateTime);
          _this.props.form.setFieldsValue({
            xgSerName: res.data.serviceName,
            xgGongN: res.data.svDescr,
            xgManagerName: res.data.managerName,
            xsManagerPhone: res.data.managerPhone,
            xscompany: res.data.company,
            xgSystemVersion: res.data.systemVersion,
            select: res.data.business.businessId,
            xgSvIp: res.data.svIp,
            xsSvVersion: res.data.svVersion,
            xsSvCpu: res.data.svCpu,
            xsSvMemery: res.data.svMemery,
            xsSvDisk: res.data.svDisk,
            xsSvUrl: res.data.svUrl,
            xsSvDb: res.data.svDb,
            xsSvOnline: String(res.data.svOnline),
            xsSvUdaTime: xsSvUdaTime
          });
          //图片文件处理
          let imgArr = [];
          for (var i = 0; i < res.data.imgUploads.length; i++) {
            let imgObj = {
              uid: -i,
              fileId: res.data.imgUploads[i].imgId,
              status: 'done',
              url: res.data.imgUploads[i].imgUrl,
              thumbUrl: res.data.imgUploads[i].imgUrl
            };
            imgArr.push(imgObj)
          }

          //文件处理
          let fileArr = [];
          for (var j = 0; j < res.data.fileUploads.length; j++) {
            let fileObj = {
              uid: -j,
              name: res.data.fileUploads[j].fileName,
              fileId: res.data.fileUploads[j].fileId,
              status: 'done',
              url: res.data.fileUploads[j].fileUrl,
              thumbUrl: res.data.fileUploads[j].fileUrl
            };
            fileArr.push(fileObj)
          }
          _this.setState({
            fileUploadsList: fileArr,
            imgUploads: imgArr
          });

          /*图片上传*/
          //_this.tuPian(res, 'pick')
        } else {
          _this.setState({
            xiuGai: false
          });
          Modal.error({
            title: '系统错误'
          });
        }
      },
      error: function (res) {
        _this.setState({
          xiuGai: false,
        });
        Modal.error({
          title: '服务连接失败',
        });
      }
    })
  },
  /*详情弹窗里面 点击确定回调 */
  handleOk() {
    let _this = this;
    this.setState({
      visible: false,
    });
    setTimeout(function () {
      _this.setState({
        fileUploadData: []
      })
    }, 40);
  },
  /*弹窗里面 点击修改里面确定 */
  handQure: function () {
    let _this = this;
    let imgUploadArr = [];
    let fileUploadArr = [];
    this.props.form.validateFieldsAndScroll((errors, values) => {

      if (!errors) {
        for (let i = 0; i < this.state.imgUploads.length; i++) {
          if (this.state.imgUploads[i].status != 'done') {
            Modal.error({
              title: '请等待图片上传完成'
            });
            return
          }
        }
        for (let i = 0; i < this.state.fileUploadsList.length; i++) {
          if (this.state.fileUploadsList[i].status != 'done') {
            Modal.error({
              title: '请等待文件上传完成'
            });
            return
          }
        }
        this.setState({
          changeConfirmLoading: true
        });
        for (var i = 0; i < this.state.imgUploads.length; i++) {
          let imgUploadObj = {};
          if (this.state.imgUploads[i].url) {
          } else {

            imgUploadObj.imgId = this.state.imgUploads[i].response.data.fileId;
            imgUploadObj.imgName = this.state.imgUploads[i].response.data.fileName;
            imgUploadObj.imgUrl = this.state.imgUploads[i].response.data.url;
            let imgUploadTime = this.timeFormat(this.state.imgUploads[i].response.data.uploadTime);
            imgUploadObj.uploadTime = imgUploadTime;
            imgUploadArr.push(imgUploadObj)

          }
        }
        for (var i = 0; i < this.state.fileUploadsList.length; i++) {
          let fileUploadObj = {};
          if (this.state.fileUploadsList[i].url) {
            //console.log('url',this.state.fileUploadsList[i].url)
          } else {

            fileUploadObj.fileId = this.state.fileUploadsList[i].response.data.fileId;
            fileUploadObj.fileName = this.state.fileUploadsList[i].response.data.fileName;
            fileUploadObj.fileUrl = this.state.fileUploadsList[i].response.data.url;
            let fileUploadTime = this.timeFormat(this.state.fileUploadsList[i].response.data.uploadTime);
            fileUploadObj.uploadTime = fileUploadTime;
            fileUploadArr.push(fileUploadObj)

          }
        }
        let xgdata = {
          serviceId: this.state.xgID,
          serviceName: values.xgSerName,
          svDescr: values.xgGongN,
          managerName: values.xgManagerName,
          managerPhone: values.xsManagerPhone,
          company: values.xscompany,
          systemVersion: values.xgSystemVersion,
          business: { businessId: values.select },
          svIp: values.xgSvIp,
          svVersion: values.xsSvVersion,
          svCpu: values.xsSvCpu,
          svMemery: values.xsSvMemery,
          svDisk: values.xsSvDisk,
          svUrl: values.xsSvUrl,
          svDb: values.xsSvDb,
          svOnline: values.xsSvOnline,
          imgUploads: imgUploadArr,
          fileUploads: fileUploadArr
        };
        // console.log(xgdata)
        ajax({
          url: 'updateService.do',
          type: 'post',
          data: xgdata,
          success: function (res) {
            if (res.ret == 'SUCCESS') {
              const removeUrls = _this.state.removeUploads;
              const removefileUrls = _this.state.removeUploadsList;
              let flag1 = false
              //删除图片操作
              if (removeUrls.length != 0) {
                ajax({
                  url: 'deleteImgUpload.do',
                  type: 'post',
                  data: removeUrls,
                  success: function (res) {
                    if (res.ret == 'SUCCESS') {
                      flag1 = true
                      _this.setState({
                        removeUploads: []
                      })
                    }
                  }
                })
              } else {
                flag1 = true
              }

              //删除文件操作
              let flag2 = false
              if (removefileUrls.length != 0) {
                ajax({
                  url: 'deleteUpload.do',
                  type: 'post',
                  data: removefileUrls,
                  success: function (res) {
                    if (res.ret == 'SUCCESS') {
                      flag2 = true
                      _this.setState({
                        removeUploadsList: []
                      })
                    }
                  }
                })
              } else {
                flag2 = true
              }

              setTimeout(function () {
                _this.setState({
                  changeConfirmLoading: false,
                })
                if (flag1 == true && flag2 == true) {
                  Modal.success({
                    title: '服务文件修改成功'
                  });
                  _this.setState({
                    xiuGai: false,
                    removeUploads: [],
                    imgUploads: [],
                    imgUploadArr: [],
                    fileUploadsList: [],
                    fileUploadArr: [],
                    removeUploadsList: []
                  });
                  _this.handlePageChange(_this.state.pagination.current)
                } else {
                  Modal.error({
                    title: '上传文件修改失败,原因是图片或文件修改失败'
                  });
                  _this.setState({
                    xiuGai: false,
                    removeUploads: [],
                    imgUploads: [],
                    imgUploadArr: [],
                    fileUploadsList: [],
                    fileUploadArr: [],
                    removeUploadsList: []
                  });
                }
              }, 2000);
            } else {
              Modal.error({
                title: '系统错误'
              });
            }
          },
          error: function (res) {
            _this.setState({
              changeConfirmLoading: false,
            })
            Modal.error({
              title: '服务连接失败'
            });
          }
        })
      }
    })
  },

  /*新增资料信息*/
  handleAdd: function () {
    this.setState({
      addTo: true
    });
  },

  //弹出删除服务信息对话框
  deleteServiceClick: function (ev) {
    ev = ev || window.event;
    this.setState({
      delServer: true,
      serviceId: ev.target.id
    });
  },
  //删除服务器的数据
  deleteService: function () {
    let _this = this
    let serviceId = this.state.serviceId;
    this.setState({
      loading: true,
    });
    ajax({
      url: 'deleteService.do',
      type: 'post',
      data: [serviceId],
      success: function (res) {
        // console.log(res)
        _this.setState({
          loading: false,
        });
        if (res.ret == 'SUCCESS') {
          Modal.success({
            title: '删除成功！'
          });
          _this.handleSearch()
        } else {
          Modal.error({
            title: '系统错误',
          });
        }
      },
      error: function (res) {
        Modal.error({
          title: '服务器错误'
        })
      }
    });
    this.setState({
      delServer: false
    })
  },

  //上下线切换
  changeOnlineClick: function (text, serviceId, event) {
    let _this = this;
    let changetext = text == 0 ? 1 : 0;
    let changeData = {
      serviceId: serviceId,
      svOnline: changetext
    };
    ajax({
      url: 'changeOnline.do',
      type: 'post',
      data: changeData,
      success: function (res) {
        if (res.ret == 'SUCCESS') {
          _this.handleSearch();
          Modal.success({
            title: '上下线切换成功'
          });
        }
      },
      error: function (res) {
        Modal.error({
          title: '上下线切换失败'
        });
      }
    })
  },

  /*弹窗里面 点击遮罩层或右上角叉或取消按钮的回调 */
  handleCancel(e) {
    let _this = this
    this.setState({
      visible: false,
      xiuGai: false,
      addTo: false,
      delServer: false,
      imgUploads: [],
      changeConfirmLoading: false
    });
    setTimeout(function () {
      _this.setState({
        fileUploadData: []
      })
    }, 40);
  },
  addChangeTo(newaddto) {
    this.setState({
      addTo: newaddto
    });
    this.handleSearch()
  },
  //图片上传
  imgUploadsChange(info) {
    this.setState({
      imgUploads: info.fileList
    });
    // let imgUploadArr = [];
    // for (var i = 0; i < info.fileList.length; i++) {
    //   let imgUploadObj = {};
    //   if (info.fileList[i].url) {
    //   } else {
    //     if (info.file.status === 'done') {
    //       imgUploadObj.imgId = info.fileList[i].response.data.fileId;
    //       imgUploadObj.imgName = info.fileList[i].response.data.fileName;
    //       imgUploadObj.imgUrl = info.fileList[i].response.data.url;
    //       let imgUploadTime = this.timeFormat(info.fileList[i].response.data.uploadTime);
    //       imgUploadObj.uploadTime = imgUploadTime;
    //       imgUploadArr.push(imgUploadObj)
    //     }
    //   }
    // }
    // this.setState({
    //   imgUploadArr: imgUploadArr
    // })
  },
  //文件移除触发事件，保存移除的url,点击确定或取消时去清除指定的文件
  removeUpload(info) {
    //保存移除文件的url
    let url = info.url || info.response.data.url;

    let imgUploadArr = this.state.imgUploads;
    let obj = { imgUrl: url };
    //清除预览文件中删除的部分
    for (var i = 0; i < imgUploadArr.length; i++) {
      if (imgUploadArr[i].url == url) {
        imgUploadArr.splice(i, 1);

      } else {
        if (imgUploadArr[i].status == 'removed' && imgUploadArr[i].response.data.url == url) {
          imgUploadArr.splice(i, 1);

        }
      }
    }
    //需要清除的数组
    let removeArr = this.state.removeUploads.concat([obj]);
    this.setState({
      removeUploads: removeArr,
      imgUploads: imgUploadArr
    });
  },
  //文件上传
  fileHandleChange(info) {
    this.setState({
      fileUploadsList: info.fileList
    });
    // let fileUploadArr = [];
    // for (var i = 0; i < info.fileList.length; i++) {
    //   let fileUploadObj = {};
    //   if (info.fileList[i].url) {
    //     //console.log('url', info.fileList[i].url)
    //   } else {
    //     if (info.file.status === 'done') {
    //       fileUploadObj.fileId = info.fileList[i].response.data.fileId;
    //       fileUploadObj.fileName = info.fileList[i].response.data.fileName;
    //       fileUploadObj.fileUrl = info.fileList[i].response.data.url;
    //       let fileUploadTime = this.timeFormat(info.fileList[i].response.data.uploadTime);
    //       fileUploadObj.uploadTime = fileUploadTime;
    //       fileUploadArr.push(fileUploadObj)
    //     }
    //   }
    // }

    // this.setState({
    //   fileUploadArr: fileUploadArr
    // })
  },
  //文件删除操作触发事件
  removeFileUpload(info) {
    //保存移除文件的url
    let url = info.url || info.response.data.url;

    let fileUploadArr = this.state.fileUploadsList;
    let obj = { fileUrl: url };
    //清除预览文件中删除的部分
    for (var i = 0; i < fileUploadArr.length; i++) {
      if (fileUploadArr[i].url == url) {
        fileUploadArr.splice(i, 1);

      } else {
        if (fileUploadArr[i].status == 'removed' && fileUploadArr[i].response.data.url == url) {
          fileUploadArr.splice(i, 1);

        }
      }
    }
    //需要清除的数组
    let removefileArr = this.state.removeUploadsList.concat([obj]);
    this.setState({
      removeUploadsList: removefileArr,
      fileUploadsList: fileUploadArr
    });
  },
  //选中项发生变化的时的回调
  onSelectChange(selectedRowKeys, selectedRows) {
    // console.log(selectedRowKeys);
    this.setState({
      selectedRowKeys: selectedRowKeys
    });
  },
  // 批量删除对话框显示
  deleteAll() {
    this.setState({
      deleteSearchAllVisible: true
    })
  },
  // 确定批量删除
  deleteSearchAllOk(){
    let _this = this;
    this.setState({
      deleteSearchAllLoading: true
    });
    let data = this.state.selectedRowKeys;
    ajax({
      url: 'deleteService.do',
      type: 'post',
      data: data,
      success(res) {
        _this.setState({
          deleteSearchAllLoading: false
        });
        if (res.ret == 'SUCCESS') {
          _this.setState({
            deleteSearchAllVisible: false
          });
          if (_this.state.pagination.total % _this.state.pagination.pageSize === _this.state.selectedRowKeys.length && _this.state.pagination.current === Math.ceil(_this.state.pagination.total / _this.state.pagination.pageSize) && _this.state.pagination.current !== 1) {
            _this.handlePageChange(_this.state.pagination.current - 1)
          } else {
            _this.handlePageChange(_this.state.pagination.current);
          }
          _this.setState({
            selectedRowKeys: []
          })
          Modal.success({
            title: res.data
          });
        } else {
          Modal.error({
            title: res.data
          });
        }
      },
      error() {
        _this.setState({
          deleteSearchAllLoading: false
        });
        Modal.error({
          title: '服务器连接失败'
        });
      }
    })
  },
  // 取消批量删除
  deleteSearchAllCancel() {
    this.setState({
      deleteSearchAllVisible: false,
      deleteSearchAllLoading: false
    })
  },
  /*return 如页面*/
  render() {
    // 批量删除操作
    const { selectedRowKeys } = this.state;
    //table选项功能配置
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;

    let _this = this
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    const xgSerName = getFieldProps('xgSerName', {
      rules: [
        { required: true, pattern: /^(?=[0-9a-zA-Z\u4e00-\u9fa5]+$)/, message: '请输入正确的服务名称' },
      ]
    });
    const xgGongN = getFieldProps('xgGongN', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ]
    });
    const xgManagerName = getFieldProps('xgManagerName', {
      rules: [
        { required: true, pattern: /^([a-zA-Z\u4e00-\u9fa5]){2,50}$/, message: '请输入正确的姓名（最少为两个字符）' },
      ]
    });
    const xsManagerPhone = getFieldProps('xsManagerPhone', {
      rules: [
        { required: true, pattern: /^(13[0-9]|15[0-9]|17[0-3]|17[5-8]|18[0-9])[0-9]{8}$/, message: '请输入正确的手机号码' },
      ]
    });
    const xscompany = getFieldProps('xscompany', {
      rules: [
        { required: true,pattern: /^(?=[0-9a-zA-Z\u4e00-\u9fa5]+$)/, message: '请输入正确的所属单位名（不能使用特殊字符）' },
      ]
    });
    const xgSystemVersion = getFieldProps('xgSystemVersion', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' },
      ]
    });
    const xgSvIp = getFieldProps('xgSvIp', {
      rules: [
        { required: true, pattern: /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-5][0-5])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/,
        message: '请输入正确的IP地址' },
      ]
    });
    const xsSvVersion = getFieldProps('xsSvVersion', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const xsSvFunction = getFieldProps('select', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const xsSvCpu = getFieldProps('xsSvCpu', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const xsSvMemery = getFieldProps('xsSvMemery', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const xsSvDisk = getFieldProps('xsSvDisk', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const xsSvUrl = getFieldProps('xsSvUrl', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const xsSvDb = getFieldProps('xsSvDb', {
      rules: [
        { required: true, min: 0, message: '输入框不能为空' }
      ]
    });
    const xsSvOnline = getFieldProps('xsSvOnline', {
      rules: [
        { required: true, message: '请选择用户类型' }
      ]
    });
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 }
    };
    //上传图片
    const props = {
      action: fileLoads + 'fileUpload.do',
      listType: 'picture-card',
      accept: '.jpg,.jpeg,.png,gif,',
      fileList: this.state.imgUploads,
      //defaultFileList: this.state.imgUploads,
      onChange: this.imgUploadsChange,
      onRemove: this.removeUpload,
      multiple: true,
      //上传文件之前的钩子，进行判断是不是我所需要的格式
      beforeUpload(file) {
        const isjpg = file.type == 'image/jpg';
        const isjpeg = file.type == 'image/jpeg';
        const ispng = file.type == 'image/png';
        const isgif = file.type == 'image/gif';
        if (!isjpg && !isjpeg && !ispng && !isgif) {
          message.error('只能上传图片哦！');
          return false;
        }
      },
      data(file) {
        return { filePath: '/arm/img' }
      }
    };
    //上传文件
    const fileUpload = {
      action: fileLoads + 'fileUpload.do',
      fileList: this.state.fileUploadsList,
      onChange: this.fileHandleChange,
      onRemove: this.removeFileUpload,
      multiple: true,
      data(file) {
        return { filePath: '/arm/file' }
      }
    };
    return (
      <div>
        <div className="logTitle">
          <h2>服务资料列表</h2>
        </div>
        {/*搜索限定条件*/}
        <Row className="logSearch">
          <Col>
            <Button type="primary" onClick={this.deleteAll} disabled={!hasSelected} style={{ marginRight: 20 }}>删除</Button>
            <label>服务名称</label>
            <Input type="text" ref="name" style={{ width: 80, marginRight: 10 }} />
            <label>负责人名字</label>
            <Input type="text" ref="managerName" style={{ width: 80, marginRight: 10 }} />
            <label>上下线</label>
            <Select onChange={this.onlineChange} defaultValue="111" style={{ width: 80, marginRight: 10 }}>
              <Option value='111' key='12'>全部</Option>
              <Option value='1' key='1'>上线</Option>
              <Option value='0' key='0'>下线</Option>
            </Select>
            <label>业务</label>
            <Select onChange={this.onBusinessChange} defaultValue="changebus" style={{ width: 100, marginRight: 10 }}>
              <Option value='changebus' key='12'>全部</Option>
              {this.state.businessAllData.map(function (item, index) {
                return <Option value={item.businessId} key={index}>{item.businessName}</Option>
              })}
            </Select>
            <label>时间段</label>
            <div id="trendDay">
              <DatePicker value={this.state.dayStartString} onChange={this.startTimeChange}
                disabledDate={this.startTimeStart} placeholder="开始日期" style={{ width: 100 }} />
              <span>-</span>
              <DatePicker value={this.state.dayEndString} onChange={this.endTimeChange} disabledDate={this.startTimeEnd}
                placeholder="结束日期" style={{ width: 100 }} />
            </div>
            <Button type="primary" style={{ marginLeft: 20 }} onClick={this.handleSearch}><Icon type="search" /></Button>
            <Button type="primary" onClick={this.handleAdd} style={{ float: 'right' }}>新增资料</Button>
          </Col>
        </Row>
        {/*表格详情*/}
        <Table className="logSearchTable"
          rowKey={function (item) { return item.serviceId }}
          rowSelection={rowSelection}
          columns={this.state.columns}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          size="middle" bordered />
        {/*资源详细信息*/}
        <Modal title="资源详细信息" visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}>
          <ul className="detailsFl">
            <li><label>服务名称:</label><span>{this.state.serName}</span></li>
            <li><label>服务描述:</label><span>{this.state.svDescr}</span></li>
            <li><label>负责人名字:</label><span>{this.state.manNam}</span></li>
            <li><label>负责人电话:</label><span>{this.state.manPhone}</span></li>
            <li><label>系统版本:</label><span>{this.state.sysVersion}</span></li>
            <li><label>服务器ip:</label><span>{this.state.svIp}</span></li>
            <li><label>服务版本号:</label><span>{this.state.svVer}</span></li>
            <li><label>业&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务:</label><span>{this.state.svFun}</span></li>
            <li><label>数据库详细参数:</label><span>{this.state.svDb}</span></li>
            <li><label>cpu性能要求:</label><span>{this.state.svCpu}</span></li>
            <li><label>内存需求:</label><span>{this.state.svMemery}</span></li>
            <li><label>硬盘需求:</label><span>{this.state.svDisk}</span></li>
            <li><label>应用地址:</label><span>{this.state.svUrl}</span></li>
            <li><label>公&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;司:</label><span>{this.state.company}</span></li>
            <li><label>上&nbsp;&nbsp;下&nbsp;&nbsp;线:</label><span>{this.state.svOnline}</span></li>
            <li><label>更新时间:</label><span>{this.state.svUpdateTime}</span></li>
          </ul>
          <div className="info" id="fangFa"></div>
          <div className="info" id="tuPian"></div>
          <div className="info" id="file"></div>
          {
            this.state.fileUploadData.map(function (item, index) {
              return (
                <div key={index} className="fileData">
                  <Icon className="copyFile" type="copy" />
                  <p>{item.fileName}</p>
                  <a href={item.fileUrl}>下载</a>
                </div>
              )
            })
          }
        </Modal>
        {/*修改资源详细*/}
        <Modal title="修改资源详细"
          visible={this.state.xiuGai}
          onOk={this.handQure}
          onCancel={this.handleCancel}
          confirmLoading={this.state.changeConfirmLoading}>
          <Form horizontal>
            <FormItem {...formItemLayout} label="服务名称" hasFeedback>
              <Input {...xgSerName} disabled placeholder="请输入服务名称" />
            </FormItem>
            <FormItem {...formItemLayout} label="所属公司">
              <Input {...xscompany} placeholder="请输入所属公司" />
            </FormItem>
            <FormItem {...formItemLayout} label="服务描述">
              <Input {...xgGongN} placeholder="请输入服务描述" />
            </FormItem>
            <FormItem {...formItemLayout} label="负责人名字">
              <Input {...xgManagerName} placeholder="请输入负责人名字" />
            </FormItem>
            <FormItem {...formItemLayout} label="负责人电话">
              <Input {...xsManagerPhone} placeholder="请输入负责人电话" />
            </FormItem>
            
            <FormItem {...formItemLayout} label="系统版本">
              <Input {...xgSystemVersion} placeholder="请输入系统版本" />
            </FormItem>
            <FormItem {...formItemLayout} label="服务器ip">
              <Input {...xgSvIp} placeholder="请输入服务器ip" />
            </FormItem>
            <FormItem {...formItemLayout} label="应用版本号">
              <Input {...xsSvVersion} placeholder="请输入应用版本号" />
            </FormItem>
            <FormItem {...formItemLayout} label="业&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务">
              <Select {...xsSvFunction } placeholder="请选择业务" id="searcSelect">
                {this.state.businessAllData.map(function (item, index) {
                  return <Option value={item.businessId} key={index}>{item.businessName}</Option>
                })}
              </Select>
            </FormItem>
            <FormItem {...formItemLayout} label="CPU性能要求">
              <Input {...xsSvCpu} placeholder="请输入CPU性能要求" />
            </FormItem>
            <FormItem {...formItemLayout} label="内存要求">
              <Input {...xsSvMemery} placeholder="请输入内存要求" />
            </FormItem>
            <FormItem {...formItemLayout} label="硬盘要求">
              <Input {...xsSvDisk} placeholder="请输入硬盘要求" />
            </FormItem>
            <FormItem {...formItemLayout} label="应用地址">
              <Input {...xsSvUrl} placeholder="请输入应用地址" />
            </FormItem>
            <FormItem {...formItemLayout} label="数据库参数">
              <Input {...xsSvDb} placeholder="请输入数据库参数" />
            </FormItem>
            <FormItem {...formItemLayout} label="上下线">
              <RadioGroup {...xsSvOnline}>
                <Radio value="1">上线</Radio>
                <Radio value="0">下线</Radio>
              </RadioGroup>
              <span><Icon type="info-circle-o" /> 暂不支持其它选择</span>
            </FormItem>
          </Form>
          {/*图片修改*/}
          <div className="info">
            <div className="info-title">
              <h4>图片上传信息</h4>
            </div>
            <div className="info-content">
              <div className="clearfix">
                <Upload {...props} >
                  <Icon type="plus" />
                  <div className="ant-upload-text">上传照片</div>
                </Upload>
              </div>
            </div>
          </div>
          {/*文件上传*/}
          <div className="info">
            <div className="info-title">
              <h4>文件上传信息</h4>
            </div>
            <div className="info-content">
              <div className="clearfix">
                <Upload {...fileUpload}>
                  <Button type="ghost">
                    <Icon type="upload" /> 点击上传
                  </Button>
                </Upload>
              </div>
            </div>
          </div>
        </Modal>
        {/* 添加信息 */}
        <Modal title="添加资源" visible={this.state.addTo} footer={null} style={{ top: 20 }} onCancel={this.handleCancel}>
          <NewlyAdded addModal={this.state.addTo} callbackParent={this.addChangeTo} businessAll={this.state.businessAllData} ref="dataAdd" />
        </Modal>
        {/* 删除服务 */}
        <Modal title="提示信息" visible={this.state.delServer}
          onOk={this.deleteService} onCancel={this.handleCancel}
        >
          <p>你真的要把这条信息删除吗？</p>
        </Modal>
        {/*批量删除操作*/}
        <Modal title="批量删除提示："
          visible={this.state.deleteSearchAllVisible}
          onOk={this.deleteSearchAllOk}
          onCancel={this.deleteSearchAllCancel}
          confirmLoading={this.state.deleteSearchAllLoading}>
          <h4>确定要删除已选择项吗？</h4>
        </Modal>
      </div>
    )
  }

});
Search = createForm()(Search);
export default Search;
