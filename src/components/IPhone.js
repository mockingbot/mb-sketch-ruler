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
		//事件监听函数两次bind(this)以后指向不用,所以提前bind
		this.setAll = this.setAll.bind(this)
	}

	componentWillUnmount(){
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
		return true;
	}

	setActive(){
		
		this.setState(Object.assign({}, this.state, {
			resizable : true
		}))

		this.props.onActive(this.props.index)
		/* 这里once一个失焦事件,为什么在根组件监听点击空白处事件,触发以后通知所有组件
		进入不可选状态呢? 参看Note - 思路 3 */
		var func = (e) => {
			//这里用了refs而不是className判断 主要是怕以后改样式名时出问题,也可以防止dom节点被篡改时失效(不过节点都被改了就可以下班了)
			// if(e.target.className !== 'dragBox'){}
			//找出事件冒泡的路径
			var path = e.path;
			
			//判断iphone是否在路径上(即判断鼠标释放时的位置是否在iphone里)
			if(path.indexOf(this.refs.iphone) === -1){
				//如果不在,将状态置为不可拖放				
				this.setState(Object.assign({}, this.state, {
					resizable : false
				}))
				//向上层通知失焦,从而去除阴影
				// this.props.onBlur()
				document.removeEventListener('mouseup', func)
				console.log("cancel Event")
			}
		}
		document.addEventListener('mouseup', func);
		
	}

	//尝试着写个更抽象的方法
	resize(type, e){
		console.log(arguments)
		console.log('-------: ',type)
		this.type = type;
		
		this.startX = e.clientX;
		this.startY = e.clientY;

		document.addEventListener('mousemove', this.setAll)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setAll)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}

	setAll(e){
		e.preventDefault()
		var index = this.props.index;
		var deltaWidth = e.clientX - this.startX
		var deltaHeight = e.clientY - this.startY
		// console.log(deltaWidth, deltaHeight)

		//根据0(拖动)以及八个位置进行不同的处理
		switch(this.type){
			case 0 : 
				this.props.onResize(index, deltaWidth, deltaHeight)
				break;
			case 1 :
				this.props.onResize(index, deltaWidth, deltaHeight, -deltaWidth, -deltaHeight)
				break;
			case 2 :
				this.props.onResize(index, 0, deltaHeight, 0, -deltaHeight)
				break;
			case 3 :
				this.props.onResize(index, 0, deltaHeight, deltaWidth, -deltaHeight)
				break;
			case 4 : 
				this.props.onResize(index, deltaWidth, 0, -deltaWidth, 0)
				break;
			case 5 : 
				this.props.onResize(index, 0, 0, deltaWidth, 0)
				break;
			case 6 : 
				this.props.onResize(index, deltaWidth, 0, -deltaWidth, deltaHeight)
				break;
			case 7 : 
				this.props.onResize(index, 0, 0, 0, deltaHeight)
				break;
			case 8 : 
				this.props.onResize(index, 0, 0, deltaWidth, deltaHeight)
				break;
			default : 
				break;
		}
		
		this.startX = e.clientX;
		this.startY = e.clientY;
	}

	render() {
		var detail = this.props.detail;

		var style = {
		  left: detail.x,
		  top:  detail.y,
		  width: detail.width,
		  height: detail.height
		}
		var className = this.state.resizable ? "iphone active" : "iphone";
		
	    return (
	      	<div className={className}
	      	  style={style}
	      	  onMouseDown={this.setActive.bind(this)}
	      	  ref="iphone">
	      	  <div className="header"
	      	   	ref="header"
	      	    onMouseDown={this.resize.bind(this, 0)}
	      	    onDoubleClick={this.allowEdit.bind(this)}
	      	    onBlur={this.forbidEdit.bind(this)}
	      	    contentEditable={this.state.editable}>{this.props.detail.title}</div>
	      	   {this.state.resizable ? 
	      	   /* 这里放 document.getElementById('#box')
	      	     宽度高度均为100% (即撑满页面中box那个白色的区域)*/
	      	   <div className="dragBox" ref="dragBox">
	      	   	<div className="top">
	      	   		<span onMouseDown={this.resize.bind(this, 1)}></span>
	      	   		<span onMouseDown={this.resize.bind(this, 2)}></span>
	      	   		<span onMouseDown={this.resize.bind(this, 3)}></span>
	      	   	</div>
	      	   	<div className="center">
	      	   		<span onMouseDown={this.resize.bind(this, 4)}></span>
	      	   		<span onMouseDown={this.resize.bind(this, 5)}></span>
	      	   	</div>
	      	   	<div className="bottom">
	      	   		<span onMouseDown={this.resize.bind(this, 6)}></span>
	      	   		<span onMouseDown={this.resize.bind(this, 7)}></span>
	      	   		<span onMouseDown={this.resize.bind(this, 8)}></span>
	      	   	</div>
	      	   </div> : null}
	      	</div>
      	);
  }
}

IPhone.defaultProps = {
};

export default IPhone;
