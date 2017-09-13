import React from 'react';
import {browserHistory,Link} from 'react-router';
import $ from 'jquery';
import { Menu, Icon } from 'antd';

const SubMenu = Menu.SubMenu;

const App = React.createClass({
  getInitialState() {
    return ({
      current: '',
    });
  },
  componentDidMount(){
    if (location.href.match('data')) {
      this.setState({
        current: '资料信息管理'
      })
    } else if (location.href.match('test')) {
      this.setState({
        current: '资料测试管理'
      })
    } else if (location.href.match('log')) {
      this.setState({
        current: '资料日志管理'
      })
    } else if (location.href.match('type')) {
      this.setState({
        current: '日志类型管理'
      })
    } else {
      this.setState({
        current: '首页'
      })
    }
  },
  componentWillReceiveProps: function () {
    if (location.href.match('data')) {
      this.setState({
        current: '资料信息管理'
      })
    } else if (location.href.match('test')) {
      this.setState({
        current: '资料测试管理'
      })
    } else if (location.href.match('log')) {
      this.setState({
        current: '资料日志管理'
      })
    } else if (location.href.match('type')) {
      this.setState({
        current: '日志类型管理'
      })
    } else {
      this.setState({
        current: '资料信息管理'
      })
    }
  },
  handleClick(e) {
    this.setState({
      current: e.key,
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
                defaultOpenKeys={['sub1']}
                selectedKeys={[this.state.current]}
                mode="inline"
                style={{width:185}}
                theme="dark"
          >
            <Menu.Item key="首页"><Link to="/"><Icon type="home"/>首页</Link></Menu.Item>
            <SubMenu key="sub1" title={<span><Icon type="book" />应用资料管理</span>}>
              <Menu.Item key="资料信息管理"><Link to="/data">资料信息管理</Link></Menu.Item>
              <Menu.Item key="资料测试管理"><Link to="/test">资料测试管理</Link></Menu.Item>
              <SubMenu key="sub3" title="资料日志信息">
                <Menu.Item key="资料日志管理"><Link to="/log">资料日志管理</Link></Menu.Item>
                <Menu.Item key="日志类型管理"><Link to="/type">日志类型管理</Link></Menu.Item>
              </SubMenu>
            </SubMenu>
          </Menu>
        </div>
        <div id='rightWrap'>
          {this.props.children}
        </div>
      </div>
    );
  }
});
export default App;
