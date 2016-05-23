require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import HorRuler from './HorRuler';
import VerRuler from './VerRuler';

/*
 * 2016.5.23 
 * iny
 * 这里是组件的主区域
 */
class Panel extends React.Component {
  render() {
    return (
      <div className="container">
      	<HorRuler></HorRuler>
       	<VerRuler></VerRuler>
        <canvas className="panel"></canvas>
      </div>
    );
  }
}

Panel.defaultProps = {
};

export default Panel;
