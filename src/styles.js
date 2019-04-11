import styled from 'styled-components'
import getSVG from '../public/icon/get.svg'
import getHoverSVG from '../public/icon/get-hover.svg'

export const StyleMenu = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0 2px 10px 0 rgba(39,54,78,0.08), 0 12px 40px 0 rgba(39,54,78,0.10);
  background: rgb(255, 255, 255);
  border-radius: 2px;
  z-index: 4;
  padding: 6px 0;
  transition: opacity, transform, display 0.2s ease-in-out;
  transform-origin: 0 0;
  animation: open-contextmenu 0.2s;
  animation-fill-mode: forwards;

  &.hide-menu {
    animation: close-contextmenu 0.1s;
    animation-fill-mode: forwards;
  }

  @keyframes open-contextmenu {
    from {
      opacity: 0;
      transform: scale(0.8);
    }

    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes close-contextmenu {
    from {
      opacity: 1;
      transform: scale(1);
    }

    to {
      opacity: 0;
      transform: scale(0.8);
    }
  }


  .divider {
    margin: 4px 12px;
    border-top: 1px solid #DBDBDB;
    min-width: 108px;
  }

  .menu-content {
    font-size: 12px;
    font-family: PingFangSC;
    color: #415058;
    display: inline-block;
    width: 100%;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;

    &.hide-content {
      display: none;
    }
  }

  .menu-content:hover {
    background: #F2F2F2;
    cursor: pointer;
    color: #298DF8;

    &:after {
      background-image: url(${getHoverSVG});
    }
  }

  .menu-content:nth-child(1):after {
    opacity: ${props => props.showRuler ? 1 : 0};
  }

  .menu-content:nth-child(2):after {
    opacity: ${props => props.showReferLine ? 1 : 0};
  }

  .no-icon:hover {
    background: ${props => !props.isGraySpecific ? 'rgba(0, 0, 0, 0.04)' : 'none'} !important;
    cursor:  ${props => !props.isGraySpecific ? 'pointer' : 'auto'} !important;
  }

  .menu-content:after {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    background-image: url(${getSVG});
    background-size: 100%;
    opacity: 0;
    margin-top: -2px;
  }

  .no-icon:after {
    display: none;
  }
`

export const StyledRuler = styled.div`
  position: absolute;
  width: 100%; /* scrollbar width */
  height: 100%;
  z-index: 3; /* 需要比resizer高 */
  pointer-events: none;
  font-size: 12px;
  overflow: hidden;
  span {
    line-height: 1;
  }

  .corner {
    position: absolute;
    left: 0;
    top: 0;
    width: ${props => props.thick + 'px'};
    height: ${props => props.thick + 'px'};
    border-right: 1px solid ${props => props.borderColor};
    border-bottom: 1px solid ${props => props.borderColor};
    pointer-events: auto;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    box-sizing: content-box;
    &.active {
      background-color: ${props => props.cornerActiveColor} !important;
    }
  }

  .indicator {
    position: absolute;
    pointer-events: none;
    .value {
      position: absolute;
      background: white;
    }
  }

  .ruler {
    width: 100%;
    height: 100%;
    pointer-events: auto;
  }

  .line {
    position: absolute;
    .action {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .value {
      pointer-events: none;
      transform: scale(0.83);
    }
    .del {
      cursor: pointer;
      padding: 3px 5px;
      visibility: hidden;
    }
    &:hover .del {
      visibility: visible;
    }
  }

  .h-container, .v-container {
    position: absolute;
    .lines {
      pointer-events: none;
    }
    &:hover .lines {
      pointer-events: auto;
    }
  }

  .h-container {
    left: ${props => props.thick + 'px'};
    top: 0;
    width: calc(100% - ${props => props.thick + 'px'});
    height: ${props => `${props.thick + 1}px`};

    .line {
      height: 100vh;
      top: 0;
      padding-left: 5px;
      border-left: 1px solid ${props => props.lineColor};
      cursor: ew-resize;
      .action {
        top: ${props => props.thick + 'px'};
        transform: translateX(-24px);
        .value {
          margin-left: 4px;
        }
      }
    }

    .indicator {
      top: 0;
      border-left: 1px solid ${props => props.lineColor};
      height: 100vw;
      .value {
        margin-left: 2px;
        margin-top: 4px;
      }
    }
  }

  .v-container {
    top: ${props => props.thick + 'px'};
    left: 0;
    width: ${props => `${props.thick + 1}px`};
    height: calc(100% - ${props => props.thick + 'px'});

    .line {
      width: 100vw;
      left: 0;
      padding-top: 5px;
      border-top: 1px solid ${props => props.lineColor};
      cursor: ns-resize;
      .action {
        left: ${props => props.thick + 'px'};
        transform: translateY(-24px);
        flex-direction: column;
        .value {
          margin-top: 4px;
        }
      }
    }

    .indicator {
      border-bottom: 1px solid ${props => props.lineColor};
      width: 100vw;
      .value {
        margin-left: 2px;
        margin-top: -5px;
        transform-origin: 0 0;
        transform: rotate(-90deg);
      }
    }
  }
`
