## 标尺的jquery插件

###Todo
  * 0.5px那一块还是存在一些问题,在我的屏幕上 2x+0.5 会在一些位置绘制出粗线条,理论上应该是 n*(x+0.5) n为倍数 比较精确,改了下,待考证

###笔记
  * jQuery点击事件的4个位置(以X为例):
    * event.offsetX  距离当前元素左上角的距离
    * event.clientX  距离当前可视区域左上角的距离
    * event.pageX    距离当前页面左上角的距离
    * event.screenX  距离当前电脑屏幕左上角的距离
  * #container如果添加了border等影响盒模型的属性,则可能会影响阴影绘制的准确度,这是由于内部元素的left值与期望值不符造成的,解决办法:
    * #container的left和top减去border的宽度或者干脆别用border
    * 使用其他不影响盒模型的属性如outline/boxshadow(firefox下呈现与chrome不同)处理
    * 手动调用绘制阴影的接口setSelect,根据需求精确传参

###优化
  * 经测试,改变canvas画笔的状态效率极低,于是优化如下:
    * 将一次性配置不再改变的属性在初始化时配置好(如font/fgColor)
    * 将背景的绘制改为dom实现,从而精简了每次绘制的第一步:设置背景色fillStyle并使用fillRect()覆盖背景,改为更符合逻辑的clearRect(),从而使整个canvas的fillStyle由两个改为一个(即阴影颜色),又可以提取到初始化中

###日志
  * date 6.6 21:51
    * 这一版改用scroll实现滚动,另外加上了边界处理以及像素处理边界处理: 比如container宽高为1w 添加原点会设置为(5000,5000),
  * data 6.5 这一版本的实现思路是: 
        1. 初始化标尺时,在container外增加一个包裹层wrap,定位方式完全复制container,保证增加包裹层后container不产生位移
        2. 当container宽高小于屏幕宽高时,wrap宽高与container相同, (16-17行)
           当container宽高大于等于屏幕宽高时,wrap宽高取屏幕大小, (可以取消18-19行的注释试试)
           按照宽高在内部添加标尺,并为wrap添加鼠标滚轮事件,以改变container的定位,同时重绘标尺
        3. 当需要添加组件进去时,只需要设置好组件的位置,即使该组件不在视窗内,也能通过移动视口找到:如test4 (1000,1000);
        4.canvas模糊的问题暂时还没去解决,font-family暂时copy了咱们网站上的..
