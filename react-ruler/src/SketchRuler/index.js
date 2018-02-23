import PropTypes from 'prop-types'
import React, { Component } from 'react'
import HorRuler from './components/HorRuler'
import VerRuler from './components/VerRuler'

import { getPixelRatio, contextTypes } from './utils'

import './index.css'

export default class SketchRuler extends Component {
  getChildContext () {
    const { props } = this
    return {
      perWidth: props.perWidth,
      scale: props.perWidth / 10,
      fontScale: 0.83, // 10 / 12
      ratio: getPixelRatio(),
      bgColor: props.bgColor,
      fgColor: props.fgColor,
      fontColor: props.fontColor,
      shadowColor: props.shadowColor,
      onLineChange: this.onLineChange
    }
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
    const {
      thick, width, height, bgColor, horLineArr,
      verLineArr, shadow, startX, startY, cornerActive, onCornerClick
    } = this.props
    const { x, y, width: w, height: h } = shadow

    return (
      <div id="mb-ruler" className="mb-ruler">
        <HorRuler width={width} height={thick} start={startX} lines={horLineArr} select={{ x, width: w }} />
        <VerRuler width={thick} height={height} start={startY} lines={verLineArr} select={{ y, height: h }} />
        <a className={`corner${cornerActive ? ' active' : ''}`} style={{ backgroundColor: bgColor }} onClick={onCornerClick} />
      </div>
    )
  }
}
SketchRuler.childContextTypes = contextTypes
SketchRuler.propTypes = {
  thick: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  bgColor: PropTypes.string,
  startX: PropTypes.number,
  startY: PropTypes.number,
  shadow: PropTypes.object,
  horLineArr: PropTypes.array,
  verLineArr: PropTypes.array,
  handleLine: PropTypes.func,
  cornerActive: PropTypes.bool,
  onCornerClick: PropTypes.func,
}
SketchRuler.defaultProps = {
  thick: 20,
  bgColor: '#F9FAFB', // 背景颜色
  fgColor: '#DEDEE4', // 刻度颜色
  fontColor: '#8D9EA7', // 字体颜色
  shadowColor: '#F2F2F3', // 阴影颜色
  horLineValue: [100, 200],
  verLineValue: [100, 200],
  startX: 0,
  startY: 0,
  perWidth: 10,
  ratio: getPixelRatio(),
  shadow: {
    x: 200,
    y: 100,
    width: 200,
    height: 400
  }
}
