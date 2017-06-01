import React, { Component } from 'react'
import SketchRuler from './SketchRuler'

const thick = 20

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
    const el = this.refs.app
    el.scrollLeft = this.refs.container.getBoundingClientRect().width / 2 - 300 // 300 = #screens.width / 2

    this.handleUpdate()

    el.addEventListener('scroll', () => {
      this.handleUpdate()
    })
    // console.log(el.getBoundingClientRect())
    // this.refs.app.scrollLeft
  }
  handleUpdate = () => {
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
          perWidth={scale * 10}
          startX={startX}
          startY={startY}
          shadow={shadow}
          horLineArr={h}
          verLineArr={v}
          handleLine={this.handleLine}
        />
        <div ref="app" id="screens">
          <div ref="container" className="screen-container">
            <div id="canvas" style={{ transform: `scale(${scale})` }} />
          </div>
        </div>
      </div>
    )
  }
}
