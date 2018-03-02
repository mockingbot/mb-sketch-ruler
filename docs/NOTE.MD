###Todo
---
  * 将存放对齐线的div设置为 userSelect: none,避免坐标值被选中时呈现蓝色背景,很丑
  * 将对齐线上的坐标值(p)置为 pointEvents:none,防止因坐标值遮挡其他对齐线造成操作不便,同时省去pointer和user-select的设置
  * 添加了removeRuler时解绑每条对齐线的mouse事件，并删除对每个dom的移除，改为移除对齐线容器
  * 鼠标在标尺上移动时,每次都需要计算marginLeft : this.thick / this.ratio太讨厌了, 于是在初始化时将这个值以padding的形式加入
  * 经测试,改变canvas画笔的状态效率极低,于是优化如下:
    * 将一次性配置不再改变的属性在初始化时配置好(如font/fgColor)
    * 将背景的绘制改为dom实现,从而精简了每次绘制的第一步:设置背景色fillStyle并使用fillRect()覆盖背景,改为更符合逻辑的clearRect(),从而使整个canvas的fillStyle由两个改为一个(即阴影颜色),又可以提取到初始化中
  * 没用jquery时,为了销毁对象时解绑事件,绑定事件时需要传递具名函数,各种调用,很麻烦,用了jquery挺方便的,空了可以看一下on/off的实现
  * 当间距为15时,导致scale为小数,而offsetX的最小单位为1px,就导致了鼠标在标尺上移动时,悬浮坐标会不连续
  * 由上面问题导致的15px下绘制的对齐线间距略有不一，暂时没法解决
  * 在配置刻度间距时,目前的逻辑是根据 该间距 / 10 的值将影响的属性统一缩放,这种逻辑下,输入参数startX = -240;perWidth = 20;实际呈现的是-120, 虽然是每隔20px绘制一条刻度,但不是从-240开始,相当于把尺子以原点为起点左右拉长了,实际上处理的不是perWidth,而是scale
  * 测试下1x下 safari的蓝色边框bug是否出现
  * √ 因为最新版本对齐线可能会有很多条,都放在#screens下会很乱
    考虑将水平对齐线 / 水平标尺 / 悬浮刻度 放到一个container里,pointerEvent标尺恒为auto,垂直同样
    这样也避免了添加对齐线时还要去计算corner的宽度,另外,做pointerEvents：none时也不用遍历每条对齐线了,能使dom更清晰,并提高效率
    为了方便对pointerEvent的控制，标尺没必要放到container，container只存放另外两者,其中刻度永远不可选,鼠标进入标尺时，让存放对齐线的container不可选即可。
  * √ 添加标尺时保存下标,删除时按照下标删除,这种方式虽然提高性能,但是存在bug,因为如果删除下标小的元素,后面元素的下标会一次减一,导致后面删错位,应该改成在匿名函数内部计算下标..
  * √ 0.5px那一块还是存在一些问题,在我的屏幕上 2x+0.5 会在一些位置绘制出粗线条,理论上应该是 n*(x+0.5) n为倍数 比较精确,改了下,待考证
  * √ 要不给drawHorLine加个参数绘制时判断?点击绘制时说明鼠标在标尺上,直接不接受鼠标事件,而调用绘制时,接收鼠标事件,这样虽然略有瑕疵,但是效率会好很多
 * ~~为对齐线增加拖动的功能~~
 * ~~鼠标拖放手机边界,改变大小(使用8点法)~~
 * 为原点增加拖动事件(从而使所有已添加的物体一起移动)
 * 鼠标拖动手机时,出现向两个轴延伸的浅蓝色虚线,
 以及每到整10的位置时虚线有明显变化
 * ~~在组件生命周期结束时记得取消监听~~
 * 使用计算的方式得出画布内的元素(局部渲染)
 * 根据设计图完善细节
 * 加上 ±9999px的边界
 	** 在receiveProps处控制 ×
 	** 在事件分发处控制 √ 早处理可以避免不必要的通信代价//
 	** 控制边界条件时,很明显手机的宽度不是所需宽度(应该是窗口宽度,考虑把窗口大小也作为state,传入尺子,用于在外部控制尺子的宽高的同时,也方便在窗口resize时通过改变state的方式自动控制重绘
 * ~~iphone拖拽时用到的参数不应该用state,因为导致了不必要的重绘~~
 * ~~左上角的边界效果用canvas实现~~(dom的小数点有四舍五入,所以只有canvas的中边界的"0.5px"能和两个尺子的底边完美契合)
 * 设计图中的边界都是'2px'的粗边界,要完美匹配,所有的边界刻度都要用dom的定位+border实现
 * 整理几个shouldComponentUpdate的逻辑
 * 根据设计图,需要改为当iphone可编辑的时候,才出现阴影,这时候就就需要考虑多个组件的情况了(与单个组件时不同,需要board根据将当前active的组件告知panel,在没有redux的情况下,数据流向有些复杂了,这里先记录一个版本,以便回退)
 * 点击标尺控制对齐线的显示/隐藏,对齐线可拖动并实时显示当前坐标
 *

###bug (已经解决的划掉)
---
  * 放大窗口时,innerWidth变小,会导致对齐线提前消失
    * 解决方法: 尽量先使用documentElement.clientWidth, 最差选择是outerWidth,而不是innerWidth
  * ~~目前虽然看上去没有滚动条,但其实多余部分是被遮盖住了,在这种情况下,当在Board以外的地方拖动鼠标时,会导致被遮盖的部分进入视口,而标尺离开视口,这不是期望的,有两种思路:
      1. 对容器(container / panel的宽高进行精确计算)
      2. 取消所有可能导致背景移动的元素的onWheel事件
    下个版本将对思路1进行尝试~~
    * 解决方法:仔细查看了一下dom元素,发现定位混乱是因为开发环境下的webpack工具条导致的,其实这个bug不存在...
  * 对齐线在移动时,宽(高)会发生变化,猜想是像素小数导致的
    使用chrome像素监视面板发现像素非5的倍数时,会变成类似于0.990的小数
    解决方法: 将width + bgColor实现的背景色 改为border,还可以虚线,赞
  * ~~当移动一个方向时,另一个方向会稍微移动一下,应该还是canvas的1px问题~~
    * 解决方法:在componentWillReceiveProps中为重绘加判断,只有当有属性改变时才重绘
    <br />
  * ~~解决了canvas的1px问题(尤其是边界的处,半像素严重模糊)~~
    * 解决方法:canvas的款到以及相关绘制的参数都改为原来的2倍
    <br />
  * ~~改用canvas实现刻度尺的边线后两个方向的刻度尺接缝处没有对齐~~
    * 解决方法:两个短border用一个绝对定位在左上角的小方块的右下border实现(outline不行,因为outline是包裹的概念,所以不支持单边绘制)
    <br />
  * ~~移动画布时绘制的阴影有偏差,而拖动手机时绘制的没有~~
    * 解决方法:原来是因为在HorRuler的componentWillReceiveProps里调用了重绘,而重绘方法里使用的参数均为this.props而不是nextProps ,利用上一次的属性来绘制canvas,而dom是根据最新状态来呈现的,当然会出现偏差,只需要将绘制方法中调用的数据以参数形式传入即可
    <br />
  * ~~改变窗口大小时,canvas1.刻度变形 2.阴影与手机不对照~~
    * 解决方法:将根组件监听窗口变化,并将宽高作为参数传给相应的组件,并在这些组件的componentWillReceiveProps处进行处理
    <br />
  * 到达正向边界9999时,若果扩大窗口宽度,则会绘制出超过边界的数字
  * 打包看效果发现React有半秒左右的加载时间,在这之前显示的是dom节点,很丑陋,下个版本处理掉
  * ~~mac上单向箭头光标和windows上不一样,查阅资料后得知其实可选项远超过百度第一个w3school ~~
    * [css光标](http://www.w3chtml.com/css3/properties/user-interface/cursor.html)
  * 拖动边框改变大小的时候出现了预期的问题:因为定位点在左上,所以只有右/下/右下方向可以正常改变大小,修改方法:左上等点需要改宽高的同时也改定位点,这也是符合操作逻辑的
  * ~~加上了拖拽点以后,阴影尺寸又有些对不上了,向右下方偏移了一点~~
    * 解决方法: 原点的锅,给原点加了border以后导致了根据原点定位的元素都发生了偏移,改用其他方法标注原点即可(如outline,bgcolor等)
  * ~~按下鼠标拖动时有时会出现类似拖动文本那个状态,导致不能正常拖动,不知道是什么原因(dragable? user-select?)~~
    * 放大测试了一下,是拖动dom的内容区时触发的复制事件,在事件触发处preventDefault即解决
  * 拖放改变大小时,当缩小至两边重叠时还没有加上边界控制,在本例中应该直接在width或height小于一定值时拒绝处理事件
  * 当手机尺寸过小时,手机的header文字会换行,先简单用white-space:nowrap处理一下
  * 出现了偶然事件:手机持续处于hover状态,点击一次手机render两次,下次遇到时琢磨一下原因
  * 水平方向的红色对齐线现重绘时,用来标示坐标的数字会留下重影的问题,测试发现无论使用bottom还是transition定位,当字距离对齐线过远时就会出现重影,应该是dom效率的问题,可以用canvas/requestAnimation/css3的translate3d 优化,暂时使用第三种

###Note
---
  * 因为perWidth可能为小数(7.5),所以要用parseFloat处理,而不能用parseInt
  * 兼容文字不可选 text.attr('unselectable','on').css({
            '-moz-user-select':'-moz-none',
            '-moz-user-select':'none',
            '-o-user-select':'none',
            '-khtml-user-select':'none', /* you could also put this in a class */
            '-webkit-user-select':'none',/* and add the CSS class here instead */
            '-ms-user-select':'none',
            'user-select':'none'
          }).bind('selectstart', function(){ return false; });
  * jQuery点击事件的4个位置(以X为例):
    * event.offsetX  距离当前元素左上角的距离
    * event.clientX  距离当前可视区域左上角的距离
    * event.pageX    距离当前页面左上角的距离
    * event.screenX  距离当前电脑屏幕左上角的距离
  * container如果添加了border等影响盒模型的属性,则可能会影响阴影绘制的准确度,这是由于内部元素的left值与期望值不符造成的,解决办法:
    * container的left和top减去border的宽度或者干脆别用border
    * 使用其他不影响盒模型的属性如outline/boxshadow(firefox下呈现与chrome不同)处理
    * 手动调用绘制阴影的接口setSelect,根据需求精确传参
  * 因为canvas无法添加子元素,所以鼠标在标尺(horRuler)上移动时显示的刻度(horCur)只能用#screens的子元素来做,这就导致了一个很烦的问题:<br/>
    mouse事件会因为horRuler与horCur没有从属关系而经常触发(over / enter / out / leave等),从而导致horCur不断出现和隐藏,首先想到的是判断鼠标出入的关联元素:

          var intoElement = event.relatedTarget
          if(intoElement == horCur.get(0)
             || intoElement == horSpan.get(0)){
            return;
          }
          if(this.horLine && intoElement == this.horLine.get(0)){
            console.log("msg")
            return;
          }

    但是各种逻辑实在有些复杂,最后只能用css3的pointer-events:none/auto;的切换来强行禁止相关元素的鼠标事件了,现代浏览器兼容性都不错,IE好像不太行
   * canvas
    * 1.垂直方向的刻度尺上的字体有些小麻烦,斟酌再三(css3旋转与canvas旋转),还是用canvas做了
      第一:css基于dom,效率远不如canvas
  	第二:按照设计图中的文字方向,要么把css的旋转点设置在右下角,要么在z轴旋转的同时加上y轴翻转(显示背面)代码丑陋的同时不易扩展
    * 2.因为clearRect并不能清除路径,所以一定要注意beginpath和closepath,否则即使是用clearRect清除了画板,上一次未close的路径也将会被绘制出来
    * 3.网上说的乱七八糟,试验证明translate是相对移动,也就是说translate(0, 0)不是回原点,而是什么变换也不做,两次translate(10,10)相当于translate(20,20)
    * 4.在不用react-canvas的情况下,直接把canvas当做组件的一部分输出好像并没太大用(因为基本上每次交互都会造成canvas的重绘,而且根据props绘制的canvas元素并不能在props发生变化时自动reRender,还是要手动在WillReceiveProps里重绘)
    * 5. resize:both; overflow: auto; 可以使div可拖拽,可惜只能在原始尺寸的基础上放大,而不能缩小,并且只能在右下角操作,尝试着使用绝对定位 / readonly / 旋转的textarea小块做黑科技,但是结果不尽人意,还是老老实实监听鼠标事件吧 - -
   * React
    * 注意:setState并不是立即生效的! 另外 push返回值是长度
      Array.prototype.push()返回数组新的长度（length 属性值）。
      Array.prototype.concat(),组成一个新的数组并返回.
    * onDrag在拖拽dom中的内容时触发(如文字)
    * 完成了鼠标拖动手机,改变位置
     * 监听需要拖拽区域的鼠标按下事件,以及document的鼠标移动和鼠标松开事件,因为如果鼠标移动过快,离开了拖拽区域才释放,就会出现各种奇怪的问题
   * 思路
     * ~~iphone div仅负责宽高,定位由它的父元素完成,这样可以省去不少计算的麻烦~~ (如果多个物体,这样就不行了,所以还得为iphone定位,事实上拖拽时已经改变了iphone的定位,却没有改变父元素,父元素panel实际上是原点)
     * 鼠标按下时需要绑定事件,为了在事件中引用this,需要bind(this),鼠标释放或组件unmount时需要取消监听,所以需要传具名函数,这时发现两次都使用this.moveEvent.bind(this)是无法取消监听的,思索了一下,解决方案简化如下
     <br />
     ``
     	mouseDownEvent() {
     		this.fn = this.moveEvent.bind(this)
     		document.addEventListener('mousemove', this.fn)
     	    document.removeEventListener('mousemove', this.fn)
     	}
     ``
     * 在判断组件当前是否可拖放时,面临着使用自维护的state和props传入的问题,我选择了前者,即使是有redux的介入,此处用自维护的state也未尝不可(iphone是否当前可拖拽的状态无需被其他组件知晓,也无需传输保存到服务器中). 另外,可拖放组件的失焦事件(进入不可resize状态),也在setActive时once一个事件,而不是绑定到全局,思路:
      * 如果这么做,势必需要将组件当前是否可拖放当做属性传入,
		在组件很多的情况下,每次点击都需要重新render所有的组件(至少也需要在每个组件的willReceive处加判断),
		通信代价过高了,并且,当当前没有可编辑的组件时,事件监听就显得多余了,如果再根据组件的情况控制事件监听,实在太过繁琐,反观只有当前激活的组件维护一个事件监听的情况,清晰,明了,效率,高下立判
	   * 判断事件的事件源是否在某个父节点内部
	 	``if(e.path.indexOf(this.refs.iphone) === -1)``
     * 手机内部区域使用dom实现,若外部使用react,考虑用一个component-container包裹每一个手机的dom部分,这样才能在点击时调用作为父组件的react组件的方法进行重绘
   * CSS
     * 当没有双击手机的header部分时,文字应当不可选
     ``-webkit-user-select:none;
       -moz-user-select:none;
       -o-user-select:none;
       user-select:none;
     ``
###日志
  * date 6.28
    1. 暂时去除拖拽,保留按对象查找对齐线的方式
    2. 将scroll时的update作为函数暴露出来由外部统一控制,为此修改了展示页面
  * date 6.27
    1. 鼠标在标尺上移动时,除了在标尺上显示刻度外,增加了一条虚线对齐线
    2. 对齐线支持了拖动改变位置
    3. 原先删除对齐线时是根据对齐线的value来找到该对齐线在数组中的位置,因为需要增加对齐线的拖动,value会改变,所以改为直接在horLine数组中寻找horLine对象
  * date 6.24
    1. 去掉了暂时没用上的moveRuler(deltaX, deltaY)方法(该方法可能会需要支持在键盘，鼠标拖拽等存在deltaXY的事件时用到)
    2. 在scroll时，带shadow的标尺被绘制了两次，重新梳理逻辑，将shadow的判断移动到draw方法中
    3. 在一个方向scroll时，另一个方向的重绘是不必要的,改!
  * date 6.23
    1. 75%下，奇数倍数的刻度坐标为.5 在1x下再+0.5就变成整数，所以会变粗，使用 ((i >> 0) + 0.5) * this.ratio 解决
  * date 6.21
    1. 为防止删除图标x影响内容区的操作，将其固定到标尺旁边，并用mouseover替代mouseenter
    2. 改用滚动条后，setPosition对外部来说没啥用，改为私有
    3. 改动了x以及对齐线数值的位置，增加了对齐线的吸附力
  * date 6.20
    1. 为缩放增加了标尺两个刻度间距的配置,当标尺上两个相邻坐标的间距大于1px时,点击添加对齐线事件会出现小数,于是在悬浮坐标处增设了一个成员变量VerCurrentValue,用以在点击标尺时调用
  * date 6.20
    1. 增加了多条对齐线的销毁,调整了标尺上悬浮坐标的位置,使之与标尺上的坐标对齐
  * date 6.16
    1. 添加多条对齐线,点击时添加对齐线(add)和滚动时重绘对齐线(draw)需要分开了,因为每次点击都是新增,draw里也不需要判断是存在和更改值的逻辑了
  * date 6.15
    1. ~~当鼠标在标尺上时,改用pointerEvents而不是偏移量计算来prevent对齐线的鼠标事件~~
      两者都不能移除,比如鼠标悬浮在标尺上刷新页面,就不会触发enter事件
    2. 初始化时绘制对齐线时只用了if(this.horLineValue), 遗漏了传入值为0的情况, 已修复
  * date 6.6 21:51
    * 这一版改用scroll实现滚动,另外加上了边界处理以及像素处理边界处理: 比如container宽高为1w 添加原点会设置为(5000,5000),
  * data 6.5 这一版本的实现思路是:
    1. 初始化标尺时,在container外增加一个包裹层wrap,定位方式完全复制container,保证增加包裹层后container不产生位移
    2. 当container宽高小于屏幕宽高时,wrap宽高与container相同, (16-17行)
       当container宽高大于等于屏幕宽高时,wrap宽高取屏幕大小, (可以取消18-19行的注释试试)
       按照宽高在内部添加标尺,并为wrap添加鼠标滚轮事件,以改变container的定位,同时重绘标尺
    3. 当需要添加组件进去时,只需要设置好组件的位置,即使该组件不在视窗内,也能通过移动视口找到:如test4 (1000,1000);
    4.canvas模糊的问题暂时还没去解决,font-family暂时copy了咱们网站上的..
