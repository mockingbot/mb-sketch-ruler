require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

/*
 * 2016.5.23 
 * iny
 * 水平标尺
 */
class HorRuler extends React.Component {

    componentDidMount() {
        var canvas = this.refs.ruler;
        var rect = canvas.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        canvas.width = this.width;
        canvas.height = this.height;

        this.ctx = canvas.getContext('2d');

        this.drawRuler();
    }

    drawRuler() {
        //标尺起始x坐标
        var start = this.props.start;
        //手机的x坐标
        var posX = this.props.posX;
        //手机的宽度
        var width = this.props.width;
        // console.log(start, posX, width)

        var ctx = this.ctx;

        //绘制刻度尺的背景
        ctx.fillStyle = '#F5F5F5'
        ctx.fillRect(0, 0, this.width, this.height);

        //设置底部刻度的样式
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#999'
        
        //绘制底部刻度,之前因为没决定用canvas,用dom的border画的,又慢又要计算定位,太挫了,还是用canvas画统一一点
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, this.height); //border-left
        ctx.moveTo(0, this.height); //border-bottom
        ctx.lineTo(this.width, this.height);
        ctx.closePath();
        ctx.stroke();

        //移动画布原点,方便绘制
        ctx.translate(-start, 0);
        // ctx.save();

        //先根据iphone宽度绘制阴影
        ctx.fillStyle = '#CCC'
        ctx.fillRect(posX, 0, width, this.height);

        //再画刻度和文字
        ctx.beginPath(); //一定要记得开关路径,因为clearRect并不能清除掉路径,如果不关闭路径下次绘制时会接着上次的绘制

        //这样绘制当起点不为10的倍数时,长标和文字都不会出现
        // for(let i = start ; i < start+this.width ; i += 10){

        //正确的方法是:偏移到10的倍数,再开始绘制
        // console.log(start % 10)
        for (let i = start - start % 10; i < start + this.width; i += 10) {
            // var startX = start % 10
            ctx.moveTo(i, 30);
            // console.log(i % 100)
            if (i % 100 === 0) {
                // console.log(i,"长的")
                ctx.fillStyle = '#000'
                ctx.fillText(i, i + 2, 15);
                ctx.lineTo(i, 0);
            } else {
                // console.log(i,"短的")
                ctx.lineTo(i, 20);
            }
            ctx.stroke();
        }
        ctx.closePath();


        //translate方法是相对移动,而不是绝对,也就是说translate(0,0)没意义,
        //要是太乱弄不清楚 最好还是用save/restore的方法还原
        ctx.translate(start, 0);
        // ctx.restore();
    }

    componentWillReceiveProps() {
        this.drawRuler();
    }

    handleClick() {
        console.log('点击了')
            //被clearRect坑了,该函数相当于只是用底色画了个矩形,上一次未close的路径并不会清除
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    render() {

        return <canvas ref="ruler" 
                    id="horRuler"
                    onClick={this.handleClick.bind(this)} />;
    }
}

HorRuler.defaultProps = {};

export default HorRuler;
