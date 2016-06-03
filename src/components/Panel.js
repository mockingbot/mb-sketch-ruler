require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import HorRuler from './HorRuler';
import VerRuler from './VerRuler';
import Board from './Board'
import HorLine from './HorLine'
import VerLine from './VerLine'

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
      iphones : [
        {
          title : 'iPhone 5/5S/5C',
          x : 200,
          y : 200,
          width : 200,
          height : 300
        },
        {
          title : 'box',
          x : 400,
          y : 0,
          width : 100,
          height : 100
        }
      ],
      activeIndex : 1,
  		showShadow: false
  	}
  }

  showShadow(index){
    
    this.setState(Object.assign({}, this.state, {
    	activeIndex: index
    }))
  }

  hideShadow(){

  	this.setState(Object.assign({}, this.state, {
  		activeIndex: -1
  	}))	
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
  			if(newY < -9999 || newY + this.props.height > 9999){
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

  moveIPhone(deltaX, deltaY, index = 0){
    console.log(arguments)
  	console.log(deltaX, deltaY, index)
  	var iphones = this.state.iphones;
    iphones[index].x = iphones[index].x + deltaX;
    iphones[index].y = iphones[index].y + deltaY;
  	this.setState(Object.assign({}, this.state, {
      iphones : iphones
  	}))
  }

  resizeIPhone(index, deltaX, deltaY, deltaWidth = 0, deltaHeight = 0){
  	var iphones = this.state.iphones;
  	iphones[index].x = iphones[index].x + deltaX;
    iphones[index].y = iphones[index].y + deltaY;
    iphones[index].width = iphones[index].width + deltaWidth;
    iphones[index].height = iphones[index].height + deltaHeight;

  	this.setState(Object.assign({}, this.state, {
      iphones : iphones
  	}))
  }

  drawCorner(){
  		var corner = this.refs.corner;
  		corner.style.position = 'absolute';
  		corner.style.width = '30px';
  		corner.style.height = '30px';
  		corner.width = 60;
  		corner.height = 60;
  		var ctx = corner.getContext('2d');

  		ctx.fillStyle = '#F5F5F5'
  		ctx.fillRect(0, 0, 60, 60);

  		ctx.lineWidth = 2;
  	  	ctx.strokeStyle = '#999'
  		ctx.moveTo(60, 0);
  		ctx.lineTo(60, 60);
  		ctx.moveTo(60, 60);
  		ctx.lineTo(0, 60);
  		ctx.stroke();
  }

  moveBoard(x, y){
  	// console.log(x, y)
    this.setState(Object.assign({}, this.state, {
      boardPos : {
        x: this.state.boardPos.x - x / 2,
        y: this.state.boardPos.y - y / 2
      }
    }))
    
  }

  drawVerLine(left){
    this.setState(Object.assign({}, this.state, {
      offsetX : left
    }))
  }

  drawHorLine(top){
    this.setState(Object.assign({}, this.state, {
      offsetY : top
    }))
  }

  setOffset(deltaX, deltaY){
    this.setState(Object.assign({}, this.state, {
      offsetX : this.state.offsetX + deltaX,
      offsetY : this.state.offsetY + deltaY
    }))
  }

  componentDidMount(){
  	this.drawCorner();
  }

  render() {
  	var activeItem = this.state.iphones[this.state.activeIndex] || {};

    return (
      <div className="container">
      	<canvas ref="corner"/>
      	<HorRuler start={this.state.boardPos.x}
      		domWidth={this.props.width}
      		domHeight={30}
          
          posX={activeItem.x} 
          width={activeItem.width} 
      		showShadow={this.state.activeIndex !== -1}
          handleClick={this.drawVerLine.bind(this)}/>
       	<VerRuler start={this.state.boardPos.y} 
       		domWidth={30}
       		domHeight={this.props.height}
          
          posY={activeItem.y} 
          height={activeItem.height} 
       		showShadow={this.state.activeIndex !== -1}
          handleClick={this.drawHorLine.bind(this)}/>
        <Board position={this.state.boardPos} 
        	iphonePos={this.state.iphonePos} 
          iphones={this.state.iphones}
        	size={this.state.size}
        	handleMove={this.handleMove.bind(this)}
        	moveIPhone={this.moveIPhone.bind(this)}
        	resizeIPhone={this.resizeIPhone.bind(this)}
        	showShadow={this.showShadow.bind(this)}

        	hideShadow={this.hideShadow.bind(this)}
        	moveOrigin={this.moveBoard.bind(this)}
        	/>
        
        <HorLine top={this.state.boardPos.y}
          offsetY={this.state.offsetY}
          setOffset={this.setOffset.bind(this)}/>
        <VerLine left={this.state.boardPos.x}
          offsetX={this.state.offsetX}
          setOffset={this.setOffset.bind(this)}/>

      </div>
    );
  }
}

Panel.defaultProps = {
};

export default Panel;
