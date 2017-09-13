import './index.css';
import Log from '../component/Log/Log';
import Main from '../component/Log/Main/Main';
import Search from '../component/Log/Search/Search';
import Business from '../component/Log/Business/Business';
import Method from '../component/Log/Method/Method';
import SearchTest from '../component/Log/SearchTest/SearchTest';
import SearchLog from '../component/Log/SearchLog/SearchLog';
import SearchLogType from '../component/Log/SearchLogType/SearchLogType';
import Statement from '../component/Log/Statement/Statement';
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, hashHistory, IndexLink, IndexRoute } from 'react-router';

export default render((
  <Router history={hashHistory}>
    <Route path="/" component={Log}>
      <IndexRoute component={Search}/>
      <Route path="search" component={Search}/>
      <Route path="business" component={Business}/>      
      <Route path="method" component={Method}/>
      <Route path="test" component={SearchTest}/>
      <Route path="log" component={SearchLog}/>
      <Route path="type" component={SearchLogType}/>
      <Route path="statement" component={Statement}/>
    </Route>
  </Router>
), document.getElementById('react-content'));
