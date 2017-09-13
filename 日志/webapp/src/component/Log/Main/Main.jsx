
import React from 'react';
import {browserHistory} from 'react-router';
import $ from 'jquery';
import { Spin,Modal } from 'antd';
import echarts from 'echarts';
import ajax from '../../../common/ajax';
import './Main.css';

const Main=React.createClass({
  getInitialState(){
    return({
      loading:false,
    })
  },
  componentDidMount(){
    let _this=this;
    this.setState({
      loading:true
    });
    ajax({
      url:'subLog/logNum.do',
      type:'post',
      success(res){
        _this.setState({
          loading:false
        });
        for(let i=0;i<res.logCount.length;i++){
          let myChart=echarts.init(document.getElementById('log'+(i+1)));
          myChart.setOption({
            title : {
              text: res.logCount[i].systemCode+'日志级别分布',
              x:'center'
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: ['debug','info','warn','error']
            },
            series : [
              {
                name: '日志级别',
                type: 'pie',
                radius : ['40%','60%'],
                center: ['50%', '60%'],
                label:{
                  normal:{
                    formatter: '{b} : {c} \n ({d}%)'
                  }
                },
                data: [
                  {value:res.logCount[i].debug,name:'debug'},
                  {value:res.logCount[i].info,name:'info'},
                  {value:res.logCount[i].warn,name:'warn'},
                  {value:res.logCount[i].error,name:'error'}
                ],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ],
            color:['#2df5b4','#61a5a8','#e0cb91','#c23531']
          })
        }
      },
      error(){
        _this.setState({
          loading:false
        });
        Modal.error({
          title:'服务器连接失败'
        })
      }
    })
  },
  render(){
    return(
      <div>
        <Spin size="large" spinning={this.state.loading}>
          <div id="log1"></div>
          <div id="log2"></div>
          <div id="log3"></div>
          <div id="log4"></div>
          <div id="log5"></div>
          <div id="log6"></div>
          <div id="log7"></div>
          <div id="log8"></div>
          <div id="log9"></div>
          <div id="log10"></div>
          <div id="log11"></div>
        </Spin>
      </div>
    )
  }
});
export default Main;



    /*第一个实例*/
/*  const Main=React.createClass({*/
/*    render(){*/
/*      return(<h1>hollo,wored</h1>)*/
/*    }*/
/*  });*/
/*export default Main;*/

   /*第二个实例 组件实例*/
/*const Main=React.createClass({
  render(){
    return(
      <App name="John" />
    )
  }
});
const App=React.createClass({
  render(){
    return(
      <div>hello,{this.props.name}</div>
    )
  }
});
export default Main;*/

/*第三个实例  this.props.children()的实例*/
/*const Main=React.createClass({
  render(){
    return(
      <App>
        <span>hello</span>
        <span>world</span>
      </App>
    )
  }
});
const App=React.createClass({
  render(){
    return(
      <ul>
        {
          React.Children.map(this.props.children, function (child) {
            return <li>{child}</li>;
          })
        }
      </ul>
    )
  }
});
export default Main;*/



/*第四个实例    React.findDOMNode()的实例 */
/*var daaa=123456;
const App=React.createClass({
  porpTypes:{
    title:React.PropTypes.string.isRequired
  },
  render:function(){
  return <h1>holle, {this.props.title} </h1>;
}
});
const Main=React.createClass({
   render(){
     return(
       <App title={daaa} />
     )
   }
});*/

/*const Main=React.createClass({
  handleClick:function(){
    React.findDOMNode(this.refs.myTextInput).focus();
  },
  render(){
    return(
     <div><input type="text" ref="myTextInput"/> <input type="button" value="Focus the text input" onClick={this.handleClick}/></div>
    )
  }
});
export default Main;*/


/*第五个实例    this.state 的实例 */

/*const Main=React.createClass({
  getInitialState: function() {
    return {liked:false}
  },
  handleClick:function(e){
    this.setState({liked:!this.state.liked})
  },
  render:function(){
    var text=this.state.liked ? 'liked' :'haven\'t liked';
    return (<p onClick={this.handleClick}>You {text} this. Click to toggle.</p>)
  }
});
export default Main;*/


/*
/!*第个实例   表单 的实例 *!/
const Main=React.createClass({
  getInitialState:function(){
    return{value:'Hello'}
  },
  handleChange:function(event){
    this.setState({value: event.target.value});
  },
  render:function(){
    var value=this.state.value;
    return(
      <div>
        <input type="text" value={value} onChange={this.handleChange}/>
        <p>{value}</p>
      </div>
    )
  }
})


export default Main;
*/


/*var names = ['jsss','tom','shi'];
React.render(
  <div>{
    names.map(function(name){
      return(<div>Hello,{name}</div>)
    })
  }</div>,document.getElementById('react-content')
);*/


/*const Main=React.createClass({
  getInitialState:function(){
    return{enable: false};
  },
  handClick:function(){
    this.setState({enable: !this.state.enable})
  },
    render(){
      return(
        <div>
          <input type="text" disabled={this.state.enable}/>
          <button onClick={this.handClick}>sfsfff</button>
        </div>
      )
    }
});
export default Main;*/
/*
const Main=React.createClass({
  getInitialState:function(){
    return{
      opacity:1.0,
      name:'jhon',
      fontSize:'30px'

    }
  },
  componentDidMount:function(){
    this.tir=setInterval(function(){
      var opacity=this.state.opacity;
      opacity -= 0.5;
      if(opacity < 0.1){
        opacity=1.0
      }
      this.setState({
        opacity:opacity
      })
    }.bind(this),1000)
  },
  render(){
    return(
      <div style={{opacity:this.state.opacity,fontSize:this.state.fontSize}}>
        Hello {this.state.name}
      </div>

    )
  }
});
export default Main;*/
