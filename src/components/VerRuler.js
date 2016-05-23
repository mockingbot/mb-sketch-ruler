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
  	  	canvas.width = 30;
  	  	canvas.height = 800;
  	  	var ctx = canvas.getContext('2d');
  	  	ctx.lineWidth = 1;
  	  	ctx.strokeStyle = '#999'
  	  	for(let i = 0 ; i < 800 ; i += 10){
  	  		ctx.moveTo(30, i)
  	  		if(i%50 === 0){
  	  			ctx.fillText(i, 5, i+2)
  	  			ctx.lineTo(0, i)
  	  		}else{
  	  			ctx.lineTo(20, i)
  	  		}
  		  	ctx.stroke();	
  	  	}
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
