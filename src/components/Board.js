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

    
    if(this.props.showShadow)
      return

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

    this.startX = e.clientX;
    this.startY = e.clientY

    this.props.moveOrigin(deltaX, deltaY);
  }
  
  hideShadow(e){
    var iphones = this.props.iphones
    //判断事件源,若不是来自背景面板(如来自手机)
    if(e.target !== this.refs.background)
      //则不处理
      return
    //若是来自背景面板,通知上层取消阴影
    this.props.hideShadow();
    
  }

  render() {

    var panelStyle = {
      top: - this.props.position.y,
      left:  - this.props.position.x
    }
    
    return (
       <div ref="background"
            className="background"
            style={this.bgStyle}
            onClick={this.hideShadow.bind(this)}
            onMouseDown={this.dragStart.bind(this)}
            onWheel={this.props.handleMove}
            onChange={this.props.handleMove}>
        <div className="origin" style={panelStyle}>
          {/*this.props.iphonePos.x == 0 && this.props.iphonePos.y == 0 ?
            <span className="tooltip">位于原点</span> : null  
          */}
          
          {this.props.iphones.map((iphone, index) => {
            return <IPhone key={index}
              index={index}
              onMove={this.props.moveIPhone}
              onResize={this.props.resizeIPhone}
              onActive={this.props.showShadow}
              onBlur={this.props.hideShadow}
              detail={iphone}
              />
          })}
        </div>
       </div>
    );
  }
}

Board.defaultProps = {
};

export default Board;
