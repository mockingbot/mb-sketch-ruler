import PropTypes from 'prop-types'
import React, { Component } from 'react'
import RulerWrapper from './components/RulerWrapper'

import { getPixelRatio } from './utils'

import './index.css'

const fontScale = 0.83

export default class SketchRuler extends Component {
  constructor (props) {
    super(props)
    const { fontColor, shadowColor, bgColor, fgColor, ratio } = props
    this.canvasConfigs = {
      bgColor,
      fgColor,
      fontColor,
      shadowColor,
      ratio,
      fontScale,
    }
  }
  handleLineChange = (arr, vertical) => {
    const { horLineArr, verLineArr, handleLine } = this.props
    const newLines = vertical
      ? { h: horLineArr, v: arr }
      : { h: arr, v: verLineArr}
    handleLine(newLines)
  }

  render () {
    const {
      width, height, perWidth, bgColor,
      thick, shadow, startX, startY, cornerActive,
      horLineArr, verLineArr, onCornerClick
    } = this.props

    const scale = perWidth / 10
    const { x, y, width: w, height: h } = shadow

    const commonProps = {
      scale,
      perWidth,
      canvasConfigs: this.canvasConfigs,
      onLineChange: this.handleLineChange
    }

    return (
      <div id="mb-ruler" className="mb-ruler">
        {/* 水平方向 */}
        <RulerWrapper width={width} height={thick} start={startX} lines={horLineArr} selectStart={x} selectLength={w} {...commonProps} />
        {/* 竖直方向 */}
        <RulerWrapper width={thick} height={height} start={startY} lines={verLineArr} selectStart={y} selectLength={h} vertical {...commonProps} />
        <a className={`corner${cornerActive ? ' active' : ''}`} style={{ backgroundColor: bgColor }} onClick={onCornerClick} />
      </div>
    )
  }
}
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
