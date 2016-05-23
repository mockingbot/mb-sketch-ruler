require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

/*
 * 2016.5.23 
 * iny
 * 水平标尺
 */
class Board extends React.Component {
  
  // <Board position={this.state.boardPos} iphonePos={this.state.iphonePos} size={this.state.size}/>

  handleClick(){
    this.props.handleClick();
  }
  touchStart(e){
    console.log(e)
  }
  touchEnd(e){
    console.log(e)
  }
  render() {

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
            onWheel={this.props.handleMove}>
        <div className="panel" style={panelStyle}>
          <div className="test" style={iphoneStyle} onClick={this.handleClick.bind(this)}></div>
        </div>
       </div>
    );
  }
}

Board.defaultProps = {
};

export default Board;
