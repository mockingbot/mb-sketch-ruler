import React, { Component } from 'react'
import SketchRuler from './SketchRuler'

const thick = 16

export default class App extends Component {
  state = {
    startX: 0,
    startY: 0,
    lines: {
      h: [100, 200],
      v: [100, 200]
    }
  }
  componentDidMount () {
    // 滚动居中
    this.$app.scrollLeft = this.$container.getBoundingClientRect().width / 2 - 300 // 300 = #screens.width / 2
  }
  setAppRef = ref => this.$app = ref
  setContainerRef = ref => this.$container = ref

  handleScroll = () => {
    const screensRect = document.querySelector('#screens').getBoundingClientRect()
    const canvasRect = document.querySelector('#canvas').getBoundingClientRect()

    this.setState({
      startX: screensRect.left + thick - canvasRect.left,
      startY: screensRect.top + thick - canvasRect.top
    })
  }
  handleLine = (lines) => {
    this.setState({ lines })
  }
  render() {
    const { startX, startY, lines } = this.state
    const { h, v } = lines

    const scale = 1.5
    const perWidth = scale * 10
    const shadow = {
      x: 0,
      y: 0,
      width: 160,
      height: 200,
    }

    return (
      <div className="wrapper">
        <SketchRuler
          thick={thick}
          width={581}
          height={480}
          startX={startX}
          startY={startY}
          shadow={shadow}
          perWidth={perWidth}
          horLineArr={h}
          verLineArr={v}
          handleLine={this.handleLine}
          cornerActive={true}
          onCornerClick={this.handleCornerClick}
        />
        <div ref={this.setAppRef} id="screens" onScroll={this.handleScroll}>
          <div ref={this.setContainerRef} className="screen-container">
            <div id="canvas" style={{ transform: `scale(${scale})` }} />
          </div>
        </div>
      </div>
    )
  }
}
