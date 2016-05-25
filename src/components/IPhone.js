require('styles/dragBox.css');

import React from 'react';

/*
 * 2016.5.25
 * iny
 * (以iPhone为例)可拖动的组件
 */
class IPhone extends React.Component {
	
	constructor(props){
		super(props)
		this.state ={
		  	editable : false
		}
	}

	setPosition(e){
		var deltaX = e.clientX - this.startX
		var deltaY = e.clientY - this.startY
		// console.log(deltaX, deltaY)
		this.props.onMove(deltaX, deltaY)

		this.startX = e.clientX;
		this.startY = e.clientY;
	}

	// 其实设置宽高可以强行合成一个函数,为鼠标按下事件绑定一个参数,后续判断即可,
	//不过那样就不清晰了,而且判断类型的代码不见得就少多少,事件的分发还会影响效率
	setWidth(e){
		
		var deltaWidth = e.clientX - this.startX
		console.log(deltaWidth)
		this.props.onResize(deltaWidth, 0)
		this.startX = e.clientX;
	}

	setHeight(e){
		var deltaHeight = e.clientY - this.startY
		console.log(deltaHeight)
		this.props.onResize(0, deltaHeight)
		this.startY = e.clientY;
	}

	setBoth(e){
		var deltaWidth = e.clientX - this.startX
		var deltaHeight = e.clientY - this.startY
		console.log(deltaWidth, deltaHeight)
		this.props.onResize(deltaWidth, deltaHeight)
		this.startX = e.clientX;
		this.startY = e.clientY;
	}
	
	componentDidMount() {
		//事件函数bind(this)以后
		this.setPosition = this.setPosition.bind(this)
		this.setWidth = this.setWidth.bind(this)
		this.setHeight = this.setHeight.bind(this)
		this.setBoth = this.setBoth.bind(this)

	}

	componentWillUnmount(){
	} 
	
	moveIphone(e){
		// e.preventDefault();
		this.startX = e.clientX;
		this.startY = e.clientY;

		document.addEventListener('mousemove', this.setPosition)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setPosition)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}

	resizeX(e){
		this.startX = e.clientX;

		document.addEventListener('mousemove', this.setWidth)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setWidth)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}

	resizeY(e){
		this.startY = e.clientY;
		document.addEventListener('mousemove', this.setHeight)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setHeight)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}

	resizeBoth(e){
		this.startX = e.clientX;
		this.startY = e.clientY;

		document.addEventListener('mousemove', this.setBoth)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setBoth)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}
	allowEdit(){
		this.setState({
		  	editable : true
		})
	}

	forbidEdit(){
		this.setState({
		  	editable : false
		})
	}

	shouldComponentUpdate(nextProps, nextState){
		if(nextProps.top !== this.props.top
			|| nextProps.left !== this.props.left
			|| nextProps.width !== this.props.width
			|| nextProps.height !== this.props.height
			|| nextState.editable !== this.state.editable){
			return true;
		}
		return false;
	}

	render() {
		
		var iphoneStyle = {
		  top: this.props.top,
		  left: this.props.left,
		  width: this.props.width,
		  height: this.props.height
		}
		// console.log(iphoneStyle)

	    return (
	      	<div className="iphone" 
	      	  style={iphoneStyle}>
	      	  <div className="header"
	      	    onMouseDown={this.moveIphone.bind(this)}
	      	    onDoubleClick={this.allowEdit.bind(this)}
	      	    onBlur={this.forbidEdit.bind(this)}
	      	    contentEditable={this.state.editable}>iPhone5s</div>
	      	   <div className="dragBox">
	      	   	<div className="top">
	      	   		<span onMouseDown={this.resizeBoth.bind(this)}></span>
	      	   		<span onMouseDown={this.resizeY.bind(this)}></span>
	      	   		<span onMouseDown={this.resizeBoth.bind(this)}></span>
	      	   	</div>
	      	   	<div className="center">
	      	   		<span onMouseDown={this.resizeX.bind(this)}></span>
	      	   		<span onMouseDown={this.resizeX.bind(this)}></span>
	      	   	</div>
	      	   	<div className="bottom">
	      	   		<span onMouseDown={this.resizeBoth.bind(this)}></span>
	      	   		<span onMouseDown={this.resizeY.bind(this)}></span>
	      	   		<span onMouseDown={this.resizeBoth.bind(this)}></span>
	      	   	</div>

	      	   	{/*<div className="topLeft"></div>
	      	   	<div className="top"></div>
	      	   	<div className="topRight"></div>
	      	   	<div className="left"></div>
	      	   	<div className="right"></div>
	      	   	<div className="bottomLeft"></div>
	      	   	<div className="bottom"></div>
	      	   	<div className="bottomRight"></div>*/}
	      	   </div>
	      	</div>
      	);
  }
}

IPhone.defaultProps = {
};

export default IPhone;
