import styled from 'styled-components'

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
      background-color: rgba(${props => props.coreColor}) !important;
      opacity: 0.6;
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
    border-bottom: 1px solid ${props => props.borderColor};

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
    border-right: 1px solid ${props => props.borderColor};

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
