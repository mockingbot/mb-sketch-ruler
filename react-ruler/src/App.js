import React, { PureComponent } from 'react'
import SketchRuler from './SketchRuler'

const thick = 16

export default class App extends PureComponent {
  state = {
    scale: 1.5,
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
  // componentDidUpdate (prevProps, prevState) {
  //   console.log(this.state.scale, prevState.scale)
  //   if (this.state.scale !== prevState.scale) {
  //     this.handleScroll()
  //   }
  // }

  setAppRef = ref => this.$app = ref
  setContainerRef = ref => this.$container = ref

  handleScroll = () => {
    const screensRect = document.querySelector('#screens').getBoundingClientRect()
    const canvasRect = document.querySelector('#canvas').getBoundingClientRect()
    console.log('hehe')

    this.setState({
      startX: screensRect.left + thick - canvasRect.left,
      startY: screensRect.top + thick - canvasRect.top
    })
  }
  handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const nextScale = Math.max(0.2, this.state.scale - e.deltaY / 500)
      this.setState({ scale: nextScale })
    }
  }
  handleLine = (lines) => {
    this.setState({ lines })
  }
  render () {
    const { scale, startX, startY, lines } = this.state
    const { h, v } = lines

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
          width={582}
          height={482}
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
        <div ref={this.setAppRef} id="screens" onScroll={this.handleScroll} onWheel={this.handleWheel}>
          <div ref={this.setContainerRef} className="screen-container">
            <div id="canvas" style={{ transform: `scale(${scale})` }} />
          </div>
        </div>
      </div>
    )
  }
}
