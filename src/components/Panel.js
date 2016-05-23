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
  		//iphone的位置
  		iphonePos : {
  			x: 0,
  			y: 0,
  		},
  		//iphone的大小
  		size : {
  			width: this.state.size.width + 1,
  			height: 568
  		}
  	})
  }

  // 	boardPos : {
  				// 		x: -240,
  				// 		y: -100
  				// 	},
  				// 	//iphone的位置
  				// 	iphonePos : {
  				// 		x: 0,
  				// 		y: 0,
  				// 	},
  				// 	//iphone的大小
  				// 	size : {
  				// 		width: this.state.size.width + 1,
  				// 		height: 568
  				// 	}
  handleMove(e){
  	// console.log(e.deltaX)
  	e.preventDefault();
  	if(flag){
  		// flag = false;
  		var deltaX = e.deltaX;
  		var deltaY = e.deltaY;
  		if(Math.abs(deltaX) > Math.abs(deltaY) + 2){
  			if(deltaX > 0){
  				// console.log("画板向左",deltaX)
  				// var boardPos = this.state.boardPos;
  				// this.setState(Object.assign({}, this.state, {
  				// 	boardPos:{
  				// 		x : boardPos.x + deltaX,
  				// 		y: boardPos.y
  				// 	}
  				// }))
  				
  			}else{
				// console.log("画板向右",deltaX)
  			}
  			var boardPos = this.state.boardPos;
			this.setState(Object.assign({}, this.state, {
				boardPos:{
					x : boardPos.x + deltaX,
					y : boardPos.y
				}
			}))
  			
  		}else if(Math.abs(deltaY) > Math.abs(deltaX) + 2){
  			if(deltaY > 0){
  				// console.log("画板向上",deltaY)
  			}else{
  				// console.log("画板向下",deltaY)
  			}
  		}
  		
  		
  	}
  	// console.log(e)
  	// console.log(e.deltaX, e.deltaY)
  	

  }
  componentDidMount(){
  	
  }

  render() {
  	// var x = this.state.position.x;
  	// var y = this.state.position.y;
  	
  	flag = true;
    return (
      <div className="container">
      	<HorRuler start={this.state.boardPos.x} posX={this.state.iphonePos.x} width={this.state.size.width} />
       	<VerRuler start={this.state.boardPos.y} posY={this.state.iphonePos.y} height={this.state.size.height} />
        <Board position={this.state.boardPos} 
        	iphonePos={this.state.iphonePos} 
        	size={this.state.size}
        	handleClick={this.handleClick.bind(this)}
        	handleMove={this.handleMove.bind(this)}/>
      </div>
    );
  }
}

Panel.defaultProps = {
};

export default Panel;
