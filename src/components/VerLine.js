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
  
  componentWillReceiveProps(nextProps){
    if(nextProps.offsetX !== this.props.offsetX
      || nextProps.left !== this.props.left){
      return true;
    }
    return false;
  }

  move(e){
    // e.preventDefault();
    this.startX = e.clientX;

    document.addEventListener('mousemove', this.setPosition)
    var func = () => {
      document.removeEventListener('mousemove', this.setPosition)
      document.removeEventListener('mouseup', func)
    }

    document.addEventListener('mouseup', func)
  }

  //设置位置
  setPosition(e){
    e.preventDefault()
    var deltaX = e.clientX - this.startX
    // console.log(deltaX, deltaY)
    this.props.setOffset(deltaX, 0)

    this.startX = e.clientX;
  }

  render() {

    var left = this.props.offsetX - this.props.left;
    // console.log(left)
    // 这里应该控制 超出左右边界都不绘制,提升效率
    if(!(left > 0 && left < document.body.clientWidth))
      return null;

    var style = {
      position: 'absolute',
      width: '2px',
      height: '100%',
      backgroundColor: 'red',
      top: 0,
      left:  30 + left  - 1 + 'px',
    }
    console.log("msg")
    
    return (
       <div className="verLine"
        style={style}
        onMouseDown={this.move.bind(this)}>
        <span className="verNum">{this.props.offsetX}</span>
       </div>
    );
  }
}

VerLine.defaultProps = {
};

export default VerLine;
