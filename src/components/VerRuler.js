require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

/*
 * 2016.5.23 
 * iny
 * 垂直标尺
 */
class VerRuler extends React.Component {

	componentDidMount(){
		  var canvas = this.refs.ruler;
		  var rect = canvas.getBoundingClientRect();
		  this.width = rect.width;
		  this.height = rect.height;
		  canvas.width = this.width;
	  	  canvas.height = this.height;
		  
		  this.ctx = canvas.getContext('2d');
		  
		  this.drawRuler();
	}

  drawRuler(){
  		//标尺起始x坐标
	  	var start = this.props.start;
	  	//手机的x坐标
	  	var posY = this.props.posY;
	  	//手机的宽度
	  	var height = this.props.height;
	  	// console.log(start, pos, width)

	  	var ctx = this.ctx;

	  	//绘制刻度尺的背景
	  	ctx.fillStyle = '#F5F5F5'
	  	ctx.fillRect(0, 0, this.width, this.height);

	  	//设置底部刻度的样式
	  	ctx.lineWidth = 1;
	  	ctx.strokeStyle = '#999'
	  	//绘制底部刻度,之前因为没决定用canvas,用dom的border画的,又慢又要计算定位,太挫了,还是用canvas画统一一点
	  	ctx.beginPath();
	  	//border-top
	  	ctx.moveTo(0, 0);
	  	ctx.lineTo(this.width, 0);
	  	//border-right
	  	ctx.moveTo(this.width, 0);
	  	ctx.lineTo(this.width, this.height);
	  	ctx.closePath();
	  	ctx.stroke();

		ctx.translate(0, 100);
  	  	ctx.lineWidth = 1;
  	  	ctx.strokeStyle = '#999'


  	  	//先根据iphone尺寸绘制出对应的高度
  	  	ctx.fillStyle = '#CCC'
  	  	ctx.fillRect(0, posY, this.width, height);

  	  	for(let i = -100 ; i < 700 ; i += 10){
  	  		ctx.moveTo(30, i);
  	  		if(i % 100 === 0){
  	  			//这里先保存一下状态
  	  			ctx.save();
  	  			//将原点转移到当前画笔所在点
  	  			ctx.translate(15, i-2)
  	  			//旋转 -90 度
  	  			ctx.rotate(-Math.PI/2)
  	  			ctx.fillStyle = '#000'
  	  			//画文字
  	  			ctx.fillText(i, 0, 0)
  	  			//回复刚刚保存的状态
  	  			ctx.restore();
  	  			ctx.lineTo(0, i)
  	  		}else{
  	  			ctx.lineTo(20, i)
  	  		}
  		  	ctx.stroke();	
  	  	}

		// ctx.fillText('AAAA', 15, 15)
		// ctx.rotate(Math.PI/2)
	  	// var ctx = canvas.getContext('2d');
	  	// ctx.translate(240,0)
	  	// ctx.lineWidth = 1;
	  	// ctx.strokeStyle = '#999'
	  	// for(let i = -240 ; i < 500 ; i += 10){
	  	// 	ctx.moveTo(i, 30)
	  	// 	if(i % 100 === 0){
	  	// 		ctx.fillText(i, i+2, 15)
	  	// 		ctx.lineTo(i, 0)
	  	// 	}else{
	  	// 		ctx.lineTo(i, 20)
	  	// 	}
		  // 	ctx.stroke();	
	  	// }
	  	// var canvas = this.refs.ruler;
	  	// canvas.width = 300;
	  	// canvas.height = 800;
	  	// var ctx = canvas.getContext('2d');
	  	// ctx.translate(0,600)
	  	// ctx.fillRect(0, 0, 50, 50)
	   //  // ctx.rotate(Math.PI/3);
	  	// ctx.fillRect(50, 50, 100, 200)
	  	// ctx.fillRect(0, 0, 100, 200)
	  	// ctx.fillRect(-100, 100, 100, 200)
	  	
	  	// ctx.lineWidth = 1;
	  	// ctx.strokeStyle = '#999'
	  	// for(let i = -240 ; i < 500 ; i += 10){
	  	// 	ctx.moveTo(i, 30)
	  	// 	if(i % 100 === 0){
	  	// 		ctx.fillText(i, i+2, 15)
	  	// 		ctx.lineTo(i, 0)
	  	// 	}else{
	  	// 		ctx.lineTo(i, 20)
	  	// 	}
		  // 	ctx.stroke();	
	  	// }
  // 	  	var canvas = this.refs.ruler;
  // 	  	canvas.width = 30;
  // 	  	canvas.height = 800;
  // 	  	
  }

  componentWillReceiveProps(){
  	// console.log("msg")
  	this.drawRuler();
  }
  render() {
    return (
      <canvas ref="ruler" id="verRuler"></canvas>
    );
  }
}

VerRuler.defaultProps = {
};

export default VerRuler;
