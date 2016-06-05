require('styles/controller.css');
import React from 'react';
/*
 * 2016.6.5
 * iny
 * 控制面板 可以添加组件以及编辑现有组件
 */

class Controller extends React.Component {
	
	handleAdd(){
		var iphone = {
			title: this.refs.title.value,
			x: this.refs.x.value,
			y: this.refs.y.value,
			width: this.refs.width.value,
			height: this.refs.height.value,
		}
		console.log(iphone)
		this.props.handleAdd(iphone)
	}
	handleEdit(){

	}
	render() {
		
		return <section className="controller">
	        	<div>
		        	<label htmlFor="title">title:</label>
		        	<input type="text" id="title" ref="title"/>
	        	</div>
	        	<div>
		        	<label htmlFor="x">x:</label>
		        	<input type="text" id="x" ref="x"/>
	        	</div>
	        	<div>
		        	<label htmlFor="y">y:</label>
		        	<input type="text" id="y" ref="y"/>
	        	</div>
	        	<div>
		        	<label htmlFor="width">width:</label>
		        	<input type="text" id="width" ref="width"/>
	        	</div>
	        	<div>
		        	<label htmlFor="height">height:</label>
		        	<input type="text" id="height" ref="height"/>
	        	</div>
	        	<div className="btns">
		        	<button onClick={this.handleAdd.bind(this)}>add</button>
		        	<button onClick={this.handleEdit.bind(this)}>editSelect</button>	
	        	</div>
        	</section>
	}
}

export default Controller