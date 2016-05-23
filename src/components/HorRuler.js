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
  	  	var ctx = canvas.getContext('2d');
  	  	ctx.lineWidth = 1;
  	  	ctx.strokeStyle = '#999'
  	  	for(let i = 0 ; i < 800 ; i += 10){
  	  		ctx.moveTo(i, 30)
  	  		if(i%50 === 0){
  	  			ctx.fillText(i, i+2, 15)
  	  			ctx.lineTo(i, 0)
  	  		}else{
  	  			ctx.lineTo(i, 20)
  	  		}
  		  	ctx.stroke();	
  	  	}
  }
  drawRuler(){
  	
  	
  }

  render() {
  	// this.drawRuler();
    return (
       <canvas ref="ruler" id="horRuler"></canvas>
    );
  }
}

HorRuler.defaultProps = {
};

export default HorRuler;
