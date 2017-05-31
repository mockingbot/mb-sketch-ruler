import React, { Component, PropTypes } from 'react'
import HorRuler from './components/HorRuler'
import VerRuler from './components/VerRuler'
// import HorRuler from './HorRuler'
// import VerRuler from './VerRuler'

import { getPixelRatio, contextTypes } from './utils'

import './index.css'

export default class SketchRuler extends Component {
  getChildContext () {
    const { props } = this
    return {
      perWidth: props.perWidth,
      scale: props.scale,
      fontScale: 0.83, // 10 / 12
      ratio: getPixelRatio(),
      bgColor: props.bgColor,
      fgColor: props.fgColor,
      fontColor: props.fontColor,
      shadowColor: props.shadowColor,
      onLineChange: this.onLineChange
    }
  }
  handleCornerClick = (e) => {
    e.preventDefault()
    alert('click on corner')
  }
  onLineChange = (arr, vertical) => {
    const { horLineArr, verLineArr, handleLine } = this.props
    const newLines = {
      h: vertical ? horLineArr: arr,
      v: vertical ? arr : verLineArr
    }
    handleLine(newLines)
  }

  render () {
    const { bgColor, horLineArr, verLineArr, shadow, startX, startY, onCornerClick } = this.props
    const { x, y, width, height } = shadow
    return (
      <div className="mb-ruler" ref="ruler">
        <HorRuler start={startX} lines={horLineArr} select={{ x, width }} />
        <VerRuler start={startY} lines={verLineArr} select={{ y, height }} />
        <a className="corner" style={{ backgroundColor: bgColor }} onClick={onCornerClick} />
      </div>
    )
  }
}
SketchRuler.childContextTypes = contextTypes
SketchRuler.propTypes = {
  bgColor: PropTypes.string,
  startX: PropTypes.number,
  startY: PropTypes.number,
  shadow: PropTypes.object,
  horLineArr: PropTypes.array,
  verLineArr: PropTypes.array,
  handleLine: PropTypes.func,
  onCornerClick: PropTypes.func,
}
SketchRuler.defaultProps = {
  thick: 20,
  bgColor: '#F5F5F7',
  fgColor: '#DADADC',
  fontColor: '#8B8C90',
  lineColor: '#FF0000',
  shadowColor: '#E8E8EA',
  horLineValue: [100, 200],
  verLineValue: [100, 200],
  startX: 0,
  startY: 0,
  perWidth: 10,
  scale: 1,
  ratio: getPixelRatio(),
  shadow: {
    x: 200,
    y: 100,
    width: 200,
    height: 400
  }
}