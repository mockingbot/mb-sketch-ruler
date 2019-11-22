import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import RulerWrapper from './RulerWrapper'
import RulerContextMenu from './RulerContextMenu'

import { StyledRuler } from './styles'

const DEFAULTMENU = {
  bgColor: '#fff',
  dividerColor: '#DBDBDB',
  listItem: {
    textColor: '#415058',
    hoverTextColor: '#298DF8',
    disabledTextColor: 'rgba(65, 80, 88, 0.4)',
    bgColor: '#fff',
    hoverBgColor: '#F2F2F2'
  }
}

export default class SketchRuler extends PureComponent {
  constructor (props) {
    super(props)
    const { ratio, palette } = props
    const menu = palette.menu || DEFAULTMENU
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
    this.menuConfigs = {
      bgColor: menu.bgColor,
      dividerColor: menu.dividerColor,
      listItem: menu.listItem
    }
    this.state = {
      isShowMenu: false,
      vertical: false,
      positionObj: {
        x: 0,
        y: 0
      }
    }
  }
  handleLineChange = (arr, vertical) => {
    const { horLineArr, verLineArr, handleLine } = this.props
    const newLines = vertical
      ? { h: horLineArr, v: [...arr] }
      : { h: [...arr], v: verLineArr }
    handleLine(newLines)
  }
  // 展示右键菜单
  onShowRightMenu = (left, top, vertical) => {
    this.setState({
      isShowMenu: true,
      vertical: vertical,
      positionObj: {
        x: left,
        y: top
      }
    })
  }
  onhandlecloseMenu = () => {
    this.setState({ isShowMenu: false })
  }
  // 取消默认菜单事件
  preventDefault (e) {
    e.preventDefault()
  }
  render () {
    const {
      width, height, scale, handleLine,
      thick, shadow, startX, startY, cornerActive,
      horLineArr, verLineArr, onCornerClick,
      palette: { bgColor }, lang, isOpenMenuFeature, handleShowRuler,
      isShowReferLine, handleShowReferLine
    } = this.props

    const { positionObj, vertical, isShowMenu } = this.state

    const { x, y, width: w, height: h } = shadow

    const commonProps = {
      scale,
      canvasConfigs: this.canvasConfigs,
      onLineChange: this.handleLineChange,
      onShowRightMenu: this.onShowRightMenu,
      isShowReferLine,
      handleShowReferLine
    }

    const menuPosition = {
      left: positionObj.x,
      top: positionObj.y
    }

    return (
      <StyledRuler id="mb-ruler" className="mb-ruler" isShowReferLine={isShowReferLine} thick={thick} {...this.canvasConfigs}
        onContextMenu={this.preventDefault}>
        {/* 水平方向 */}
        <RulerWrapper width={width} height={thick} start={startX} lines={horLineArr} selectStart={x} selectLength={w} {...commonProps} />
        {/* 竖直方向 */}
        <RulerWrapper width={thick} height={height} start={startY} lines={verLineArr} selectStart={y} selectLength={h} vertical {...commonProps} />
        <a className={`corner${cornerActive ? ' active' : ''}`} style={{ backgroundColor: bgColor }} onClick={onCornerClick} />
        { isOpenMenuFeature && isShowMenu &&
          <RulerContextMenu
            key={String(menuPosition.left) + String(menuPosition.top)}
            lang={lang}
            vertical={vertical}
            handleLine={handleLine}
            horLineArr={horLineArr}
            verLineArr={verLineArr}
            menuPosition={menuPosition}
            handleShowRuler={handleShowRuler}
            isShowReferLine={isShowReferLine}
            handleShowReferLine={handleShowReferLine}
            oncloseMenu={this.onhandlecloseMenu}
            menuConfigs={this.menuConfigs}
          />
        }
      </StyledRuler>
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
  lang: PropTypes.string,
  isOpenMenuFeature: PropTypes.bool,
  handleShowRuler: PropTypes.func,
  isShowReferLine: PropTypes.bool,
  handleShowReferLine: PropTypes.func,
  palette: PropTypes.shape({
    bgColor: PropTypes.string,
    longfgColor: PropTypes.string,
    shortfgColor: PropTypes.string,
    fontColor: PropTypes.string,
    shadowColor: PropTypes.string,
    lineColor: PropTypes.string,
    borderColor: PropTypes.string,
    cornerActiveColor: PropTypes.string,
    menu: PropTypes.shape({
      bgColor: PropTypes.string, // menu菜单
      dividerColor: PropTypes.string, // 分割线
      listItem: PropTypes.shape({ // item
        textColor: PropTypes.string, // 文本
        hoverTextColor: PropTypes.string,
        disabledTextColor: PropTypes.string,
        bgColor: PropTypes.string,
        hoverBgColor: PropTypes.string
      })
    })
  })
}
SketchRuler.defaultProps = {
  isOpenMenuFeature: false,
  isShowReferLine: true,
  handleShowRuler: () => {},
  handleShowReferLine: () => {},
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
  lang: 'zh-CN',
  palette: {
    bgColor: 'rgba(225,225,225, 0)', // ruler bg color
    longfgColor: '#BABBBC', // ruler longer mark color
    shortfgColor: '#C8CDD0', // ruler shorter mark color
    fontColor: '#7D8694', // ruler font color
    shadowColor: '#E8E8E8', // ruler shadow color
    lineColor: '#EB5648',
    borderColor: '#DADADC',
    cornerActiveColor: 'rgb(235, 86, 72, 0.6)',
    menu: DEFAULTMENU
  }
}
