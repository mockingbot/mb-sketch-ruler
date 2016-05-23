require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import HorRuler from './HorRuler';
import VerRuler from './VerRuler';

/*
 * 2016.5.23 
 * iny
 * 这里是组件的主区域
 */
class Panel extends React.Component {
  
  constructor(){
  	super();
  	this.state = {
  		position : {
  			x: 200,
  			y: 100
  		},
  		rect : {
  			width: 200,
  			height: 300
  		}
  	}
  }

  componentDidMount(){
  	console.log(this.refs.panel)
  }

  render() {
  	var x = this.state.position.x;
  	var y = this.state.position.y;
    return (
      <div className="container">
      	<HorRuler position={{x: x, y: y}}></HorRuler>
       	<VerRuler></VerRuler>
        <div className="panel">
        	<div className="test"></div>
        </div>
      </div>
    );
  }
}

Panel.defaultProps = {
};

export default Panel;
