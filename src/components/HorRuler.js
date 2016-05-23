require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

/*
 * 2016.5.23 
 * iny
 * 水平标尺
 */
class HorRuler extends React.Component {
  
  componentDidMount(){
  	  var canvas = this.refs.ruler;
  	  canvas.width = 800;
  	  canvas.height = 30;
  	  
  	  this.ctx = canvas.getContext('2d');
  	  
  	  this.drawRuler();
  }
  drawRuler(){
  	var start = this.props.start
  	var pos = this.props.pos
  	var width = this.props.width

  	console.log(start, pos, width)

  		// var canvas = this.refs.ruler;
  	  	var ctx = this.ctx;
  	  	ctx.clearRect(0, 0, 800, 30);
  	  	
  	  	ctx.lineWidth = 1;
  	  	ctx.strokeStyle = '#999'

  	  	//移动画布原点,方便绘制
  	  	ctx.save();
  	  	ctx.translate(-start,0)
  	  	
  	  	//先根据iphone尺寸绘制当前的artboard的宽度
  	  	ctx.fillStyle = '#CCC'
  	  	ctx.fillRect(pos, 0, width, 30)

  	  	//再画刻度和文字
  	  	for(let i = start ; i < 500 ; i += 10){
  	  		ctx.moveTo(i, 30)
  	  		if(i % 100 === 0){
  	  			ctx.fillStyle = '#000'
  	  			ctx.fillText(i, i+2, 15)
  	  			ctx.lineTo(i, 0)
  	  		}else{
  	  			ctx.lineTo(i, 20)
  	  		}
  		  	ctx.stroke();	
  	  	}
  	  	ctx.restore();
  }

  render() {
  	if(this.ctx){
  		this.drawRuler();	
  	}
  	
    return (
       <canvas ref="ruler" id="horRuler"></canvas>
    );
  }
}

HorRuler.defaultProps = {
};

export default HorRuler;
