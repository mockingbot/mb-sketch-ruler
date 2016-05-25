require('normalize.css/normalize.css');
require('styles/App.css');

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

	moveEvent(e){
		var deltaX = e.clientX - this.startX
		var deltaY = e.clientY - this.startY
		// console.log(deltaX, deltaY)
		this.props.onMove(deltaX, deltaY)

		this.startX = e.clientX;
		this.startY = e.clientY;
	}
	
	componentDidMount() {
		//事件函数bind(this)以后
		this.fn = this.moveEvent.bind(this)
	}

	componentWillUnmount(){
	} 
	
	dragStart(e){
		// e.preventDefault();
		this.startX = e.clientX;
		this.startY = e.clientY;

		document.addEventListener('mousemove', this.fn)
		
		var func = () => {
			document.removeEventListener('mousemove', this.fn)
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
		console.log(iphoneStyle)

	    return (
	      	<div className="iphone" 
	      	  style={iphoneStyle}>
	      	  <div className="header"
	      	    onMouseDown={this.dragStart.bind(this)}
	      	    onDoubleClick={this.allowEdit.bind(this)}
	      	    onBlur={this.forbidEdit.bind(this)}
	      	    contentEditable={this.state.editable}>iPhone5s</div>
	      	</div>
      	);
  }
}

IPhone.defaultProps = {
};

export default IPhone;
