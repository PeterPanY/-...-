import './index.css';
import Resources from '../component/Resources/Resources';
import Main from '../component/Resources/Main/Main';
import Goods from '../component/Resources/Goods/Goods'
import Department from '../component/Resources/Basics/Department'
import Category from '../component/Resources/Basics/Category'
import Areas from '../component/Resources/Basics/Areas'
import Company from '../component/Resources/Basics/Company'
import ArchivesTypes from  '../component/Resources/Archives/ArchivesTypes'
import Archives from '../component/Resources/Archives/Archives'
import ArchivesLibrary from '../component/Resources/Archives/ArchivesLibrary'
import Section from '../component/Resources/Communication/Section'
import Issi from '../component/Resources/Communication/Issi'
import GSSI from '../component/Resources/Communication/GSSI'
import TGSSI from '../component/Resources/Communication/TGSSI'
import BaseStation from '../component/Resources/BaseStation/BaseStation'
import Hz from '../component/Resources/BaseStation/Hz'
import Device from '../component/Resources/Device/Device'
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, hashHistory, IndexLink, IndexRoute } from 'react-router';

export default render((
  <Router history={hashHistory}>
    <Route path="/" component={Resources}>
      <IndexRoute component={Department}/>
      <Route path='department' component={Department}/>
      <Route path='category' component={Category}/>
      <Route path='area' component={Areas}/>
      <Route path='company' component={Company}/>
      <Route path='archives' component={Archives}/>
      <Route path='archivesTypes' component={ArchivesTypes}/>
      <Route path='library' component={ArchivesLibrary}/>
      <Route path='section' component={Section}/>
      <Route path='issi' component={Issi}/>
      <Route path='gssi' component={GSSI}/>
      <Route path='tgsi' component={TGSSI}/>
      <Route path='baseStation' component={BaseStation}/>
      <Route path='hz' component={Hz}/>

      <Route path='goods' component={Goods}/>
      <Route path='gevice' component={Device}/>
    </Route>
  </Router>
), document.getElementById('react-content'));
