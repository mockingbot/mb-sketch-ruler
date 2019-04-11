import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import RulerWrapper from './RulerWrapper'

import { StyledRuler, StyleMenu } from './styles'

export default class SketchRuler extends PureComponent {
  constructor (props) {
    super(props)
    const { ratio, palette } = props
    this.canvasConfigs = {
      ratio,
      bgColor: palette.bgColor,
      longfgColor: palette.longfgColor,
      shortfgColor: palette.shortfgColor,
      fontColor: palette.fontColor,
      shadowColor: palette.shadowColor,
      lineColor: palette.lineColor,
      borderColor: palette.borderColor,
      cornerActiveColor: palette.cornerActiveColor
    }
    this.state = {
      showMenu: false,
      leftPosition: '0px',
      topPosition: '0px',
      vertical: undefined,
      showRuler: true,
      showReferLine: true,
      newLines: {
        h: props.horLineArr,
        v: props.verLineArr
      },
      newLinesCopy: {
        h: props.horLineArr,
        v: props.verLineArr
      }
    }
  }
  componentDidMount () {
    document.addEventListener('click', () => this.handleMenu(false), true)
  }
  componentWillUnmount () {
    document.removeEventListener('click', () => this.handleMenu(false), true)
  }
  handleMenu = (flag) => {
    setTimeout(() => {
      this.setState({
        showMenu: flag
      })
    }, 100)
  }

  handleLineChange = (arr, vertical) => {
    const { newLines, newLinesCopy } = this.state
    const { handleLine } = this.props
    // 只要画line，showReferLine变为true，否则会重复push newLines
    this.setState({
      showReferLine: true
    })
    const lines = vertical
      ? { h: newLines.h, v: !this.state.showReferLine ? [...arr, ...newLines.v] : [...arr] }
      : { h: !this.state.showReferLine ? [...arr, ...newLines.h] : [...arr], v: newLines.v }
    this.setState({
      newLines: lines,
      newLinesCopy: lines
    })
    console.log(lines, newLinesCopy, arr)
    handleLine(lines)
  }

  // 设置右键菜单位置
  rightmenuchange = (vertical, left, top) => {
    const { showMenu } = this.state
    console.log(left, top, showMenu)
    const realLeft = (!left && !showMenu) ? '-9999px' : `${left}px`
    const realTop = (!top && !showMenu) ? '-9999px' : `${top}px`
    this.setState({
      leftPosition: realLeft,
      topPosition: realTop,
      vertical
    })
    this.state.showRuler && this.handleMenu(true)
  }

  // 显示/影藏标尺
  handleShowRuler = () => {
    const { showRuler } = this.state
    this.setState({
      showRuler: !showRuler
    })
  }

  // 显示/影藏参考线
  handleShowReferLine = () => {
    const { showReferLine, newLines } = this.state
    const { handleLine } = this.props
    this.setState({
      showReferLine: !showReferLine
    })
    !showReferLine
      ? this.setState({
        newLinesCopy: { ...newLines }
      }) : this.setState({
        newLinesCopy: { h: [], v: [] }
      })
    const lines = this.state.newLinesCopy
    handleLine(lines)
  }

  // 删除横向、竖向参考线
  handleShowSpecificRuler = () => {
    const { vertical, newLines } = this.state
    const { handleLine } = this.props
    this.setState({
      vertical: vertical
    })
    vertical
      ? this.setState({
        newLinesCopy: { h: newLines.h, v: [] },
        newLines: { h: newLines.h, v: [] }
      }) : this.setState({
        newLinesCopy: { h: [], v: newLines.v },
        newLines: { h: [], v: newLines.v }
      })

    handleLine(this.state.newLinesCopy)
  }

  // 右键菜单render
  renderMenu = () => {
    const {
      leftPosition,
      topPosition,
      vertical,
      showRuler,
      showReferLine,
      newLinesCopy,
      showMenu
    } = this.state

    const isGrayRefer = !showRuler
    const isGraySpecific = vertical ? !newLinesCopy.v.length || !showRuler : !showRuler || !newLinesCopy.h.length

    const className = `menu-wrap ${!showMenu ? 'hide-menu' : ''}`
    const classNameContent = `menu-content ${!showMenu ? 'hide-content' : ''}`

    console.log(isGrayRefer)
    return (
      <StyleMenu className={className}
        style={{ left: leftPosition, top: topPosition }}
        showRuler={showRuler}
        showReferLine={showReferLine}
        isGraySpecific={isGraySpecific}
      >
        <a className={classNameContent}
          onClick={this.handleShowRuler}>显示标尺</a>

        <a className={classNameContent}
          style={{ color: isGrayRefer ? 'rgb(65,80,88, .4)' : '' }}
          onClick={!isGrayRefer ? this.handleShowReferLine : null}>显示参考线</a>

        <div className="divider" />

        <a className={`${classNameContent} no-icon`}
          style={{ color: isGraySpecific ? 'rgb(65,80,88, .4)' : '' }}
          onClick={!isGraySpecific ? this.handleShowSpecificRuler : null}>删除所有{vertical ? '横向' : '纵向'}参考线</a>
      </StyleMenu>
    )
  }

  render () {
    const {
      width, height, scale,
      thick, shadow, startX, startY, cornerActive, onCornerClick,
      palette: { bgColor }
    } = this.props

    const { x, y, width: w, height: h } = shadow

    const commonProps = {
      scale,
      canvasConfigs: this.canvasConfigs,
      onLineChange: this.handleLineChange,
      rightmenuchange: this.rightmenuchange
    }

    const { showRuler, newLinesCopy } = this.state

    return (
      <div>
        {this.renderMenu()}
        <StyledRuler id="mb-ruler" className="mb-ruler" thick={thick} {...this.canvasConfigs} style={{ opacity: showRuler ? 1 : 0 }}>
          {/* 水平方向 */}
          <RulerWrapper width={width} height={thick} start={startX} lines={newLinesCopy.h} selectStart={x} selectLength={w} {...commonProps} />
          {/* 竖直方向 */}
          <RulerWrapper width={thick} height={height} start={startY} lines={newLinesCopy.v} selectStart={y} selectLength={h} vertical {...commonProps} />
          <a className={`corner${cornerActive ? ' active' : ''}`} style={{ backgroundColor: bgColor }} onClick={onCornerClick} />
        </StyledRuler>
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
  startX: PropTypes.number,
  startY: PropTypes.number,
  shadow: PropTypes.object,
  horLineArr: PropTypes.array,
  verLineArr: PropTypes.array,
  handleLine: PropTypes.func,
  cornerActive: PropTypes.bool,
  onCornerClick: PropTypes.func,
  palette: PropTypes.shape({
    bgColor: PropTypes.string,
    longfgColor: PropTypes.string,
    shortfgColor: PropTypes.string,
    fontColor: PropTypes.string,
    shadowColor: PropTypes.string,
    lineColor: PropTypes.string,
    borderColor: PropTypes.string,
    cornerActiveColor: PropTypes.string
  })
}
SketchRuler.defaultProps = {
  thick: 16,
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
  },
  palette: {
    bgColor: 'rgba(225,225,225, 0)', // ruler bg color
    longfgColor: '#BABBBC', // ruler longer mark color
    shortfgColor: '#C8CDD0', // ruler shorter mark color
    fontColor: '#7D8694', // ruler font color
    shadowColor: '#E8E8E8', // ruler shadow color
    lineColor: '#EB5648',
    borderColor: '#DADADC',
    cornerActiveColor: 'rgb(235, 86, 72, 0.6)'
  }
}
