to-do 项目实现问题

三栏式布局(左边、中间固定，右侧自适应变化) ：

1、采用绝对定位的方式:三个div元素脱离文本流，此时将task_classily、task_list固定在相应位置，将task_describe的
left = width(task_classily) + width(task_list),right = 0, width = atuo ;即可满足要求；主要代码如下：
   #task_classily {
       width : 150px;
       position : absolute;
       left : 0px;
   }
   #task_list {
       width : 100px;
       position : absolute;
       left : 150px
   }
   #task_describe {
       position : absolute;
       left : 250px;
       right : 0px;
       width : auto;
   }

2、采用相对定位的方式:在三个div元素外部建立一个div（box），主要代码如下：
   #box { 
       padding : 0 0 250px;
    }
   #task_describe {
       width : auto;
   }
   #task_classily {
       float ：left;
       position : relative;
       margin-left : -100%;
       left : -250px;      
   }
   #task_list {
       float : left;
       position : relative;
       margin-left : -100%;
       left : -100px;
   }

   3、文档元素的width、height属性不能直接用element.width取，因为其两个属性存在style中
   
      可以直接用element.client/offset/scrollWidth属性取值

   4、box.style.width = width  //box.style.width 为null,此时width的值为数字类型

      box.style.width 接收的是一个字体串类型 box.style.width = width + 'px'
   
   5、在窗口达到指定宽度或高度时，box由继承自父元素的高度或宽度改变为指定的宽度或高度值，下次窗口回到

      原状态时，不进行重新赋值的话，会出现空白区域（因为其值不再继承至父元素的宽度或高度，而是定值）
   
