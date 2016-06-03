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

  componentWillReceiveProps(nextProps){
    if(nextProps.offsetY !== this.props.offsetY
      || nextProps.top !== this.props.top){
      return true;
    }
    return false;
  }

  render() {

    var top = this.props.offsetY - this.props.top;

    if(!(top > 0 && top < document.body.clientHeight))
      return null;

    console.log(top)
    var style = {
      position: 'absolute',
      height: '2px',
      width: '100%',
      backgroundColor: 'red',
      left: 0,
      //还要减去高度的一半
      top: 30 + top - 1 + 'px',
    }
    
    return (
        <div className="horLine"
          style={style}
        ><span className="horNum">{this.props.offsetY}</span></div>
    );
  }
}

HorLine.defaultProps = {
};

export default HorLine;
