require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import HorRuler from './HorRuler';
import VerRuler from './VerRuler';
import Board from './Board'

/*
 * 2016.5.23 
 * iny
 * 这里是组件的主区域
 */

 var flag = true;
class Panel extends React.Component {
  
  constructor(){
  	super();
  	this.state = {
  		//横、纵标尺的起始坐标值
  		boardPos : {
  			x: -240,
  			y: -100
  		},
  		//iphone的位置
  		iphonePos : {
  			x: 0,
  			y: 0,
  		},
  		//iphone的大小
  		size : {
  			width: 320,
  			height: 568
  		}
  	}
  }

  handleClick(){
  	this.setState({
  		boardPos : {
  			x: -240,
  			y: -100
  		},
  		iphonePos : {
  			x: 0,
  			y: 0,
  		},
  		size : {
  			width: this.state.size.width + 1,
  			height: 568
  		}
  	})
  }

  
  handleMove(e){
  	// console.log(e.deltaX)
  	e.preventDefault();
  	
  		var deltaX = e.deltaX;
  		var deltaY = e.deltaY;
  		if(Math.abs(deltaX) > Math.abs(deltaY) + 1){
  		// 	if(deltaX > 0){
  		// 		console.log("画板向左",deltaX)
  		// 	}else{
		//		console.log("画板向右",deltaX)
  		// 	}
  			var boardPos = this.state.boardPos;
  			var newX = boardPos.x + deltaX;

  			if(newX < -9999 || newX + this.props.width > 9999){

  				//很明显手机的宽度不是所需宽度(应该是窗口宽度,考虑把窗口也作为state,传入尺子
  				//,用于在外部控制尺子的宽高的同时,也方便在窗口resize时通过改变state的方式自动控制重绘
  				return
  			}
			this.setState(Object.assign({}, this.state, {
				boardPos:{
					x : newX,
					y : boardPos.y
				}
			}))
  			
  		}else if(Math.abs(deltaY) > Math.abs(deltaX) + 1){
  			// if(deltaY > 0){
  			//		console.log("画板向上",deltaY)
  			// }else{
  			//		console.log("画板向下",deltaY)
  			// }
  			var boardPos = this.state.boardPos;
  			var newY = boardPos.y + deltaY;
  			if(newY < -9999 || newY + this.state.size.height > 9999){
  				return
  			}
			this.setState(Object.assign({}, this.state, {
				boardPos:{
					x : boardPos.x,
					y : newY
				}
			}))
  		}
  }

  moveIphone(deltaX, deltaY){
  	console.log(deltaX, deltaY)
  	// console.log(pos.x - 30 + this.state.boardPos.x,pos.y + this.state.boardPos.y)
  	this.setState(Object.assign({}, this.state, {
  		iphonePos:{
  			x : this.state.iphonePos.x + deltaX,
  			y : this.state.iphonePos.y + deltaY
  		}
  	}))
  }

  render() {
  	// var x = this.state.position.x;
  	// var y = this.state.position.y;
  	
  	console.log('get: '+this.props.width)
    return (
      <div className="container">
      	<HorRuler start={this.state.boardPos.x}
      		posX={this.state.iphonePos.x} 
      		width={this.state.size.width} 
      		domWidth={this.props.width}
      		domHeight={30}/>
       	<VerRuler start={this.state.boardPos.y} 
       		posY={this.state.iphonePos.y} 
       		height={this.state.size.height} 
       		domWidth={30}
       		domHeight={this.props.height}/>
        <Board position={this.state.boardPos} 
        	iphonePos={this.state.iphonePos} 
        	size={this.state.size}
        	handleClick={this.handleClick.bind(this)}
        	handleMove={this.handleMove.bind(this)}
        	move={this.moveIphone.bind(this)}
        	/>
      </div>
    );
  }
}

Panel.defaultProps = {
};

export default Panel;
