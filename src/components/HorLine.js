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
  }
  
  touchEnd(e){
  }

  render() {

    console.log("render")
    var style = {
      position: 'absolute',
      height: '2px',
      width: '100%',
      backgroundColor: 'red',
      left: 0,
      //还要减去高度的一半
      top: 30 - this.props.top - 1 + 'px',
    }
    
    return (
        <div className="horLine"
          style={style}
        ><span className="horNum" style={{
          position: 'absolute',
          display: 'block',
          color: '#900',
          /* react的inline-style不会获得浏览器的优化
           (如translate变为GPU渲染的translate3d,直接写3d又存在不兼容的问题,
           效率起见,写到css文件里是最合适的*/
          // left: '35px',
          // bottom:'20px',
          // transform:'translateY(-50px) rotate(-90deg)'
          // transform:'translate3d(35px, -40px, 0) rotate(-90deg)'

        }}>123</span></div>
    );
  }
}

HorLine.defaultProps = {
};

export default HorLine;
