## 标尺的jquery插件

###Todo
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

###笔记
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
  * #container如果添加了border等影响盒模型的属性,则可能会影响阴影绘制的准确度,这是由于内部元素的left值与期望值不符造成的,解决办法:
    * #container的left和top减去border的宽度或者干脆别用border
    * 使用其他不影响盒模型的属性如outline/boxshadow(firefox下呈现与chrome不同)处理
    * 手动调用绘制阴影的接口setSelect,根据需求精确传参
  * 因为canvas无法添加子元素,所以鼠标在标尺(horRuler)上移动时显示的刻度(horCur)只能用#screens的子元素来做,这就导致了一个很烦的问题:<br/>
    mouse事件会因为horRuler与horCur没有从属关系而经常触发(over / enter / out / leave等),从而导致horCur不断出现和隐藏,首先想到的是判断鼠标出入的关联元素:
          ````
          var intoElement = event.relatedTarget
          if(intoElement == horCur.get(0)
             || intoElement == horSpan.get(0)){
            return;
          }
          if(this.horLine && intoElement == this.horLine.get(0)){
            console.log("msg")
            return;
          }
          ````
    但是各种逻辑实在有些复杂,最后只能用css3的pointer-events:none/auto;的切换来强行禁止相关元素的鼠标事件了,现代浏览器兼容性都不错,IE好像不太行

###优化
  * 添加了removeRuler时解绑每条对齐线的mouse事件，并删除对每个dom的移除，改为移除对齐线容器
  * 鼠标在标尺上移动时,每次都需要计算marginLeft : this.thick / this.ratio太讨厌了, 于是在初始化时将这个值以padding的形式加入
  * 经测试,改变canvas画笔的状态效率极低,于是优化如下:
    * 将一次性配置不再改变的属性在初始化时配置好(如font/fgColor)
    * 将背景的绘制改为dom实现,从而精简了每次绘制的第一步:设置背景色fillStyle并使用fillRect()覆盖背景,改为更符合逻辑的clearRect(),从而使整个canvas的fillStyle由两个改为一个(即阴影颜色),又可以提取到初始化中


###日志
  * date 6.24
    * 1.去掉了暂时没用上的moveRuler(deltaX, deltaY)方法(该方法可能会需要支持在键盘，鼠标拖拽等存在deltaXY的事件时用到)
    * 2.在scroll时，带shadow的标尺被绘制了两次，重新梳理逻辑，将shadow的判断移动到draw方法中
    * 3.在一个方向scroll时，另一个方向的重绘是不必要的,改!
  * date 6.23
    * 75%下，奇数倍数的刻度坐标为.5 在1x下再+0.5就变成整数，所以会变粗，使用 ((i >> 0) + 0.5) * this.ratio 解决
  * date 6.21
    * 1.为防止删除图标x影响内容区的操作，将其固定到标尺旁边，并用mouseover替代mouseenter
    * 2.改用滚动条后，setPosition对外部来说没啥用，改为私有
    * 3.改动了x以及对齐线数值的位置，增加了对齐线的吸附力
  * date 6.20
    * 为缩放增加了标尺两个刻度间距的配置,当标尺上两个相邻坐标的间距大于1px时,点击添加对齐线事件会出现小数,于是在悬浮坐标处增设了一个成员变量VerCurrentValue,用以在点击标尺时调用
  * date 6.20
    * 增加了多条对齐线的销毁,调整了标尺上悬浮坐标的位置,使之与标尺上的坐标对齐
  * date 6.16
    * 添加多条对齐线,点击时添加对齐线(add)和滚动时重绘对齐线(draw)需要分开了,因为每次点击都是新增,draw里也不需要判断是存在和更改值的逻辑了
  * date 6.15
    * 1.~~当鼠标在标尺上时,改用pointerEvents而不是偏移量计算来prevent对齐线的鼠标事件~~
      两者都不能移除,比如鼠标悬浮在标尺上刷新页面,就不会触发enter事件
    * 2.初始化时绘制对齐线时只用了if(this.horLineValue), 遗漏了传入值为0的情况, 已修复
  * date 6.6 21:51
    * 这一版改用scroll实现滚动,另外加上了边界处理以及像素处理边界处理: 比如container宽高为1w 添加原点会设置为(5000,5000),
  * data 6.5 这一版本的实现思路是: 
        1. 初始化标尺时,在container外增加一个包裹层wrap,定位方式完全复制container,保证增加包裹层后container不产生位移
        2. 当container宽高小于屏幕宽高时,wrap宽高与container相同, (16-17行)
           当container宽高大于等于屏幕宽高时,wrap宽高取屏幕大小, (可以取消18-19行的注释试试)
           按照宽高在内部添加标尺,并为wrap添加鼠标滚轮事件,以改变container的定位,同时重绘标尺
        3. 当需要添加组件进去时,只需要设置好组件的位置,即使该组件不在视窗内,也能通过移动视口找到:如test4 (1000,1000);
        4.canvas模糊的问题暂时还没去解决,font-family暂时copy了咱们网站上的..
