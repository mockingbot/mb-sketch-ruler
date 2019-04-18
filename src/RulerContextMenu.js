// import React, { PureComponent } from 'react'
// import { StyleMenu } from './styles'

// export default class RulerContextMenu extends PureComponent {
//   componentDidMount () {
//     document.body.appendChild(this.el)
//     document.addEventListener('click', this.closeMenu, true)
//   }
//   componentWillUnmount () {
//     document.body.removeChild(this.el)
//     document.removeEventListener('click', this.closeMenu, true)
//   }

//   render () {
//     return (
//       <StyleMenu className={className}
//         style={{ left: leftPosition, top: topPosition }}
//         showRuler={showRuler}
//         showReferLine={showReferLine}
//         isGraySpecific={isGraySpecific}
//       >
//         <a className={classNameContent}
//           onClick={this.handleShowRuler}>显示标尺</a>

//         <a className={classNameContent}
//           style={{ color: isGrayRefer ? 'rgb(65,80,88, .4)' : '' }}
//           onClick={!isGrayRefer ? this.handleShowReferLine : null}>显示参考线</a>

//         <div className="divider" />

//         <a className={`${classNameContent} no-icon`}
//           style={{ color: isGraySpecific ? 'rgb(65,80,88, .4)' : '' }}
//           onClick={!isGraySpecific ? this.handleShowSpecificRuler : null}>删除所有{vertical ? '横向' : '纵向'}参考线</a>
//       </StyleMenu>
//     )
//   }
// }