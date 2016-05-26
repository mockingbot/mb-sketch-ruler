require('styles/dragBox.css');

import React from 'react';

/*
 * 2016.5.25
 * iny
 * (以iPhone为例)可拖动的组件
 * 这个组件的时间有点繁琐了,后期可以统一下
 */
class IPhone extends React.Component {
	
	constructor(props){
		super(props)
		this.state ={
		  	editable : false,
		  	resizable : false
		}
	}

	//调整
	componentDidMount() {
		//当出现内存占用过高的问题时,可以让这些属性需要时再绑定,这里为了直观,就没改

		//事件函数bind(this)以后
		this.setPosition = this.setPosition.bind(this)
		this.setWidth = this.setWidth.bind(this)
		this.setHeight = this.setHeight.bind(this)
		this.setWAndH = this.setWAndH.bind(this)
		this.setWidthAndLeft = this.setWidthAndLeft.bind(this)
		this.setHeightAndTop = this.setHeightAndTop.bind(this)
		this.setWHTop = this.setWHTop.bind(this)
		this.setWHLeft = this.setWHLeft.bind(this)
		this.setWHTopLeft = this.setWHTopLeft.bind(this)
	}

	componentWillUnmount(){
	} 
	
	moveIPhone(e){
		// e.preventDefault();
		this.startX = e.clientX;
		this.startY = e.clientY;

		document.addEventListener('mousemove', this.setPosition)
		console.log("msg")
		var func = () => {
			document.removeEventListener('mousemove', this.setPosition)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}

	//设置位置
	setPosition(e){
		e.preventDefault()
		var deltaX = e.clientX - this.startX
		var deltaY = e.clientY - this.startY
		// console.log(deltaX, deltaY)
		this.props.onMove(deltaX, deltaY)

		this.startX = e.clientX;
		this.startY = e.clientY;
	}

	//右边的拖放事件
	resizeX(e){
		this.startX = e.clientX;

		document.addEventListener('mousemove', this.setWidth)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setWidth)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}

	// 其实设置宽高可以强行合成一个函数,为鼠标按下事件绑定一个参数,后续判断即可,
	//不过那样就不清晰了,而且判断类型的代码不见得就少多少,事件的分发还会影响效率
	setWidth(e){
		e.preventDefault()
		var deltaWidth = e.clientX - this.startX
		console.log(deltaWidth)
		this.props.onResize(deltaWidth, 0)
		this.startX = e.clientX;
	}

	//左边的拖放事件,因为要调整定位的left值,所以与右边不同
	resizeXLeft(e){
		this.startX = e.clientX;

		document.addEventListener('mousemove', this.setWidthAndLeft)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setWidthAndLeft)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}

	setWidthAndLeft(e){
		e.preventDefault()
		var deltaWidth = e.clientX - this.startX
		console.log(deltaWidth)
		this.props.onResize(-deltaWidth, 0, deltaWidth, 0)
		this.startX = e.clientX;
	}


	//下边的拖放事件
	resizeY(e){
		this.startY = e.clientY;
		document.addEventListener('mousemove', this.setHeight)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setHeight)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}

	//调整高度
	setHeight(e){
		e.preventDefault()
		console.log('取消了')
		var deltaHeight = e.clientY - this.startY
		console.log(deltaHeight)
		this.props.onResize(0, deltaHeight)
		this.startY = e.clientY;
	}

	//上边的拖放事件,因为要调整定位的top值,所以与下边不同
	resizeYTop(e){
		this.startY = e.clientY;
		document.addEventListener('mousemove', this.setHeightAndTop)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setHeightAndTop)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}

	setHeightAndTop(e){
		e.preventDefault()
		var deltaHeight = e.clientY - this.startY
		console.log(deltaHeight)
		//注意这里,宽高要加负号(例如右边的边右移是变宽,而左边的边左移是变窄)
		this.props.onResize(0, -deltaHeight, 0, deltaHeight)
		this.startY = e.clientY;
	}



	resizeXY(e){
		this.startX = e.clientX;
		this.startY = e.clientY;

		document.addEventListener('mousemove', this.setWAndH)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setWAndH)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}

	//调整宽高
	setWAndH(e){
		e.preventDefault()
		var deltaWidth = e.clientX - this.startX
		var deltaHeight = e.clientY - this.startY
		console.log(deltaWidth, deltaHeight)
		this.props.onResize(deltaWidth, deltaHeight)
		this.startX = e.clientX;
		this.startY = e.clientY;
	}

	//右上
	resizeXYTop(e){
		e.preventDefault();
		this.startX = e.clientX;
		this.startY = e.clientY;

		document.addEventListener('mousemove', this.setWHTop)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setWHTop)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}
	setWHTop(e){
		e.preventDefault()
		var deltaWidth = e.clientX - this.startX
		var deltaHeight = e.clientY - this.startY
		console.log(deltaWidth, deltaHeight)
		this.props.onResize(deltaWidth, -deltaHeight, 0, deltaHeight)
		this.startX = e.clientX;
		this.startY = e.clientY;
	}

	//左下
	resizeXYLeft(e){
		this.startX = e.clientX;
		this.startY = e.clientY;

		document.addEventListener('mousemove', this.setWHLeft)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setWHLeft)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}
	setWHLeft(e){
		e.preventDefault()
		var deltaWidth = e.clientX - this.startX
		var deltaHeight = e.clientY - this.startY
		console.log(deltaWidth, deltaHeight)
		this.props.onResize(-deltaWidth, deltaHeight, deltaWidth, 0)
		this.startX = e.clientX;
		this.startY = e.clientY;
	}

	//左上
	rezieXYTopLeft(e){
		this.startX = e.clientX;
		this.startY = e.clientY;

		document.addEventListener('mousemove', this.setWHTopLeft)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setWHTopLeft)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}
	setWHTopLeft(e){
		e.preventDefault()
		var deltaWidth = e.clientX - this.startX
		var deltaHeight = e.clientY - this.startY
		console.log(deltaWidth, deltaHeight)
		this.props.onResize(-deltaWidth, -deltaHeight, deltaWidth, deltaHeight)
		this.startX = e.clientX;
		this.startY = e.clientY;
	}

	allowEdit(e){
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
		//这里的逻辑要重新整理 首先判断state,state不一样直接render,
		//state相同再比props, 
		if(nextProps.top !== this.props.top
			|| nextProps.left !== this.props.left
			|| nextProps.width !== this.props.width
			|| nextProps.height !== this.props.height
			|| nextState.editable !== this.state.editable
			|| nextState.resizable !== this.state.resizable){
			return true;
		}
		return false;
	}

	setActive(){
		console.log("msg")
		this.setState(Object.assign({}, this.state, {
			resizable : true
		}))
		/* 这里once一个失焦事件,为什么在根组件监听点击空白处事件,触发以后通知所有组件
		进入不可选状态呢? 参看Note - 思路 3 */
		var func = (e) => {
			//这里用了refs而不是className判断 主要是怕以后改样式名时出问题,也可以防止dom节点被篡改时失效(不过节点都被改了就可以下班了)
			// if(e.target.className !== 'dragBox'){}
			if(this.refs.dragBox !== e.target){
				this.setState(Object.assign({}, this.state, {
					resizable : false
				}))
				document.removeEventListener('click', func)
			}
		}
		document.addEventListener('click', func);
		
	}

	render() {


		
		var iphoneStyle = {
		  top: this.props.top,
		  left: this.props.left,
		  width: this.props.width,
		  height: this.props.height
		}
		var className = this.state.resizable ? "iphone active" : "iphone";
		// console.log(iphoneStyle)
		console.log("render")
	    return (
	      	<div className={className}
	      	  style={iphoneStyle}
	      	  onClick={this.setActive.bind(this)}>
	      	  <div className="header"
	      	    onMouseDown={this.moveIPhone.bind(this)}
	      	    onDoubleClick={this.allowEdit.bind(this)}
	      	    onBlur={this.forbidEdit.bind(this)}
	      	    contentEditable={this.state.editable}>iPhone 5/5S/5C</div>
	      	   {this.state.resizable ? 
	      	   <div ref="dragBox" className="dragBox">
	      	   	<div className="top">
	      	   		<span onMouseDown={this.rezieXYTopLeft.bind(this)}></span>
	      	   		<span onMouseDown={this.resizeYTop.bind(this)}></span>
	      	   		<span onMouseDown={this.resizeXYTop.bind(this)}></span>
	      	   	</div>
	      	   	<div className="center">
	      	   		<span onMouseDown={this.resizeXLeft.bind(this)}></span>
	      	   		<span onMouseDown={this.resizeX.bind(this)}></span>
	      	   	</div>
	      	   	<div className="bottom">
	      	   		<span onMouseDown={this.resizeXYLeft.bind(this)}></span>
	      	   		<span onMouseDown={this.resizeY.bind(this)}></span>
	      	   		<span onMouseDown={this.resizeXY.bind(this)}></span>
	      	   	</div>
	      	   </div> : null}
	      	</div>
      	);
  }
}

IPhone.defaultProps = {
};

export default IPhone;
