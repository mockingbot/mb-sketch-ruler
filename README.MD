# mb-sketch-ruler

> A sketch like ruler in javascript

[![NPM](https://img.shields.io/npm/v/mb-sketch-ruler.svg)](https://www.npmjs.com/package/mb-sketch-ruler) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Live Demo
  [Click here](https://mockingbot.github.io/mb-sketch-ruler/)

## Install

```bash
npm install --save mb-sketch-ruler
```

## Usage

```jsx
import React, { PureComponent } from 'react'

import ReactRuler from 'mb-sketch-ruler'

class Example extends PureComponent {
  render () {
    return (
      <ReactRuler
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
    )
  }
}
```

## License

MIT © [MockingBot](https://github.com/mockingbot)

###© 2016 [MockingBot](https://mockingbot.com)
