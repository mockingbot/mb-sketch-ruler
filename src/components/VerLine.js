import React from 'react';
require('styles/baseLine.css');
/*
 * 2016.6.1
 * iny
 * 竖线
 */
class VerLine extends React.Component {
  
  constructor(){
    super();
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
  
  touchEnd(e){
    console.log(e)
  }

  render() {

    var style = {
      position: 'absolute',
      top: 0,
      left:  30 - this.props.left + 'px',
      outline: '1px solid red',
      height: '100%'
    }
    
    return (
       <span className="verLine"
        style={style}
       ></span>
    );
  }
}

VerLine.defaultProps = {
};

export default VerLine;
