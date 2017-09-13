import React from 'react';
import { browserHistory, Link } from 'react-router';
import $ from 'jquery';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;

const Log = React.createClass({
  getInitialState() {
    return ({
      current: '',
    });
  },
  componentDidMount() {
    if (location.href.match('search')) {
      this.setState({
        current: '资料记录查询'
      })
    } else if (location.href.match('business')) {
      this.setState({
        current: "服务业务信息"
      })
    } else if (location.href.match('method')) {
      this.setState({
        current: "服务方法信息"
      })
    } else if (location.href.match('test')) {
      this.setState({
        current: "服务测试信息"
      })
    } else if (location.href.match('log')) {
      this.setState({
        current: '服务日志信息'
      })
    } else if (location.href.match('type')) {
      this.setState({
        current: '日志类型管理'
      })
    } else if (location.href.match('statement')) {
      this.setState({
        current: '服务报表统计'
      })
    } else {
      this.setState({
        current: '首页'
      })
    }
  },
  componentWillReceiveProps: function () {
    if (location.href.match('search')) {
      this.setState({
        current: '资料记录查询'
      })
    } else if (location.href.match('business')) {
      this.setState({
        current: "服务业务信息"
      })
    } else if (location.href.match('method')) {
      this.setState({
        current: "服务方法信息"
      })
    } else if (location.href.match('test')) {
      this.setState({
        current: "服务测试信息"
      })
    } else if (location.href.match('log')) {
      this.setState({
        current: '服务日志信息'
      })
    } else if (location.href.match('type')) {
      this.setState({
        current: '日志类型管理'
      })
    } else if (location.href.match('statement')) {
      this.setState({
        current: '服务报表统计'
      })
    } else {
      this.setState({
        current: '资料记录查询'
      })
    }
  },
  handleClick(e) {
    this.setState({
      current: e.key
    });
  },
  render() {
    return (
      <div>
        <div id="Boss_title">
          <div className="lf">

          </div>
          <div className="rt">

          </div>
        </div>
        <div id='leftMenu'>
          <Menu onClick={this.handleClick}
            defaultOpenKeys={['sub1', 'sub2']}
            selectedKeys={[this.state.current]}
            mode="inline"
            style={{ width: 185 }}
            theme="dark"
          >
            <Menu.Item key="首页"><Link to="/"><Icon type="home" />首页</Link></Menu.Item>
            <SubMenu key="sub1" title={<span><Icon type="book" />服务资料记录</span>}>
              <SubMenu key="sub2" title="服务资料信息">
                <Menu.Item key="资料记录查询"><Link to="/search">服务资料查询</Link></Menu.Item>
                <Menu.Item key="服务业务信息"><Link to="/business">服务业务信息</Link></Menu.Item>
                <Menu.Item key="服务方法信息"><Link to="/method">服务方法信息</Link></Menu.Item>
              </SubMenu>
              <Menu.Item key="服务测试信息"><Link to="/test">服务测试信息</Link></Menu.Item>
              <SubMenu key="sub3" title="服务日志信息">
                <Menu.Item key="服务日志信息"><Link to="/log">服务日志列表</Link></Menu.Item>
                <Menu.Item key="日志类型管理"><Link to="/type">日志类型管理</Link></Menu.Item>
              </SubMenu>
              <Menu.Item key="服务报表统计"><Link to="/statement">服务报表统计</Link></Menu.Item>              
            </SubMenu>
          </Menu>
        </div>
        <div id='rightWrap'>
          {this.props.children}
        </div>
      </div>
    );
  },
});
export default Log;
