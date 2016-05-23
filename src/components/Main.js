require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

import Panel from './Panel'

/*
 * 2016.5.23 
 * iny
 * 容器组件
 */
//组件设计：
// √ 1.由容器组件维护当前水平、垂直标尺以及画板的state ？
//   2.将两个标尺以参数的形式传给画板，由画板自身来管理 ？
class AppComponent extends React.Component {
  render() {
    return (
      <div className="main">
        <Panel />
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
