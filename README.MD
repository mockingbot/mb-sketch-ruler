## 点击 [在线演示](http://iny7.com/ruler/) 看效果(仍在开发中, 欢迎提issue)
<br />
##目录简介
 * ruler
   * src 源码
     * components组件
       * Main.js 容器(负责监听resize事件)
       * Panel.js 面板,由横纵方向的尺子和画板组成
       * Board.js 画板,中间区域,盛放手机等组件
       * HorRuler.js 水平标尺
       * VerRuler.js 垂直标尺 
    * styles 
       * App.css 样式文件 随着组件的逐步抽象,作用将淡化
    * index.html
    * index.js
   * dist 打包代码(即gh-pages内容)
   
 ####项目由webpack-react-generator自动生成,所以目录比较完备,不过暂时用到的就这些

###Todo
---
 * 鼠标拖放手机边界,改变大小(使用8点法)
 * 为原点增加拖动事件(从而使所有已添加的物体一起移动)
 * 鼠标拖动手机时,出现向两个轴延伸的浅蓝色虚线,
 以及每到整10的位置时虚线有明显变化
 * 在组件声明周期结束时记得取消监听
 * 使用计算的方式得出画布内的元素(局部渲染)
 * 根据设计图完善细节
 * 加上 ±9999px的边界
 	** 在receiveProps处控制 ×
 	** 在事件分发处控制 √ 早处理可以避免不必要的通信代价//
 	** 控制边界条件时,很明显手机的宽度不是所需宽度(应该是窗口宽度,考虑把窗口大小也作为state,传入尺子,用于在外部控制尺子的宽高的同时,也方便在窗口resize时通过改变state的方式自动控制重绘
 * iphone拖拽时用到的参数不应该用state,因为导致了不必要的重绘

###bug (已经解决的划掉)
---
  * 1. ~~当移动一个方向时,另一个方向会稍微移动一下,应该还是canvas的1px问题~~
    * 解决方法:在componentWillReceiveProps中为重绘加判断,只有当有属性改变时才重绘
    <br />
  * 2. ~~解决了canvas的1px问题(尤其是边界的处,半像素严重模糊)~~
    * 解决方法:canvas的款到以及相关绘制的参数都改为原来的2倍
    <br />
  * 3. ~~改用canvas实现刻度尺的边线后两个方向的刻度尺接缝处没有对齐~~
    * 解决方法:两个短border用一个绝对定位在左上角的小方块的右下border实现(outline不行,因为outline是包裹的概念,所以不支持单边绘制)
    <br />
  * 4. ~~移动画布时绘制的阴影有偏差,而拖动手机时绘制的没有~~
    * 解决方法:原来是因为在HorRuler的componentWillReceiveProps里调用了重绘,而重绘方法里使用的参数均为this.props而不是nextProps ,利用上一次的属性来绘制canvas,而dom是根据最新状态来呈现的,当然会出现偏差,只需要将绘制方法中调用的数据以参数形式传入即可
    <br />
  * 5. ~~改变窗口大小时,canvas1.刻度变形 2.阴影与手机不对照~~
    * 解决方法:将根组件监听窗口变化,并将宽高作为参数传给相应的组件,并在这些组件的componentWillReceiveProps处进行处理
    <br />
  * 6. 到达正向边界9999时,若果扩大窗口宽度,则会绘制出超过边界的数字
  * 7. 打包看效果发现React有半秒左右的加载时间,在这之前显示的是dom节点,很丑陋,下个版本处理掉

###Note
---
   * canvas
    * 1.垂直方向的刻度尺上的字体有些小麻烦,斟酌再三(css3旋转与canvas旋转),还是用canvas做了
      第一:css基于dom,效率远不如canvas
  	第二:按照设计图中的文字方向,要么把css的旋转点设置在右下角,要么在z轴旋转的同时加上y轴翻转(显示背面)代码丑陋的同时不易扩展
    * 2.因为clearRect并不能清除路径,所以一定要注意beginpath和closepath,否则即使是用clearRect清除了画板,上一次未close的路径也将会被绘制出来
    * 3.网上说的乱七八糟,试验证明translate是相对移动,也就是说translate(0, 0)不是回原点,而是什么变换也不做,两次translate(10,10)相当于translate(20,20)
    * 4.在不用react-canvas的情况下,直接把canvas当做组件的一部分输出好像并没太大用(因为基本上每次交互都会造成canvas的重绘,而且根据props绘制的canvas元素并不能在props发生变化时自动reRender,还是要手动在WillReceiveProps里重绘)
    * 5. resize:both; overflow: auto; 可以使div可拖拽,可惜只能在原始尺寸的基础上放大,而不能缩小,并且只能在右下角操作,尝试着使用绝对定位 / readonly / 旋转的textarea小块做黑科技,但是结果不尽人意,还是老老实实监听鼠标事件吧 - -
   * React
    * onDrag在拖拽dom中的内容时触发(如文字)
    * 完成了鼠标拖动手机,改变位置
     * 监听需要拖拽区域的鼠标按下事件,以及document的鼠标移动和鼠标松开事件,因为如果鼠标移动过快,离开了拖拽区域才释放,就会出现各种奇怪的问题
   * 思路
     *  ~~iphone div仅负责宽高,定位由它的父元素完成,这样可以省去不少计算的麻烦~~ (如果多个物体,这样就不行了,所以还得为iphone定位,事实上拖拽时已经改变了iphone的定位,却没有改变父元素,父元素panel实际上是原点)
     * 鼠标按下时需要绑定事件,为了在事件中引用this,需要bind(this),鼠标释放或组件unmount时需要取消监听,所以需要传具名函数,这时发现两次都使用this.moveEvent.bind(this)是无法取消监听的,思索了一下,用闭包解决思路如下
     <br />
     ``
     	mouseDownEvent() {
     		this.fn = this.moveEvent.bind(this)
     		document.addEventListener('mousemove', this.fn)
     	    document.removeEventListener('mousemove', this.fn)
     	}
     ``
