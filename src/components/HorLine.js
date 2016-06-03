import React from 'react';
require('styles/baseLine.css');
/*
 * 2016.6.1
 * iny
 * 横线
 */
class HorLine extends React.Component {
  
  constructor(){
    super();
  }

  componentDidMount(){
    this.setPosition = this.setPosition.bind(this)
  }
  
  componentWillReceiveProps(nextProps){
    if(nextProps.offsetY !== this.props.offsetY
      || nextProps.top !== this.props.top){
      return true;
    }
    return false;
  }

  move(e){
    // e.preventDefault();
    this.startY = e.clientY;

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
    var deltaY = e.clientY - this.startY
    console.log(deltaY)
    this.props.setOffset(0, deltaY)

    this.startY = e.clientY;
  }

  render() {

    var top = this.props.offsetY - this.props.top;

    var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; 

    if(!(top > 0 && top < height))
      return null;

    var style = {
      position: 'absolute',
      width: '100%',
      // height: '2px',
      // backgroundColor: 'red',
      //1px有时渲染不出,改用border实现
      border: '1px solid red',
      //如果是虚线的话,可能要加上下面的
      // borderTop: 'none',
      // botderBotom: 'none',
      left: 0,
      top: 30 + top - 1 + 'px',
    }
    
    return (
        <div className="horLine"
          style={style}
          onMouseDown={this.move.bind(this)}>
          <span className="horNum">{this.props.offsetY}</span>
        </div>
    );
  }
}

HorLine.defaultProps = {
};

export default HorLine;
