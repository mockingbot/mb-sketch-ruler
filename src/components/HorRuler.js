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
        this.width = rect.width * 2;
        this.height = rect.height * 2;
        canvas.width = this.width;
        canvas.height = this.height;

        this.ctx = canvas.getContext('2d');

        this.drawRuler();
    }

    drawRuler() {
        console.log("水平重绘")
        //标尺起始x坐标
        var start = this.props.start;
        //手机的x坐标
        var posX = this.props.posX;
        //手机的宽度
        var width = this.props.width;
        console.log(start, posX, width)

        var ctx = this.ctx;

        //绘制刻度尺的背景
        ctx.fillStyle = '#F5F5F5'
        ctx.fillRect(0, 0, this.width, this.height);

        //设置底部刻度的样式
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#999'
        
        //绘制底部刻度,之前因为没决定用canvas,用dom的border画的,又慢又要计算定位,太挫了,还是用canvas画统一一点
        ctx.beginPath();
        // ctx.moveTo(0, 0);
        // ctx.lineTo(0, this.height); //border-left对不齐,改用黑科技实现
        ctx.moveTo(0, this.height); //border-bottom
        ctx.lineTo(this.width, this.height);
        ctx.closePath();
        ctx.stroke();

        //移动画布原点,方便绘制
        ctx.translate(- start * 2, 0);
        // ctx.save();

        //先根据iphone宽度绘制阴影
        ctx.fillStyle = '#CCC'
        ctx.font = '30px Microsoft Yahei'
        ctx.fillRect(posX * 2, 0, width * 2, this.height);

        //再画刻度和文字
        ctx.beginPath(); //一定要记得开关路径,因为clearRect并不能清除掉路径,如果不关闭路径下次绘制时会接着上次的绘制

        //这样绘制当起点不为10的倍数时,长标和文字都不会出现
        // for(let i = start ; i < start+this.width ; i += 10){
        //正确的方法是:偏移到10的倍数,再开始绘制
        // console.log(start % 10)
        var perWidth = 10 * 2;
        var startX = start - start % perWidth

        ctx.fillStyle = '#000'
        
        for (let i = startX; i < startX + this.width / 2; i += 10) {
            
            ctx.moveTo(i * 2, this.height);
            
            if (i % 100 === 0) {
                // console.log(i,"长的")
                console.log(i)
                ctx.fillText(i, (i + 2) * 2, this.height / 2);
                ctx.lineTo(i * 2, 0);
            } else {
                // console.log(i,"短的")
                ctx.lineTo(i * 2, this.height - perWidth);
            }
            ctx.stroke();
        }
        ctx.closePath();


        //translate方法是相对移动,而不是绝对,也就是说translate(0,0)没意义,
        //要是太乱弄不清楚 最好还是用save/restore的方法还原
        ctx.translate(start * 2, 0);
        // ctx.restore();
    }

    componentWillReceiveProps(nextProps) {
        var nStart = nextProps.start;
        var nPosX = nextProps.posX;
        var nWidth = nextProps.width;

        //只有属性发生变化时才重绘,两点好处
        // 1.提升效率
        // 2.可以避免改变一个方向,另一个方向也会略微位移的bug
        if(nextProps.start !== this.props.start
            || nextProps.posX !== this.props.posX
            || nextProps.width !== this.props.width)
        {
                    this.drawRuler();
        }

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
