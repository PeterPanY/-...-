import React from 'react';
import { browserHistory } from 'react-router';
import $ from 'jquery';
import ajax from '../../../common/ajax';
import { Row, Col, Button, Table, Input, Icon, Select, Modal, Form, Radio, DatePicker, Upload } from 'antd';
import DataAdd from './DataAdd';
import '../../../common/Data.css';
import { fileLoads } from '../../../common/fileUploads';

const createForm = Form.create;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

let Data = React.createClass({
  getInitialState() {
    let _this = this;
    return {
      columns: [
        { title: "应用名称", width: "9%", dataIndex: "name" },
        { title: "所属单位", width: "9%", dataIndex: "companyName" },
        { title: "负责人姓名", width: "9%", dataIndex: "managerName" },
        { title: "负责人手机", width: "9%", dataIndex: "managerPhone" },
        { title: "应用地址", width: "9%", dataIndex: "fnUrl" },
        { title: "服务器IP", width: "9%", dataIndex: "fnIp" },
        { title: "应用版本", width: "9%", dataIndex: "fnVersion" },
        {
          title: "上下线", width: "13%", dataIndex: "fnOnline", render: function (text, record, index) {
            if (text == 1) {
              return (
                <span>上线 <a href="javascript:;" style={{ marginLeft: '20%' }}
                  onClick={_this.changeOnlineClick.bind(null, text, record.applicationId)}>切换状态</a></span>
              )
            } else if (text == 0) {
              return (
                <span>下线 <a href="javascript:;" style={{ marginLeft: '20%' }}
                  onClick={_this.changeOnlineClick.bind(null, text, record.applicationId)}>切换状态</a></span>
              )
            }
          }
        },
        { title: "更新时间", width: "9%", dataIndex: "Updated" },
        {
          title: "操作", width: "15%", dataindex: "operation", render: function (text, record, index) {
            return (
              <div className="operationbtn">
                <a href="javascript:" onClick={_this.dataInfoClick.bind(null, record.applicationId, 'infoData')}>详情</a>
                <span className="ant-divider"></span>
                <a href="javascript:" onClick={_this.dataInfoClick.bind(null, record.applicationId, 'changeData')}>修改</a>
                <span className="ant-divider"></span>
                <a href="javascript:" id={record.applicationId} onClick={_this.handleDelete}>删除</a>
              </div>
            )
          }
        }
      ],
      data: [],
      pagination: {},
      loading: false,
      dayStart: null,
      dayStartString: '',
      dayEnd: null,
      dayEndString: '',
      searchName: '',
      searchManagerName: '',
      searchDayStart: '',
      searchDayEnd: '',
      addVisible: false,
      deleteVisible: false,
      deleteLoading: false,
      deleteId: '',
      deleteAllVisible: false,
      deleteAllLoading: false,
      selectedRowKeys: [],
      infoVisible: false,
      infoLoading: false,
      infoId: '',
      fileUploadData: [],
      changeDataVisible: false,
      changeDataLoading: false,
      imgUploadsList: [],
      fileUploadsList: [],
      removeUploadsList: [],
      removeImgUploadsList: []
    }
  },
  //时间格式化
  timeFormat: function (da) {
    da = new Date(da);
    let year = da.getFullYear();
    let month = da.getMonth() + 1;
    let date = da.getDate();
    return ([year, month, date].join('-'));
  },
  //页面加载直接运行获取数据
  componentDidMount() {
    let _this = this;
    this.setState({
      loading: true,
    });
    let data = {
      curPage: 1
    };
    ajax({
      url: 'getDataList.do',
      type: 'post',
      data: data,
      success(res) {
        console.log(res)
        _this.setState({
          loading: false
        });
        if (res.ret == 'SUCCESS') {
          let dataList = res.data.data || [];
          for (var i = 0; i < dataList.length; i++) {
            dataList[i].Updated = _this.timeFormat(dataList[i].datefnUpdateTime)
          }
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
            pagination: pagination,
            selectedRowKeys: []
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
          title: '服务器连接失败',
        });
      }
    })
  },
  //搜索时间段的开始时间点击函数
  dayStartChange(date, dateString) {
    this.setState({
      dayStart: date,
      dayStartString: dateString
    })
  },
  //搜索时间段的结束时间点击函数
  dayEndChange(date, dateString) {
    this.setState({
      dayEnd: date,
      dayEndString: dateString
    })
  },
  //搜索时间段的开始时间函数
  disabledDayStart(disabledDayStart) {
    if (!disabledDayStart || !this.state.dayEnd) {
      return false;
    }
    return disabledDayStart.getTime() + 3600000 >= this.state.dayEnd.getTime();
  },
  //搜索时间段的结束时间函数
  disabledDayEnd(disabledDayEnd) {
    if (!disabledDayEnd || !this.state.dayStart) {
      return false;
    }
    return disabledDayEnd.getTime() - 3600000 <= this.state.dayStart.getTime();
  },
  //搜索类型
  onlineChange(value) {
    console.log(value)
    let key;
    if (value == '111') {
      key = undefined
    } else {
      key = value
    }
    this.setState({
      onlineValue: key,
    });
  },
  //点击搜索查询
  handleSearch() {
    let _this = this;
    this.setState({
      loading: true,
      searchName: this.refs.dataName.refs.input.value,
      searchManagerName: this.refs.dataManagerName.refs.input.value,
      searchOnline: this.state.onlineValue,
      searchDayStart: this.state.dayStartString,
      searchDayEnd: this.state.dayEndString
    });
    let data = {
      curPage: 1,
      obj: {
        name: this.refs.dataName.refs.input.value,
        managerName: this.refs.dataManagerName.refs.input.value,
        fnOnline: this.state.onlineValue,
        startTime: this.state.dayStartString,
        endTime: this.state.dayEndString
      }
    };
    console.log(data)
    ajax({
      url: 'getDataList.do',
      type: 'post',
      data: data,
      success(res) {
        _this.setState({
          loading: false
        });
        if (res.ret == 'SUCCESS') {
          let dataList = res.data.data || [];
          for (var i = 0; i < dataList.length; i++) {
            dataList[i].Updated = _this.timeFormat(dataList[i].datefnUpdateTime)
          }
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
            pagination: pagination,
            selectedRowKeys: []
          });
        } else {
          Modal.error({
            title: '系统错误',
          });
        }
      },
      error() {
        _this.setState({
          loading: false
        });
        Modal.error({
          title: '服务器连接失败',
        });
      }
    })
  },
  //分页操作
  handlePageChange(current) {
    let _this = this;
    this.setState({
      loading: true
    });
    let data = {
      curPage: current,
      obj: {
        name: this.state.searchName,
        managerName: this.state.searchManagerName,
        fnOnline: this.state.searchOnline,
        startTime: this.state.searchDayStart,
        endTime: this.state.searchDayEnd
      }
    };
    ajax({
      url: 'getDataList.do',
      type: 'post',
      data: data,
      success(res) {
        _this.setState({
          loading: false
        });
        if (res.ret == 'SUCCESS') {
          let dataList = res.data.data || [];
          for (var i = 0; i < dataList.length; i++) {
            dataList[i].Updated = _this.timeFormat(dataList[i].datefnUpdateTime)
          }
          let pagination = {
            total: res.data.rowCount,
            showTotal: function () {
              return ('共' + res.data.rowCount + '条')
            },
            pageSize: res.data.pageSize,
            current: current,
            onChange(current) {
              _this.handlePageChange(current)
            }
          };
          _this.setState({
            data: res.data.data,
            pagination: pagination,
            selectedRowKeys: []
          });
        } else {
          Modal.error({
            title: '系统错误'
          });
        }
      },
      error() {
        _this.setState({
          loading: false
        });
        Modal.error({
          title: '服务器连接失败'
        });
      }
    })
  },
  //切换上下线的状态
  changeOnlineClick(text, id) {
    //console.log(id);
    let _this = this;
    let changetext = text == 0 ? 1 : 0;
    let changeData = {
      applicationId: id,
      fnOnline: changetext
    };
    this.setState({
      loading: true
    });
    ajax({
      url: 'changeOnline.do',
      type: 'post',
      data: changeData,
      success: function (res) {
        _this.setState({
          loading: false
        });
        if (res.ret == 'SUCCESS') {
          _this.handleSearch();
          Modal.success({
            title: '状态切换成功'
          });
        } else {
          Modal.error({
            title: '服务器故障，状态切换失败'
          });
        }
      },
      error: function (res) {
        _this.setState({
          loading: false
        });
        Modal.error({
          title: '服务器错误'
        });
      }
    })
  },
  //添加操作对话框显示
  handleAdd() {
    this.setState({
      addVisible: true
    })
  },
  //添加操作确定
  addOk() {
    this.setState({
      addVisible: false
    });
    this.refs.dataAdd.resetFields();
    this.handlePageChange(this.state.pagination.current);
  },
  //取消添加操作对话框
  addCancel() {
    this.setState({
      addVisible: false
    });
    this.refs.dataAdd.resetFields();
  },
  //详情信息对话框显示
  dataInfoClick(id, classify) {
    let _this = this;
    this.setState({
      loading: true
    });
    ajax({
      url: 'getDataInfo.do',
      type: 'post',
      data: { applicationId: id },
      success: function (res) {
        _this.setState({
          loading: false
        });
        //console.log(res);
        if (res.ret == 'SUCCESS') {
          if (classify == 'infoData') {
            _this.setState({
              infoVisible: true
            });
            let UdTime = _this.timeFormat(res.data.datefnUpdateTime);
            let online;
            if (res.data.fnOnline == '1') {
              online = '上线'
            } else {
              online = '下线'
            }
            _this.setState({
              infoName: res.data.name,
              infoDescr: res.data.descr,
              infoManagerName: res.data.managerName,
              infoManagerPhone: res.data.managerPhone,
              infoFnSys: res.data.fnSys,
              infoFnIp: res.data.fnIp,
              infoFnVersion: res.data.fnVersion,
              infoFnCpu: res.data.fnCpu,
              infoFnMemery: res.data.fnMemery,
              infoFnDisk: res.data.fnDisk,
              infoFnUrl: res.data.fnUrl,
              infoCompanyName:res.data.companyName,
              infoFnOnline: online,
              UdTime: UdTime,
              fileUploadData: res.data.fileUploads
            });
            //图片加载
            _this.pick(res);
            //文件加载
            _this.file(res)
          } else if (classify == 'changeData') {
            _this.setState({
              changeDataVisible: true,
              changeId: res.data.applicationId,
            });
            _this.props.form.setFieldsValue({
              changeName: res.data.name,
              changeDescr: res.data.descr,
              changeManagerName: res.data.managerName,
              changeManagerPhone: res.data.managerPhone,
              changeFnSys: res.data.fnSys,
              changeFnIp: res.data.fnIp,
              changeFnVersion: res.data.fnVersion,
              changeFnCpu: res.data.fnCpu,
              changeFnMemery: res.data.fnMemery,
              changeFnDisk: res.data.fnDisk,
              changeFnUrl: res.data.fnUrl,
              changeFnOnline: res.data.fnOnline,
              changeCompanyName: res.data.companyName
            })
          }
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
            imgUploadsList: imgArr
          });
        } else {
          Modal.error({
            title: '系统错误'
          });
        }
      },
      error() {
        _this.setState({
          loading: false
        });
        Modal.error({
          title: '服务器错误'
        });
      }
    })
  },

  /*点击详情里面加载图片信息函数*/
  pick: function (res) {
    /*  清楚上一次加载的信息*/
    $("#pickData").empty('');
    let _this = this
    var imgUploads = res.data.imgUploads;
    if (imgUploads.length) {
      var imgUp = "";
      var html = '<div class="info-title"> <h4>图片信息</h4></div>';
      for (var i = 0; imgUploads.length > i; i++) {
        imgUp = imgUploads[i];
        html += '<div class="img-custom" width ="200px" padding="0"  > ' +
          '<div className="custom-image"> ' +
          '<img alt="图片加载失败" width="200px" src="' + imgUp.imgUrl + '" /> ' +
          '</div> ' +
          '</div>'
      }
      $("#pickData").append(html);
    }
    return false;
  },
  //点击详情里面加载文件信息
  file: function (res) {
    /*  清除上一次加载的信息*/
    $("#fileDataTitle").empty('');
    var fileUpload = res.data.fileUploads;
    if (fileUpload.length != 0) {
      var html = '<div class="info-title"> <h4>文件信息</h4></div>'
      $("#fileDataTitle").append(html);
    }
    return false;
  },
  //详情信息确定按钮
  infoOk() {
    this.setState({
      infoVisible: false,
      infoLoading: false
    })
  },
  //退出详情信息对话框
  infoCancel() {
    this.setState({
      infoVisible: false,
      infoLoading: false
    })
  },

  //图片上传
  imgUploadsChange(info) {
    this.setState({
      imgUploadsList: info.fileList
    });

    //console.log(imgUploadArr);
    //this.setState({
    //  imgUploadArr: imgUploadArr
    //})
  },
  //文件移除触发事件，保存移除的url,点击确定或取消时去清除指定的文件
  removeUpload(info) {
    //保存移除文件的url
    let url = info.url || info.response.data.url;

    let imgUploadArr = this.state.imgUploadsList;
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
    let removeArr = this.state.removeImgUploadsList.concat([obj]);
    //console.log(removeArr);
    this.setState({
      removeImgUploadsList: removeArr,
      imgUploadsList: imgUploadArr
    });
  },
  //文件上传
  fileHandleChange(info) {
    this.setState({
      fileUploadsList: info.fileList
    });


    //this.setState({
    //  fileUploadArr: fileUploadArr
    //})
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
    //console.log(removefileArr);
    this.setState({
      removeUploadsList: removefileArr,
      fileUploadsList: fileUploadArr
    });
  },
  //修改信息确定
  changeDataOk() {
    let _this = this;
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        for (let i = 0; i < this.state.imgUploadsList.length; i++) {
          if (this.state.imgUploadsList[i].status != 'done') {
            Modal.error({
              title: '请等待上传完成'
            });
            return
          }
        }
        for (let i = 0; i < this.state.fileUploadsList.length; i++) {
          if (this.state.fileUploadsList[i].status != 'done') {
            Modal.error({
              title: '请等待上传完成'
            });
            return
          }
        }
        this.setState({
          changeDataLoading: true
        });
        let imgUploadArr = [];
        for (var i = 0; i < this.state.imgUploadsList.length; i++) {
          let imgUploadObj = {};
          if (this.state.imgUploadsList[i].url) {
          } else {
            imgUploadObj.imgId = this.state.imgUploadsList[i].response.data.fileId;
            imgUploadObj.imgName = this.state.imgUploadsList[i].response.data.fileName;
            imgUploadObj.imgUrl = this.state.imgUploadsList[i].response.data.url;
            let imgUploadTime = this.timeFormat(this.state.imgUploadsList[i].response.data.uploadTime);
            imgUploadObj.uploadTime = imgUploadTime;
            imgUploadArr.push(imgUploadObj)

          }
        }
        let fileUploadArr = [];
        for (var i = 0; i < this.state.fileUploadsList.length; i++) {
          let fileUploadObj = {};
          if (this.state.fileUploadsList[i].url) {
            //console.log('url', info.fileList[i].url)
          } else {
            fileUploadObj.fileId = this.state.fileUploadsList[i].response.data.fileId;
            fileUploadObj.fileName = this.state.fileUploadsList[i].response.data.fileName;
            fileUploadObj.fileUrl = this.state.fileUploadsList[i].response.data.url;
            let fileUploadTime = this.timeFormat(this.state.fileUploadsList[i].response.data.uploadTime);
            fileUploadObj.uploadTime = fileUploadTime;
            fileUploadArr.push(fileUploadObj)

          }
        }
        let changeData = {
          applicationId: _this.state.changeId,
          name: values.changeName,
          descr: values.changeDescr,
          managerName: values.changeManagerName,
          fnSys: values.changeFnSys,
          fnIp: values.changeFnIp,
          fnVersion: values.changeFnVersion,
          fnCpu: values.changeFnCpu,
          fnMemery: values.changeFnMemery,
          fnDisk: values.changeFnDisk,
          fnUrl: values.changeFnUrl,
          managerPhone: values.changeManagerPhone,
          fnOnline: values.changeFnOnline,
          imgUploads: imgUploadArr,
          fileUploads: fileUploadArr,
          companyName: values.changeCompanyName
        };
        console.log(changeData);
        ajax({
          url: 'updateData.do',
          type: 'post',
          data: changeData,
          success: function (res) {
            //console.log(res);
            if (res.ret == 'SUCCESS') {
              const removeUrls = _this.state.removeImgUploadsList;
              const removefileUrls = _this.state.removeUploadsList;

              //删除图片操作
              let flag1 = false;
              if (removeUrls.length != 0) {
                ajax({
                  url: 'deleteImgUpload.do',
                  type: 'post',
                  data: removeUrls,
                  success: function (res) {
                    //console.log(res);
                    if (res.ret == 'SUCCESS') {
                      flag1 = true;
                      _this.setState({
                        removeImgUploadsList: [],
                        //imgUploadsList: []
                      })
                    }
                  }
                })
              } else {
                flag1 = true
              }

              //删除文件操作
              let flag2 = false;
              if (removefileUrls.length != 0) {
                ajax({
                  url: 'deleteUpload.do',
                  type: 'post',
                  data: removefileUrls,
                  success: function (res) {
                    //console.log(res);
                    if (res.ret == 'SUCCESS') {
                      flag2 = true;
                      _this.setState({
                        removeUploadsList: [],
                        //fileUploadsList: []
                      })
                    }
                  }
                })
              } else {
                flag2 = true
              }

              setTimeout(function () {
                if (flag1 == true && flag2 == true) {
                  Modal.success({
                    title: '应用资料修改成功'
                  });
                  _this.setState({
                    changeDataLoading: false,
                    changeDataVisible: false,
                    imgUploadsList: [],
                    imgUploadArr: [],
                    removeImgUploadsList: [],
                    fileUploadsList: [],
                    fileUploadArr: [],
                    removeUploadsList: []
                  });
                  _this.handleSearch()
                } else {
                  _this.setState({
                    changeDataLoading: false,
                    changeDataVisible: false,
                    imgUploadsList: [],
                    imgUploadArr: [],
                    removeImgUploadsList: [],
                    fileUploadsList: [],
                    fileUploadArr: [],
                    removeUploadsList: []
                  });
                  Modal.error({
                    title: '应用资料修改失败，原因是文件删除失败或者图片删除失败'
                  });
                }
              }, 2000)
            } else {
              _this.setState({
                changeDataLoading: false,
                changeDataVisible: false
              });
              Modal.error({
                title: '系统错误，应用资料修改失败'
              });
            }
          },
          error() {
            _this.setState({
              changeDataLoading: false,
              changeDataVisible: false
            });
            Modal.error({
              title: '服务器错误'
            });
          }
        })
      } else {
        Modal.error({
          title: '系统错误'
        });
      }

    })

  },
  //修改信息取消
  changeDataCancel() {
    this.setState({
      changeDataVisible: false,
      changeDataLoading: false,
      imgUploadsList: [],
      fileUploadsList: [],
      removeImgUploadsList: [],
      removeUploadsList: []
    })
  },

  //删除对话框显示
  handleDelete(ev) {
    ev = ev || window.event;
    this.setState({
      deleteVisible: true,
      deleteId: ev.target.id
    })
  },
  //确定删除
  deleteOk() {
    let _this = this;
    this.setState({
      deleteLoading: true
    });
    let data = [this.state.deleteId];
    ajax({
      url: 'deleteData.do',
      type: 'post',
      data: data,
      success(res) {
        _this.setState({
          deleteLoading: false
        });
        if (res.ret == 'SUCCESS') {
          _this.setState({
            deleteVisible: false
          });
          Modal.success({
            title: res.data
          });
          if (_this.state.pagination.total % _this.state.pagination.pageSize === 1 && _this.state.pagination.current === Math.ceil(_this.state.pagination.total / _this.state.pagination.pageSize) && _this.state.pagination.current !== 1) {
            _this.handlePageChange(_this.state.pagination.current - 1)
          } else {
            _this.handlePageChange(_this.state.pagination.current);
          }

        } else {
          Modal.error({
            title: res.data
          });
        }
      },
      error() {
        _this.setState({
          deleteLoading: false
        });
        Modal.error({
          title: '服务器连接失败'
        });
      }
    })
  },
  //取消删除对话框
  deleteCancel() {
    this.setState({
      deleteVisible: false,
      deleteLoading: false
    })
  },
  //显示批量删除对话框
  deleteAll() {
    this.setState({
      deleteAllVisible: true
    })
  },
  //批量删除
  deleteAllOk() {
    let _this = this;
    this.setState({
      deleteAllLoading: true
    });
    let data = this.state.selectedRowKeys;
    ajax({
      url: 'deleteData.do',
      type: 'post',
      data: data,
      success(res) {
        _this.setState({
          deleteAllLoading: false
        });
        if (res.ret == 'SUCCESS') {
          _this.setState({
            deleteAllVisible: false
          });
          Modal.success({
            title: res.data
          });
          if (_this.state.pagination.total % _this.state.pagination.pageSize === _this.state.selectedRowKeys.length && _this.state.pagination.current === Math.ceil(_this.state.pagination.total / _this.state.pagination.pageSize) && _this.state.pagination.current !== 1) {
            _this.handlePageChange(_this.state.pagination.current - 1)
          } else {
            _this.handlePageChange(_this.state.pagination.current);
          }
          _this.setState({
            selectedRowKeys: []
          })
        } else {
          Modal.error({
            title: res.data
          });
        }
      },
      error() {
        _this.setState({
          deleteAllLoading: false
        });
        Modal.error({
          title: '服务器连接失败'
        });
      }
    })
  },
  //取消批量删除对话框
  deleteAllCancel() {
    this.setState({
      deleteAllVisible: false,
      deleteAllLoading: false
    })
  },
  //选中项发生变化的时的回调
  onSelectChange(selectedRowKeys, selectedRows) {
    //console.log(selectedRowKeys);
    this.setState({
      selectedRowKeys: selectedRowKeys
    });
  },
  //上传文件改变时的状态
  upload(data) {
    //console.log(data);
    data.fileList = data.fileList.map((file) => {
      if (file.response) {
        file.url = file.response.data.url;
      }
      return file;
    });
    this.setState({
      fileList: data.fileList
    });
  },
  render() {
    const { selectedRowKeys } = this.state;
    //table选项功能配置
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;
    const { getFieldProps } = this.props.form;
    const changeName = getFieldProps('changeName', {
      rules: [
        { required: true, message: '请输入应用名称' }
      ],
      validateTrigger: ['onChange']
    });
    const changeDescr = getFieldProps('changeDescr', {});
    const changeCompanyName = getFieldProps('changeCompanyName', {
      rules: [
        { required: true, pattern: /^(?=[0-9a-zA-Z\u4e00-\u9fa5]+$)/, message: '请输入正确的所属单位名（不能使用特殊字符）' }
      ],
      validateTrigger: ['onChange']
    });
    const changeFnVersion = getFieldProps('changeFnVersion', {
      rules: [
        { required: true, pattern: /^\d+(\.\d+)*$/, message: '请输入正确的版本号' },
      ],
      validateTrigger: ['onChange'],
    });
    const changeFnUrl = getFieldProps('changeFnUrl', {
      rules: [
        { required: true, pattern: /^[\x01-\x7f]*$/, message: '非空且不能含有中文' },
      ],
      validateTrigger: ['onChange'],
    });
    const changeManagerName = getFieldProps('changeManagerName', {
      rules: [
        { required: true, pattern: /^([\u4e00-\u9fa5]){2,7}$/, message: '请输入正确的姓名' },
      ],
      validateTrigger: ['onChange'],
    });
    const changeManagerPhone = getFieldProps('changeManagerPhone', {
      rules: [
        { required: true, pattern: /^(13[0-9]|15[0-9]|17[0-3]|17[5-8]|18[0-9])[0-9]{8}$/, message: '请输入正确的手机号码' },
      ],
      validateTrigger: ['onChange'],
    });
    const changeFnSys = getFieldProps('changeFnSys', {});
    const changeFnIp = getFieldProps('changeFnIp', {
      rules: [
        {
          required: true,
          pattern: /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-5][0-5])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/,
          message: '请输入正确的IP地址'
        },
      ],
      validateTrigger: ['onChange'],
    });
    const changeFnCpu = getFieldProps('changeFnCpu', {});
    const changeFnMemery = getFieldProps('changeFnMemery', {});
    const changeFnDisk = getFieldProps('changeFnDisk', {});
    const changeFnOnline = getFieldProps('changeFnOnline', {});
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 12 }
    };
    //上传图片
    const props = {
      action: fileLoads + 'fileUpload.do',
      listType: 'picture-card',
      accept: '.jpg,.jpeg,.png,gif,',
      fileList: this.state.imgUploadsList,
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
        <div className="dataTitle">
          <h2>资料信息记录查询：</h2>
        </div>
        {/*搜索需求*/}
        <Row className="dataSearch">
          <Col>
            <Button type="primary" onClick={this.deleteAll} disabled={!hasSelected} style={{ marginRight: 20 }}>删除</Button>
            <label>应用名称</label>
            <Input type="text" ref="dataName" style={{ width: 80, marginRight: 10 }} />
            <label>负责人姓名</label>
            <Input type="text" ref="dataManagerName" style={{ width: 80, marginRight: 10 }} />
            <label>上下线</label>
            <Select onChange={this.onlineChange} defaultValue="111" style={{ width: 80, marginRight: 10 }}>
              <Option value='111' key='12'>全部</Option>
              <Option value='1' key='1'>上线</Option>
              <Option value='0' key='0'>下线</Option>

            </Select>
            <label>开始时间</label>
            <DatePicker value={this.state.dayStart}
              onChange={this.dayStartChange}
              disabledDate={this.disabledDayStart}
              placeholder="开始日期"
              style={{ width: 100, marginRight: 10 }} />
            <label>结束时间</label>
            <DatePicker value={this.state.dayEnd}
              onChange={this.dayEndChange}
              disabledDate={this.disabledDayEnd}
              placeholder="结束日期"
              style={{ width: 100, marginRight: 20 }} />
            <Button type="primary" onClick={this.handleSearch}><Icon type="search" /></Button>
            <Button type="primary" onClick={this.handleAdd} style={{ float: 'right' }}>新增资料</Button>
          </Col>
        </Row>

        {/*数据列表*/}
        <Table rowKey={function (item) { return item.applicationId }}
          className="dataSearchTable"
          rowSelection={rowSelection}
          columns={this.state.columns}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          size="middle" bordered />

        {/*添加操作*/}
        <Modal title="新增资料信息"
          style={{ top: 20 }}
          visible={this.state.addVisible}
          closable={false}
          maskClosable={false}
          footer="">
          <DataAdd onOk={this.addOk} onCancel={this.addCancel} ref="dataAdd" />
        </Modal>

        {/*详情页面*/}
        <Modal title="资源详细信息："
          visible={this.state.infoVisible}
          onOk={this.infoOk}
          onCancel={this.infoCancel}
          confirmLoading={this.state.infoLoading}
          maskClosable={false}>
          <ul className="detailsFl">
            <li><label>服务名称:</label><span>{this.state.infoName}</span></li>
            <li><label>所属单位:</label><span>{this.state.infoCompanyName}</span></li>            
            <li><label>应用描述:</label><span>{this.state.infoDescr}</span></li>
            <li><label>负责人名字:</label><span>{this.state.infoManagerName}</span></li>
            <li><label>负责人电话:</label><span>{this.state.infoManagerPhone}</span></li>
            <li><label>操作系统版本:</label><span>{this.state.infoFnSys}</span></li>
            <li><label>服务器ip:</label><span>{this.state.infoFnIp}</span></li>
            <li><label>应用版本:</label><span>{this.state.infoFnVersion}</span></li>
            <li><label>cpu需求:</label><span>{this.state.infoFnCpu}</span></li>
            <li><label>内存需求:</label><span>{this.state.infoFnMemery}</span></li>
            <li><label>硬盘需求:</label><span>{this.state.infoFnDisk}</span></li>
            <li><label>应用地址:</label><span>{this.state.infoFnUrl}</span></li>
            <li><label>上下线:</label><span>{this.state.infoFnOnline}</span></li>
            <li><label>更新时间:</label><span>{this.state.UdTime}</span></li>
          </ul>
          <div className="info" id="pickData"></div>
          <div className="info" id="fileDataTitle"></div>
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

        {/*修改页面*/}
        <Modal title="资源信息修改："
          style={{ top: 20 }}
          visible={this.state.changeDataVisible}
          onOk={this.changeDataOk}
          onCancel={this.changeDataCancel}
          confirmLoading={this.state.changeDataLoading}
          maskClosable={false}>
          <Form horizontal>
            <FormItem {...formItemLayout} label="应用名称" hasFeedback>
              <Input {...changeName} disabled placeholder="请输入应用名称" />
            </FormItem>
            <FormItem {...formItemLayout} label="所属单位" hasFeedback>
              <Input {...changeCompanyName} placeholder="请输入所属单位" />
            </FormItem>
            <FormItem {...formItemLayout} label="应用描述">
              <Input {...changeDescr} placeholder="请输入应用描述" />
            </FormItem>
            <FormItem {...formItemLayout} label="应用版本" hasFeedback>
              <Input {...changeFnVersion} placeholder="请输入应用版本" />
            </FormItem>
            <FormItem {...formItemLayout} label="应用地址" hasFeedback>
              <Input {...changeFnUrl} placeholder="请输入应用地址" />
            </FormItem>
            <FormItem {...formItemLayout} label="负责人姓名" hasFeedback>
              <Input {...changeManagerName} placeholder="请输入负责人姓名" />
            </FormItem>
            <FormItem {...formItemLayout} label="负责人手机" hasFeedback>
              <Input {...changeManagerPhone} placeholder="请输入负责人手机" />
            </FormItem>
            <FormItem {...formItemLayout} label="操作系统版本">
              <Input {...changeFnSys} placeholder="请输入操作系统版本" />
            </FormItem>
            <FormItem {...formItemLayout} label="服务器IP" hasFeedback>
              <Input {...changeFnIp} placeholder="请输入服务器IP" />
            </FormItem>
            <FormItem {...formItemLayout} label="CPU需求">
              <Input {...changeFnCpu} placeholder="请输入CPU需求" />
            </FormItem>
            <FormItem {...formItemLayout} label="内存需求">
              <Input {...changeFnMemery} placeholder="请输入内存需求" />
            </FormItem>
            <FormItem {...formItemLayout} label="硬盘需求">
              <Input {...changeFnDisk} placeholder="请输入硬盘需求" />
            </FormItem>
            <FormItem {...formItemLayout} label="上下线">
              <RadioGroup {...changeFnOnline}>
                <Radio key='1' value={1}>上线</Radio>
                <Radio key='0' value={0}>下线</Radio>
              </RadioGroup>
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
        {/*删除操作*/}
        <Modal title="系统提示："
          visible={this.state.deleteVisible}
          onOk={this.deleteOk}
          onCancel={this.deleteCancel}
          confirmLoading={this.state.deleteLoading}
          maskClosable={false}>
          <h4>确定要删除吗？</h4>
        </Modal>

        {/*批量删除操作*/}
        <Modal title="系统提示："
          visible={this.state.deleteAllVisible}
          onOk={this.deleteAllOk}
          onCancel={this.deleteAllCancel}
          confirmLoading={this.state.deleteAllLoading}
          maskClosable={false}>
          <h4>确定要删除已选择项吗？</h4>
        </Modal>
      </div>
    )
  }
});
Data = createForm()(Data);
export default Data;
