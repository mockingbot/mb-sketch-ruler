import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import RulerWrapper from './RulerWrapper'

import './index.css'

export default class SketchRuler extends PureComponent {
  constructor (props) {
    super(props)
    const { fontColor, shadowColor, bgColor, fgColor, ratio } = props
    this.canvasConfigs = {
      bgColor,
      fgColor,
      fontColor,
      shadowColor,
      ratio
    }
  }
  handleLineChange = (arr, vertical) => {
    const { horLineArr, verLineArr, handleLine } = this.props
    const newLines = vertical
      ? { h: horLineArr, v: [...arr] }
      : { h: [...arr], v: verLineArr }
    handleLine(newLines)
  }

  render () {
    const {
      width, height, scale, bgColor,
      thick, shadow, startX, startY, cornerActive,
      horLineArr, verLineArr, onCornerClick
    } = this.props

    const { x, y, width: w, height: h } = shadow

    const commonProps = {
      scale,
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
  scale: PropTypes.number,
  ratio: PropTypes.number,
  thick: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  bgColor: PropTypes.string,
  fgColor: PropTypes.string,
  fontColor: PropTypes.string,
  shadowColor: PropTypes.string,
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
  scale: 1,
  startX: 0,
  startY: 0,
  ratio: window.devicePixelRatio || 1,
  shadow: {
    x: 200,
    y: 100,
    width: 200,
    height: 400
  }
}
