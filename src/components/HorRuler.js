require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

/*
 * 2016.5.23 
 * iny
 * 水平标尺
 */
class HorRuler extends React.Component {
  render() {
    return (
       <canvas className="horRuler"></canvas>
    );
  }
}

HorRuler.defaultProps = {
};

export default HorRuler;
