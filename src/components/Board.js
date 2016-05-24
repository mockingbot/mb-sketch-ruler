require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

/*
 * 2016.5.23 
 * iny
 * 水平标尺
 */
class Board extends React.Component {
  
  constructor(){
    super();
    this.state = {
      //横、纵标尺的起始坐标值
      flag : false
    }
  }
  handleClick(){
    // this.props.handleClick();
  }
  touchStart(e){
    console.log(e)
  }
  touchEnd(e){
    console.log(e)
  }
  dragStart(e){
    e.preventDefault();
    
    this.setState(Object.assign({}, this.state, {
      flag : true,
      startX : e.clientX,
      startY : e.clientY
    }))
    
    console.log(e.clientX, e.clientY)
  }

  componentDidMount(){

    document.addEventListener('mousemove', (e) => {
      if(this.state.flag){
        var deltaX = e.clientX - this.state.startX
        var deltaY = e.clientY - this.state.startY
        this.props.move(deltaX, deltaY)
      }
      this.setState(Object.assign({}, this.state, {
        startX : e.clientX,
        startY : e.clientY
      }))
    })

    document.addEventListener('mouseup', (e) => {
      this.setState(Object.assign({}, this.state, {
        flag : false
      }))
    })
  }
  
  render() {
    console.log("render")

    var bgStyle = {
      width: 800,
      height: 800,
      backgroundColor: 'rgba(255,0,0,0.1)'
    }
    var panelStyle = {
      top: - this.props.position.y,
      left:  - this.props.position.x
    }
    var iphoneStyle = {
      top: this.props.iphonePos.y,
      left: this.props.iphonePos.x,
      width: this.props.size.width,
      height: this.props.size.height
    }
    
  	// this.drawRuler();
    return (
       <div className="background"
            style={bgStyle}
            onTouchStart={this.touchStart.bind(this)}
            onTouchEnd={this.touchEnd.bind(this)}
            onWheel={this.props.handleMove}
            onChange={this.props.handleMove}>
        <div className="panel" style={panelStyle}>
          <div className="iphone" 
            style={iphoneStyle} 
            onClick={this.handleClick.bind(this)}>
            <div className="header"
              onMouseDown={this.dragStart.bind(this)}>iPhone5s</div>
          </div>
        </div>
       </div>
    );
  }
}

Board.defaultProps = {
};

export default Board;
