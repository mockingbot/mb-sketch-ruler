require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

/*
 * 2016.5.23 
 * iny
 * 垂直标尺
 */
class VerRuler extends React.Component {
  
  render() {
    return (
      <canvas className="verRuler"></canvas>
    );
  }
}

VerRuler.defaultProps = {
};

export default VerRuler;
