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
  componentDidMount(){
  	
  }

  render() {
  	// var x = this.state.position.x;
  	// var y = this.state.position.y;
  	console.log("render")
    return (
      <div className="container">
      	<HorRuler start={this.state.boardPos.x} pos={this.state.iphonePos.x} width={this.state.size.width} />
       	<VerRuler start={this.state.boardPos.y} pos={this.state.iphonePos.y} height={this.state.size.height} />
        <Board position={this.state.boardPos} 
        	iphonePos={this.state.iphonePos} 
        	size={this.state.size}
        	handleClick={this.handleClick.bind(this)}/>
      </div>
    );
  }
}

Panel.defaultProps = {
};

export default Panel;
