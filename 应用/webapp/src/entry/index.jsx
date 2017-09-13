import './index.css';
import App from '../component/App/App';
import Main from '../component/App/Main/Main';
import Data from '../component/App/Data/Data';
import DataTest from '../component/App/DataTest/DataTest'
import DataLog from '../component/App/DataLog/DataLog'
import DataLogType from '../component/App/DataLogType/DataLogType'
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, hashHistory, IndexLink, IndexRoute } from 'react-router';

export default render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Data} />
      <Route path='data' component={Data} />
      <Route path='test' component={DataTest} />
      <Route path='log' component={DataLog} />
      <Route path='type' component={DataLogType} />
    </Route>
  </Router>
), document.getElementById('react-content'));
