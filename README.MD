###Todo
---
 * 解决canvas的半像素问题(尤其是边界的半像素太细)(2倍法)
 * 改用canvas实现后两个刻度尺接缝处没有对齐,要不短边用outline或利用小方块(宽高 29,右下border 1)来做吧!
 * 鼠标拖放手机,改变大小
 * 鼠标拖动手机,改变位置
 * 使用计算的方式得出画布内的元素(局部渲染)
 * 根据设计图完善细节
 * 发现了一个bug,当移动一个方向时,另一个方向会稍微移动一下,应该还是canvas的1px问题
 * 待补充 ...


###Done
---
 * canvas
  * 1.垂直方向的刻度尺上的字体有些小麻烦,斟酌再三(css3旋转与canvas旋转),还是用canvas做了
    第一:css基于dom,效率远不如canvas
	第二:按照设计图中的文字方向,要么把css的旋转点设置在右下角,要么在z轴旋转的同时加上y轴翻转(显示背面)代码丑陋的同时不易扩展
  * 2.因为clearRect并不能清除路径,所以一定要注意beginpath和closepath,否则即使是用clearRect清除了画板,上一次未close的路径也将会被绘制出来
  * 3.网上说的乱七八糟,试验证明translate是相对移动,也就是说translate(0, 0)不是回原点,而是什么变换也不做,两次translate(10,10)相当于translate(20,20)
  * 4.在不用react-canvas的情况下,直接把canvas当做组件的一部分输出好像并没太大用(因为基本上每次交互都会造成canvas的重绘,而且根据props绘制的canvas元素并不能在props发生变化时自动reRender,还是要手动在WillReceiveProps里重绘)



