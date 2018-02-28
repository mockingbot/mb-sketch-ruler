import PropTypes from 'prop-types'
import React, { Component } from 'react'

import CanvasRuler from './CanvasRuler'
import Line from './Line'

export default class RulerWrapper extends Component {
  constructor () {
    super()
    this.state = {
      showIndicator: false,
      value: 0
    }
  }
  handleIndicatorShow = (value) => this.setState({ showIndicator: true, value })
  handleIndicatorMove = (value) => this.setState({ value })
  handleIndicatorHide = () => this.setState({ showIndicator: false })
  handleNewLine = (e) => {
    const { vertical, scale, start, lines, onLineChange } = this.props
    const { offsetX, offsetY } = e.nativeEvent
    const value = start + (vertical ? offsetY : offsetX)
    lines.push(value / scale >> 0)
    onLineChange(lines, vertical)
  }
  handleLineChange = (value, index) => {
    // 左右或上下超出时, 删除该条对齐线
    const { start, width, height } = this.props
    const offset = value - start
    const maxOffset = this.vertical ? height : width

    if (offset < 0 || offset > maxOffset) {
      this.handleLineRemove(index)
    } else {
      const { lines, onLineChange } = this.props
      lines[index] = value
      onLineChange(lines, this.vertical)
    }
  }
  handleLineRemove = (index) => {
    const { lines, onLineChange } = this.props
    lines.splice(index, 1)
    onLineChange(lines, this.vertical)
  }
  render () {
    const { vertical, scale, width, height, start, selectStart, selectLength, lines, perWidth, canvasConfigs } = this.props
    const { showIndicator, value } = this.state
    const className = vertical ? 'v-container' : 'h-container'
    const indicatorStyle = vertical ? { top: value } : { left: value }
    const indicatorValue = (start + value) / scale >> 0

    return (
      <div className={className}>
        <CanvasRuler
          vertical={vertical}
          scale={scale}
          width={width}
          height={height}
          start={start}
          selectStart={selectStart}
          selectLength={selectLength}
          perWidth={perWidth}
          canvasConfigs={canvasConfigs}
          onAddLine={this.handleNewLine}
          onIndicatorShow={this.handleIndicatorShow}
          onIndicatorMove={this.handleIndicatorMove}
          onIndicatorHide={this.handleIndicatorHide}
        />
        <div className="lines">
          {
            lines.map((v, i) =>
              <Line
                key={i}
                index={i}
                value={v >> 0}
                scale={scale}
                offset={-start}
                vertical={vertical}
                onChange={this.handleLineChange}
                onRemove={this.handleLineRemove}
              />
            )
          }
        </div>
        {
          showIndicator &&
          <div className="indicator" style={indicatorStyle}>
            <span className="value">{indicatorValue}</span>
          </div>
        }
      </div>
    )
  }
}
RulerWrapper.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  start: PropTypes.number,
  lines: PropTypes.array,
}
