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
	
	constructor(props){
		super(props)
		this.state = {
			width : document.body.clientWidth - 30,
			height : document.body.clientHeight - 30
		}
	}
	componentDidMount() {

		var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
		
		window.addEventListener(resizeEvt, () => {
			console.log(document.body.clientWidth)
			this.setState({
				width : document.body.clientWidth - 30,
				height : document.body.clientHeight - 30
			})
		});

	}
	
	render() {
		console.log("state: "+this.state.width)
	    return (
	      	<div className="main">
	        	<Panel width={this.state.width} height={this.state.height}/>
      		</div>
      	);
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
