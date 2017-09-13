import React from 'react';
import {browserHistory,Link} from 'react-router';
import { Menu, Icon } from 'antd';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const App = React.createClass({
  getInitialState() {
    return ({
      current: '',
    });
  },
  componentDidMount(){
    if (location.href.match('goods')) {
      this.setState({
        current: '资源商品管理'
      })
    } else if (location.href.match('department')) {
      this.setState({
        current: '部门信息管理'
      })
    } else if (location.href.match('archivesTypes')) {
      this.setState({
        current: '档案类别管理'
      })
    } else if (location.href.match('archives')) {
      this.setState({
        current: '档案信息管理'
      })
    } else if (location.href.match('library')) {
      this.setState({
        current: '档案借阅管理'
      })
    } else if (location.href.match('section')) {
      this.setState({
        current: '段号数据管理'
      })
    } else if (location.href.match('issi')) {
      this.setState({
        current: '个号数据管理'
      })
    } else if (location.href.match('gssi')) {
      this.setState({
        current: '组号数据管理'
      })
    } else if (location.href.match('tgsi')) {
      this.setState({
        current: '直通号数据管理'
      })
    } else if (location.href.match('baseStation')) {
      this.setState({
        current: '基站数据管理'
      })
    } else if (location.href.match('hz')) {
      this.setState({
        current: '基站频率管理'
      })
    } else if (location.href.match('category')) {
      this.setState({
        current: '类型信息管理'
      })
    } else if (location.href.match('area')) {
      this.setState({
        current: '区域管理管理'
      })
    } else if (location.href.match('company')) {
      this.setState({
        current: '厂商管理管理'
      })
    } else if (location.href.match('gevice')) {
      this.setState({
        current: '设备管理列表'
      })
    } else {
      this.setState({
        current: '首页'
      })
    }
  },
  componentWillReceiveProps: function () {
    if (location.href.match('goods')) {
      this.setState({
        current: '资源商品管理'
      })
    } else if (location.href.match('department')) {
      this.setState({
        current: '部门信息管理'
      })
    } else if (location.href.match('archivesTypes')) {
      this.setState({
        current: '档案类别管理'
      })
    } else if (location.href.match('archives')) {
      this.setState({
        current: '档案信息管理'
      })
    } else if (location.href.match('library')) {
      this.setState({
        current: '档案借阅管理'
      })
    } else if (location.href.match('section')) {
      this.setState({
        current: '段号数据管理'
      })
    } else if (location.href.match('issi')) {
      this.setState({
        current: '个号数据管理'
      })
    } else if (location.href.match('gssi')) {
      this.setState({
        current: '组号数据管理'
      })
    } else if (location.href.match('tgsi')) {
      this.setState({
        current: '直通号数据管理'
      })
    } else if (location.href.match('baseStation')) {
      this.setState({
        current: '基站数据管理'
      })
    } else if (location.href.match('hz')) {
      this.setState({
        current: '基站频率管理'
      })
    } else if (location.href.match('category')) {
      this.setState({
        current: '类型信息管理'
      })
    } else if (location.href.match('area')) {
      this.setState({
        current: '区域管理管理'
      })
    } else if (location.href.match('company')) {
      this.setState({
        current: '厂商管理管理'
      })
    } else if (location.href.match('gevice')) {
      this.setState({
        current: '设备管理列表'
      })
    } else {
      this.setState({
        current: '首页'
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
            <SubMenu key="sub1" title={<span><Icon type="book" />资源管理分类</span>}>
              <SubMenu key="sub2" title="基础数据管理">
                <Menu.Item key="部门信息管理"><Link to="/department">部门信息管理</Link></Menu.Item>
                <Menu.Item key="类型信息管理"><Link to="/category">类别信息管理</Link></Menu.Item>
                <Menu.Item key="区域管理管理"><Link to="/area">区域管理管理</Link></Menu.Item>
                <Menu.Item key="厂商管理管理"><Link to="/company">厂商管理管理</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="sub3" title="档案数据管理">
                <Menu.Item key="档案类别管理"><Link to="/archivesTypes">档案类别管理</Link></Menu.Item>
                <Menu.Item key="档案信息管理"><Link to="/archives">档案信息管理</Link></Menu.Item>
                <Menu.Item key="档案借阅管理"><Link to="/library">档案借阅管理</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="sub4" title="通信数据管理">
                <Menu.Item key="个号数据管理"><Link to="/issi">个号数据管理</Link></Menu.Item>
                <Menu.Item key="组号数据管理"><Link to="/gssi">组号数据管理</Link></Menu.Item>
                <Menu.Item key="段号数据管理"><Link to="/section">段号数据管理</Link></Menu.Item>
                <Menu.Item key="直通号数据管理"><Link to="/tgsi">直通号数据管理</Link></Menu.Item>
              </SubMenu>
              <SubMenu key="sub5" title="基站数据管理">
                <Menu.Item key="基站数据管理"><Link to="/baseStation">基站数据管理</Link></Menu.Item>
                <Menu.Item key="基站频率管理"><Link to="/hz">基站频率管理</Link></Menu.Item>
              </SubMenu>
              <Menu.Item key="资源商品管理"><Link to="/goods">物品管理信息</Link></Menu.Item>
              <Menu.Item key="设备管理列表"><Link to="/gevice">设备管理列表</Link></Menu.Item>
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
