import React, { Component } from 'react'
import SketchRuler from './SketchRuler'
import './App.css'

const ox = -245
const oy = -105

export default class App extends Component {
  state = {
    startX: ox,
    startY: oy,
    lines: {
      h: [100, 200],
      v: [100, 200]
    }
  }
  componentDidMount () {
    const el = this.refs.app
    const screens = document.querySelector('#screens')
    const rect = screens.getBoundingClientRect()
    el.scrollLeft = rect.width / 2
    el.scrollTop = rect.height / 2
    el.addEventListener('scroll', () => {
      const app = this.refs.app
      const startX = ox + app.scrollLeft - rect.width / 2
      const startY = oy + app.scrollTop - rect.height / 2
      // console.log(startX, startY)
      this.setState({ startX, startY })
    })
    // console.log(el.getBoundingClientRect())
    // this.refs.app.scrollLeft
  }
  handleLine = (lines) => {
    this.setState({ lines })
  }
  render() {
    const { startX, startY, lines } = this.state
    const { h, v } = lines
    return (
      <div className="wrapper">
        <SketchRuler
          startX={startX}
          startY={startY}
          horLineArr={h}
          verLineArr={v}
          handleLine={this.handleLine}
        />
        <div ref="app" className="App">
          <div id="screens"></div>
        </div>
      </div>
    )
  }
}
