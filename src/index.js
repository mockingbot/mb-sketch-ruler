import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
// import { createPortal } from 'react-dom'
import RulerWrapper from './RulerWrapper'

import { StyledRuler } from './styles'

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
      // vertical: undefined,
      // showRuler: true,
      // showReferLine: true,
      // newLines: {
      //   h: props.horLineArr,
      //   v: props.verLineArr
      // },
      // newLinesCopy: {
      //   h: props.horLineArr,
      //   v: props.verLineArr
      // }
    }
    this.el = document.createElement('div')
  }
  componentDidMount () {
    document.body.appendChild(this.el)
    document.addEventListener('click', this.closeMenu, true)
  }
  componentWillUnmount () {
    document.body.removeChild(this.el)
    document.removeEventListener('click', this.closeMenu, true)
  }
  closeMenu = () => this.handleMenu(false)

  handleMenu = (flag) => {
    setTimeout(() => {
      this.setState({
        showMenu: flag
      })
    }, 100)
  }

  handleLineChange = (arr, vertical) => {
    const { newLines } = this.state
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
    handleLine(lines)
  }

  // 设置右键菜单位置
  // rightmenuchange = (vertical, left, top) => {
  //   const { showMenu } = this.state
  //   const realLeft = (!left && !showMenu) ? '-9999px' : `${left}px`
  //   const realTop = (!top && !showMenu) ? '-9999px' : `${top}px`
  //   this.setState({
  //     showMenu: true,
  //     vertical,
  //     leftPosition: realLeft,
  //     topPosition: realTop
  //   })
    // this.handleMenu(true)
    // this.state.showRuler && this.handleMenu(true)
  }

  // // 显示/影藏标尺
  // handleShowRuler = () => {
  //   const { showRuler, newLinesCopy } = this.state
  //   const { onhandleShowRuler, handleLine } = this.props
  //   this.setState({
  //     showRuler: !showRuler
  //   })
  //   handleLine(newLinesCopy)
  //   onhandleShowRuler(!showRuler)
  // }

  // // 显示/影藏参考线
  // handleShowReferLine = () => {
  //   const { showReferLine, newLines } = this.state
  //   const { handleLine } = this.props
  //   this.setState({
  //     showReferLine: !showReferLine
  //   })
  //   const lines = !showReferLine
  //     ? { ...newLines }
  //     : { h: [], v: [] }
  //   this.setState({
  //     newLinesCopy: lines
  //   })

  //   handleLine(lines)
  // }

  // 删除横向、竖向参考线
  // handleShowSpecificRuler = () => {
  //   const { handleLine, horLineArr, verLineArr } = this.props
  //   const { vertical, newLines } = this.state

  //   // this.setState({
  //   //   vertical: vertical
  //   // })
  //   const lines = vertical
  //     ? { h: horLineArr, v: [] }
  //     : { h: [], v: verLineArr }
  //   // this.setState({
  //   //   newLines: lines,
  //   //   newLinesCopy: lines
  //   // })
  //   handleLine(lines)
  // }

  // 右键菜单render
  // renderMenu = () => {
  //   const { showRuler, showReferLine } = this.props
  //   const {
  //     showMenu,
  //     // vertical,
  //     leftPosition,
  //     topPosition,
  //     // vertical,
  //     // showRuler,
  //     // showReferLine,
  //     // newLinesCopy,
  //   } = this.state

  //   const isGrayRefer = !showRuler
  //   const isGraySpecific = vertical ? !newLinesCopy.v.length || !showRuler : !showRuler || !newLinesCopy.h.length

  //   const className = `menu-wrap ${!showMenu ? 'hide-menu' : ''}`
  //   const classNameContent = `menu-content ${!showMenu ? 'hide-content' : ''}`

  //   if (showMenu === false) return null

  //   return (
  //     createPortal(
  //       <RulerContextMenu />
  //       , this.el
  //     )
  //   )
  // }

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
        {/* {this.renderMenu()} */}
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
  }),
  onhandleShowRuler: PropTypes.func
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
