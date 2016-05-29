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
    this.bgStyle = {
      width: '100%',
      height: '100%',
      backgroundColor: '#E7E7E7'
    }
  }

  componentDidMount(){
    this.setPosition = this.setPosition.bind(this)
  }
  
  //拖动背景部分时,移动画布
  dragStart(e){
    this.startX = e.clientX;
    this.startY = e.clientY;

    document.addEventListener('mousemove', this.setPosition)
    var func = () => {
      document.removeEventListener('mousemove', this.setPosition)
      document.removeEventListener('mouseup', func)
    }

    document.addEventListener('mouseup', func)
  }

  setPosition(e){
    e.preventDefault()
    var deltaX = e.clientX - this.startX
    var deltaY = e.clientY - this.startY

    this.props.moveOrigin(deltaX, deltaY);
  }
  
  touchEnd(e){
    console.log(e)
  }





  render() {

    var panelStyle = {
      top: - this.props.position.y,
      left:  - this.props.position.x
    }
    
    return (
       <div className="background"
            style={this.bgStyle}
            onMouseDown={this.dragStart.bind(this)}
            onMouseUp={this.touchEnd.bind(this)}
            onWheel={this.props.handleMove}
            onChange={this.props.handleMove}>
        <div className="origin" style={panelStyle}>
          {this.props.iphonePos.x == 0 && this.props.iphonePos.y == 0 ?
            <span className="tooltip">位于原点</span> : null  
          }
          <IPhone onMove={this.props.moveIPhone}
            onResize={this.props.resizeIPhone}
            onActive={this.props.showShadow}
            onBlur={this.props.hideShadow}
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
