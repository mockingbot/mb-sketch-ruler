import React, { PureComponent } from 'react'
import ReactRuler from 'mb-sketch-ruler'

const thick = 16

export default class App extends PureComponent {
  state = {
    scale: 2, //658813476562495, //1,
    startX: 0,
    startY: 0,
    lines: {
      h: [100, 200],
      v: [100, 200]
    },
    lang: 'zh-CN', // 中英文
    isShowRuler: true, // 显示标尺
    isShowReferLine: true // 显示参考线
  }
  componentDidMount () {
    // 滚动居中
    this.$app.scrollLeft = this.$container.getBoundingClientRect().width / 2 - 300 // 300 = #screens.width / 2
  }
  componentDidUpdate (prevProps, prevState) {
    if (this.state.scale !== prevState.scale) {
      this.handleScroll()
    }
  }
  setAppRef = ref => this.$app = ref
  setContainerRef = ref => this.$container = ref

  handleScroll = () => {
    const screensRect = document.querySelector('#screens').getBoundingClientRect()
    const canvasRect = document.querySelector('#canvas').getBoundingClientRect()

    // 标尺开始的刻度
    const { scale } = this.state
    const startX = (screensRect.left + thick - canvasRect.left) / scale
    const startY = (screensRect.top + thick - canvasRect.top) / scale
    this.setState({ startX, startY })
  }
  handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const nextScale = parseFloat(Math.max(0.2, this.state.scale - e.deltaY / 500).toFixed(2))
      this.setState({ scale: nextScale })
    }
  }
  handleLine = (lines) => {
    this.setState({ lines })
  }
  handleChangeEn = () => {
    this.setState({ lang: 'en' })
  }
  handleChangeCh = () => {
    this.setState({ lang: 'zh-CN' })
  }
  // 显示/影藏标尺
  handleShowRuler = () => {
    const { isShowRuler } = this.state
    this.setState({ isShowRuler: !isShowRuler })
  }
  // 显示/影藏参考线
  handleShowReferLine = () => {
    const { isShowReferLine } = this.state
    this.setState({ isShowReferLine: !isShowReferLine })
  }
  render () {
    const { scale, startX, startY, lines, isShowRuler, isShowReferLine, lang } = this.state
    const { h, v } = lines

    const rectWidth = 160
    const rectHeight = 200

    const canvasStyle = {
      width: rectWidth,
      height: rectHeight,
      transform: `scale(${scale})`
    }
    const shadow = {
      x: 0,
      y: 0,
      width: rectWidth,
      height: rectHeight
    }

    return (
      <div className="wrapper">
        <button className="button" onClick={this.handleShowRuler}>{!isShowRuler ? '显示' : '隐藏'}标尺</button>
        <button className="button-ch" onClick={this.handleChangeCh}>中</button>
        <button className="button-en" onClick={this.handleChangeEn}>英</button>
        <div className="scale-value">{`scale: ${scale}`}</div>
        {
          isShowRuler &&
          <ReactRuler
            lang={lang}
            thick={thick}
            scale={scale}
            width={582}
            height={482}
            startX={startX}
            startY={startY}
            shadow={shadow}
            horLineArr={h}
            verLineArr={v}
            handleLine={this.handleLine}
            cornerActive={true}
            onCornerClick={this.handleCornerClick}

            // 右键菜单props
            isOpenMenuFeature={true}
            handleShowRuler={this.handleShowRuler}
            isShowReferLine={isShowReferLine}
            handleShowReferLine={this.handleShowReferLine}
          />
        }
        <div ref={this.setAppRef} id="screens" onScroll={this.handleScroll} onWheel={this.handleWheel}>
          <div ref={this.setContainerRef} className="screen-container">
            <div id="canvas" style={canvasStyle} />
          </div>
        </div>
      </div>
    )
  }
}
