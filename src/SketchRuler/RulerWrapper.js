import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import CanvasRuler from './CanvasRuler'
import Line from './Line'

export default class RulerWrapper extends PureComponent {
  constructor () {
    super()
    this.state = {
      isDraggingLine: false,
      showIndicator: false,
      value: 0
    }
  }
  handleIndicatorShow = (value) => !this.state.isDraggingLine && this.setState({ showIndicator: true, value })
  handleIndicatorMove = (value) => this.state.showIndicator && this.setState({ value })
  handleIndicatorHide = () => this.setState({ showIndicator: false })
  handleNewLine = (value) => {
    const { vertical, lines, onLineChange } = this.props
    lines.push(value)
    onLineChange(lines, vertical)
  }

  handleLineDown = () => this.setState({ isDraggingLine: true })
  handleLineRelease = () => this.setState({ isDraggingLine: false })
  handleLineChange = (value, index) => {
    // 左右或上下超出时, 删除该条对齐线
    const { vertical, start, scale, width, height } = this.props
    const offset = value - start
    const maxOffset = (vertical ? height : width) / scale

    if (offset < 0 || offset > maxOffset) {
      this.handleLineRemove(index)
    } else {
      const { lines, onLineChange } = this.props
      lines[index] = value
      onLineChange(lines, vertical)
    }
  }
  handleLineRemove = (index) => {
    const { vertical, lines, onLineChange } = this.props
    lines.splice(index, 1)
    onLineChange(lines, vertical)
  }
  render () {
    const { vertical, scale, width, height, start, selectStart, selectLength, lines, canvasConfigs } = this.props
    const { showIndicator, value } = this.state
    const className = vertical ? 'v-container' : 'h-container'

    const indicatorOffset = (value - start) * scale
    const indicatorStyle = vertical ? { top: indicatorOffset } : { left: indicatorOffset }

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
                start={start}
                vertical={vertical}
                onChange={this.handleLineChange}
                onRemove={this.handleLineRemove}
                onMouseDown={this.handleLineDown}
                onRelease={this.handleLineRelease}
              />
            )
          }
        </div>
        {
          showIndicator &&
          <div className="indicator" style={indicatorStyle}>
            <span className="value">{value}</span>
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
