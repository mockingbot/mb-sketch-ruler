import styled from 'styled-components'

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
  transition: opacity 0.2s ease-in-out;
  transform-origin: 0 0;
  animation: open-contextmenu 0.2s;
  animation-fill-mode: forwards;
  z-index: 999;
  &.hide-menu {
    animation: close-contextmenu 0.2s;
    animation-fill-mode: forwards;
    z-index: -9999;
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
    min-width: ${props => props.lang === 'ch' ? '82%' : '87%'};
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
    cursor: pointer;
  }
  .menu-content:hover {
    background: #F2F2F2;
    cursor: pointer;
    color: #298DF8;

    svg path {
      fill: #298DF8;
    }
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
  opacity: ${props => props.isShowRuler ? 1 : 0};
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
      cursor: ${props => props.isShowReferLine ? 'ew-resize' : 'none'};
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
      cursor: ${props => props.isShowReferLine ? 'ns-resize' : 'none'};
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
