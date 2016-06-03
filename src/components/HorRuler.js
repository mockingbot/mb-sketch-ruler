import React from 'react';

/*
 * 2016.5.23 
 * iny
 * 水平标尺
 */
class HorRuler extends React.Component {

    //当窗口发生改变时,根据新的窗口大小重置canvas
    reSize(width, height){
        var canvas = this.refs.ruler;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        this.width = width * 2;
        this.height = height * 2;
        canvas.width = this.width;
        canvas.height = this.height;
    }

    //组件绑定后首次绘制
    componentDidMount() {
        var canvas = this.refs.ruler;
        var domWidth = this.props.domWidth;
        var domHeight = this.props.domHeight;
        
        canvas.style.width = domWidth + 'px';
        canvas.style.height = domHeight + 'px';

        var bg = this.refs.ruler;
        var fg = this.refs.text;

        //2倍宽高,以解决canvas的1px问题
        this.width = domWidth * 2;
        this.height = domHeight * 2;

        canvas.width = this.width;
        canvas.height = this.height;

        this.ctx = bg.getContext('2d');
        this.drawRuler();
    }

    /* 核心方法,根据属性重新绘制canvas
     * @ params
     * start : 标尺起始x坐标
     * posX : 手机的x坐标
     * width : 手机的宽度
     */
    drawRuler(start = this.props.start,
                posX = this.props.posX,
                width = this.props.width,
                needShadow = this.props.showShadow) {
        
        // console.log("水平重绘")
        
        var ctx = this.ctx;

        //绘制刻度尺的背景
        ctx.fillStyle = '#F5F5F5'
        ctx.fillRect(0, 0, this.width, this.height);

        //先根据iphone宽度绘制阴影
        if(needShadow){
            ctx.fillStyle = '#CCC'
            ctx.fillRect((posX - start) * 2, 0, width * 2, this.height);
        }

        //再画刻度和文字(因为刻度遮住了阴影)
        ctx.font = '30px Microsoft Yahei'
        
        //设置底部刻度的样式
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#999'
        //绘制底部刻度,之前因为没决定用canvas,用dom的border画的,又慢又要计算定位,太挫了,还是用canvas画统一一点
        ctx.beginPath();
        
        //border-bottom(border-left对不齐,改用css实现)
        ctx.moveTo(0, this.height); 
        ctx.lineTo(this.width, this.height);
        
        ctx.closePath();
        ctx.stroke();

        //移动画布原点,方便绘制
        ctx.translate(- start * 2, 0);
        
        ctx.beginPath(); //一定要记得开关路径,因为clearRect并不能清除掉路径,如果不关闭路径下次绘制时会接着上次的绘制
        ctx.fillStyle = '#000'

        var perWidth = 10 * 2;
        var startX = start - start % perWidth

        //这样绘制当起点不为10的倍数时,长标和文字都不会出现
        // for(let i = start ; i < start+this.width ; i += 10){
        //正确的方法是:偏移到10的倍数,再开始绘制
        for (let i = startX; i < startX + this.width / 2; i += 10) {
            
            ctx.moveTo(i * 2, this.height);
            
            //绘制长刻度
            if (i % 100 === 0) {
                ctx.fillText(i, (i + 2) * 2, this.height / 2);
                ctx.lineTo(i * 2, 0);
            } else { //绘制短刻度
                ctx.lineTo(i * 2, this.height - perWidth);
            }
            ctx.stroke();
        }
        ctx.closePath();

        ctx.translate(start * 2, 0);
        //translate方法是相对移动,而不是绝对,也就是说translate(0,0)没意义,
        //要是太乱弄不清楚 最好还是用save/restore的方法还原
        
    }

    componentWillReceiveProps(nextProps) {
        //下一个props中与绘制函数相关的参数
        var nStart = nextProps.start;
        var nPosX = nextProps.posX;
        var nWidth = nextProps.width;
        var nShadow = nextProps.showShadow;
        
        //如果是窗口大小发生了变化
        if(nextProps.domWidth !== this.props.domWidth
            || nextProps.domHeight !== this.props.domHeight){
            
            this.reSize(nextProps.domWidth, nextProps.domHeight);
            this.drawRuler(nStart, nPosX, nWidth);   
        }

        //只有属性发生变化时才重绘,两点好处
        // 1.提升效率
        // 2.可以避免改变一个方向,另一个方向也会略微位移的bug
        if(nStart !== this.props.start
            || nPosX !== this.props.posX
            || nWidth !== this.props.width
            || nShadow !== this.props.showShadow)
        {
            //找到问题了!!这里绘制的一切都是根据旧props计算的,所以不准!!
            this.drawRuler(nStart, nPosX, nWidth, nShadow);
        }

    }

    handleClick(e) {
        var offsetX = e.clientX - e.target.offsetLeft
        var value = this.props.start + offsetX;
        console.log("点击了水平尺子的 ",value)
        // this.fgCtx.font = '20px Microsoft Yahei'
        // this.fgCtx.fillStyle = '#900';
        // this.fgCtx.clearRect(0, 0, this.width, this.height);
        // this.fgCtx.fillText(value, (offsetX + 2) * 2, this.height / 2);
        //被clearRect坑了,该函数相当于只是用底色画了个矩形,上一次未close的路径并不会清除
        this.props.handleClick(value)
    }

    render() {
        return <canvas ref="ruler" 
                id="horRuler"
                onClick={this.handleClick.bind(this)} />
    }
}

HorRuler.defaultProps = {};

export default HorRuler;
