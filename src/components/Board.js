require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import IPhone from './IPhone'
/*
 * 2016.5.23 
 * iny
 * 画板
 */
class Board extends React.Component {
  
  constructor(){
    super();
  }
  
  touchStart(e){
    console.log(e)
  }
  touchEnd(e){
    console.log(e)
  }

  componentDidMount(){

  }

  render() {

    var bgStyle = {
      width: '100%',
      height: '100%',
      backgroundColor: '#E7E7E7'
    }
    var panelStyle = {
      top: - this.props.position.y,
      left:  - this.props.position.x
    }
    
    return (
       <div className="background"
            style={bgStyle}
            onTouchStart={this.touchStart.bind(this)}
            onTouchEnd={this.touchEnd.bind(this)}
            onWheel={this.props.handleMove}
            onChange={this.props.handleMove}>
        <div className="origin" style={panelStyle}>
          {this.props.iphonePos.x == 0 && this.props.iphonePos.y == 0 ?
            <span className="tooltip">位于原点</span> : null  
          }
          <IPhone onMove={this.props.moveIPhone}
            onResize={this.props.resizeIPhone}
            top={this.props.iphonePos.y}
            left={this.props.iphonePos.x}
            width={this.props.size.width}
            height={this.props.size.height}/>
        </div>
       </div>
    );
  }
}

Board.defaultProps = {
};

export default Board;
