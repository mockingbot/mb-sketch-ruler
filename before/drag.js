//右边的拖放事件
	resizeX(e){
		this.startX = e.clientX;

		document.addEventListener('mousemove', this.setWidth)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setWidth)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}

	// 其实设置宽高可以强行合成一个函数,为鼠标按下事件绑定一个参数,后续判断即可,
	//不过那样就不清晰了,而且判断类型的代码不见得就少多少,事件的分发还会影响效率
	setWidth(e){
		e.preventDefault()
		var deltaWidth = e.clientX - this.startX
		console.log(deltaWidth)
		this.props.onResize(deltaWidth, 0)
		this.startX = e.clientX;
	}

	//左边的拖放事件,因为要调整定位的left值,所以与右边不同
	resizeXLeft(e){
		this.startX = e.clientX;

		document.addEventListener('mousemove', this.setWidthAndLeft)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setWidthAndLeft)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}

	setWidthAndLeft(e){
		e.preventDefault()
		var deltaWidth = e.clientX - this.startX
		console.log(deltaWidth)
		this.props.onResize(-deltaWidth, 0, deltaWidth, 0)
		this.startX = e.clientX;
	}


	//下边的拖放事件
	resizeY(e){
		this.startY = e.clientY;
		document.addEventListener('mousemove', this.setHeight)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setHeight)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}

	//调整高度
	setHeight(e){
		e.preventDefault()
		console.log('取消了')
		var deltaHeight = e.clientY - this.startY
		console.log(deltaHeight)
		this.props.onResize(0, deltaHeight)
		this.startY = e.clientY;
	}

	//上边的拖放事件,因为要调整定位的top值,所以与下边不同
	resizeYTop(e){
		this.startY = e.clientY;
		document.addEventListener('mousemove', this.setHeightAndTop)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setHeightAndTop)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}

	setHeightAndTop(e){
		e.preventDefault()
		var deltaHeight = e.clientY - this.startY
		console.log(deltaHeight)
		//注意这里,宽高要加负号(例如右边的边右移是变宽,而左边的边左移是变窄)
		this.props.onResize(0, -deltaHeight, 0, deltaHeight)
		this.startY = e.clientY;
	}



	resizeXY(e){
		this.startX = e.clientX;
		this.startY = e.clientY;

		document.addEventListener('mousemove', this.setWAndH)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setWAndH)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}

	//调整宽高
	setWAndH(e){
		e.preventDefault()
		var deltaWidth = e.clientX - this.startX
		var deltaHeight = e.clientY - this.startY
		console.log(deltaWidth, deltaHeight)
		this.props.onResize(deltaWidth, deltaHeight)
		this.startX = e.clientX;
		this.startY = e.clientY;
	}

	//右上
	resizeXYTop(e){
		e.preventDefault();
		this.startX = e.clientX;
		this.startY = e.clientY;

		document.addEventListener('mousemove', this.setWHTop)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setWHTop)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}
	setWHTop(e){
		e.preventDefault()
		var deltaWidth = e.clientX - this.startX
		var deltaHeight = e.clientY - this.startY
		console.log(deltaWidth, deltaHeight)
		this.props.onResize(deltaWidth, -deltaHeight, 0, deltaHeight)
		this.startX = e.clientX;
		this.startY = e.clientY;
	}

	//左下
	resizeXYLeft(e){
		this.startX = e.clientX;
		this.startY = e.clientY;

		document.addEventListener('mousemove', this.setWHLeft)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setWHLeft)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}
	setWHLeft(e){
		e.preventDefault()
		var deltaWidth = e.clientX - this.startX
		var deltaHeight = e.clientY - this.startY
		console.log(deltaWidth, deltaHeight)
		this.props.onResize(-deltaWidth, deltaHeight, deltaWidth, 0)
		this.startX = e.clientX;
		this.startY = e.clientY;
	}

	//左上
	rezieXYTopLeft(e){
		this.startX = e.clientX;
		this.startY = e.clientY;

		document.addEventListener('mousemove', this.setWHTopLeft)
		
		var func = () => {
			document.removeEventListener('mousemove', this.setWHTopLeft)
			document.removeEventListener('mouseup', func)
		}

		document.addEventListener('mouseup', func)
	}
	setWHTopLeft(e){
		e.preventDefault()
		var deltaWidth = e.clientX - this.startX
		var deltaHeight = e.clientY - this.startY
		console.log(deltaWidth, deltaHeight)
		this.props.onResize(-deltaWidth, -deltaHeight, deltaWidth, deltaHeight)
		this.startX = e.clientX;
		this.startY = e.clientY;
	}