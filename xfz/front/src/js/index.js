/**
    //面向对象（Banner相当于类）
    // 1.添加属性
    // this:进行绑定属性，类的对象。
    // 要引入其他函数属性，必须把this（类的对象）赋值给一个变量（self），因为每个函数的this只代表本身，并非类的对象
    //原型链

    function Banner() {
        // 这里写的代码，相当于构造函数（def __init__函数）
        console.log("init");
        this.parent = "小饭桌";
    }
    //为Banner类绑定一个名为“greet”函数
    Banner.prototype.greet = function () {
        console.log("绑定");
    };

    var banner = new Banner(); // 创建对象会自动执行Banner函数
    console.log(banner.parent);

    //通过对象调用方法
    banner.greet();

**/

// 当整个HTML加载完，再获取ul标签进行轮播（如果不加载完，如何获取ul标签呢？）
 function Banner() {
    this.bannerWidth = 798;  //图片宽度
    this.bannerGroup = $("#banner-group"); // 窗口（hover/cli）
    this.index = 1; //控制鼠标移出，不从头轮播。index++的时候已经对其进行赋值
    this.bannerUl = $("#banner-ul");  // 装轮播图的盒子
    this.bannerList = this.bannerUl.children("li");  // 轮播图列表
    this.bannerCount = $("#banner-ul>li").length;// 轮播图数量
    // 箭头：新建对象已从文档得到箭头，无需每次请求函数都要从文档上找
    this.leftArrow = $(".left-arrow");
    this.rightArrow = $(".right-arrow");
    // 圆点ul
    this.pageControl = $(".page-control");

}

// 初始化
 // 初始化轮播图
Banner.prototype.initBanner = function(){
    var self = this;
    // 克隆第一张和最后一张（[3][1][2][3][1]）
    var firstBanner = self.bannerList.eq(0).clone(); // eq：获取第几个
    var lastBanner = self.bannerList.eq(self.bannerCount - 1).clone();
    // 轮播图列表，添加第一张和最后一张
    self.bannerUl.append(firstBanner); //列表最后克隆第一张
    self.bannerUl.prepend(lastBanner); //列表最前面，克隆最后一张

    // 设置轮播ul总宽度，并且增加2个图片的宽度；默认显示第二张图片
    self.bannerUl.css({"width": self.bannerWidth * (self.bannerCount + 2),"left": -self.bannerWidth});

};

// 圆点初始化
Banner.prototype.initPageControl = function(){
    var self = this; //获取类对象

    //根据图片数量，使用循环(在ul)添加相对应的圆点数量
    for(var i=0;i<self.bannerCount;i++){
        var circle = $("<li></li>"); //动态添加li标签
        self.pageControl.append(circle);  // 在ul添加多个圆点(li)
        // 默认第一个圆点选中
        if(i === 0){
            circle.addClass('active');
        }
    }
    // 根据图片数量，设置圆点版型的css宽度
    self.pageControl.css({"width": self.bannerCount*12 +  2*8 + 16*(self.bannerCount - 1)});
};


// 封装
 //封装轮播图过渡效果
Banner.prototype.animate = function(){
    var self = this;

    // 轮播
    self.bannerUl.animate({"left": -798 * self.index}, 500);

    // index：控制圆点下标; 轮播完再控制圆点下标，不影响轮播下标。
    // 图片下标为第一张，圆点下标为 - 1。图片下标最后一张：圆点的下标为 0。其他条件为 圆点下标为index - 1
    var index = self.index;
    if(index === 0){
        index = self.bannerCount - 1;
    }else if(index === self.bannerCount + 1){
        index = 0;
    }else{
        index = self.index - 1;
    }
    // 根据第“index”的li，对其节点添加.active，其的兄弟节点都删除.active
    self.pageControl.children('li').eq(index).addClass('active').siblings().removeClass('active');
};


 // 轮播图转跳状态（在run方法调用）
 Banner.prototype.loop = function(){
     // self.index：控制轮播图片的位置
    var self = this;  // 得到类的对象
    // 使用定时器实现相隔的事件（每2秒轮播一次）
    this.timer = setInterval(function () {

        // 判断： [3][1][2][3][1]
        // 轮播到最后一张（前后添加了一张，所以 + 1）后，无影切换到第二张，才进行轮播第三张
        if(self.index >= self.bannerCount + 1){
            // 跳到第二张[1],css没有过渡效果，所以比较美观
            self.bannerUl.css({"left": -self.bannerWidth});
            // 继续轮播相对于第二张的下一张
            self.index = 2;
        }
        // 否则继续轮播下一张
        else{
            // self.index这里把值保存到self.index，所以鼠标移出的时候再次轮播获取的index已经有值
            self.index++;  // 第一张轮播图left：0（-798 * 0），第二张left才是 -798
        }

        // 轮播一次
        self.animate();

    }, 2000);
 };


// 轮播箭头开关
Banner.prototype.toggleArrow = function(isShow){
     var self = this;
     // 显示箭头
    if(isShow){
        // hover事件每次都要从文档寻找，很费事件
        self.leftArrow.show();
        self.rightArrow.show();
    }
    //隐藏箭头
    else{
        self.leftArrow.hide();
        self.rightArrow.hide();
    }
 };

// 监听
 //轮播图上下切换
Banner.prototype.listenArrowClick = function(){
    var self = this;
    //左箭头点击事件: 切换上一张
    self.leftArrow.click(function () {
        // 点击的是第一张，切换到最后一张（[2][0][1][2][0]）
        if (self.index === 0){
            self.bannerUl.css({"left": self.bannerCount*(-self.bannerWidth)}); //无影到倒数第二张
            self.index = self.bannerCount - 1
        }
        // 切换上一张
        else{
            self.index--;
        }
        // 切换上一张
        self.animate();

    });
    // 右箭头点击事件: 切换下一张
    self.rightArrow.click(function () {
        // 最后一张，无影的切换到第二张， 才轮播第三张（[3][1][2][3][1]）
        if(self.index === self.bannerCount + 1){
            self.bannerUl.css({"left": -self.bannerWidth});
            self.index = 2;
        }
        // 非最后一个，则切换下一张
        else {
            self.index++;
        }
        self.animate();
    });
};

// 鼠标移进，停止轮播。鼠标移出，继续轮播下一张
Banner.prototype.listenBannerHover = function(){
     // 要引入其他函数属性，必须把this（类的对象）赋值给一个变量（self）
    // 因为每个函数的this只代表本身，并非类的对象
    var self = this;
    this.bannerGroup.hover(function () {
        //第一个函数，鼠标移进bannerGroup（窗口）
        clearInterval(self.timer);//停止轮播
        self.toggleArrow(true);// 显示箭头
    },function () {
        // 第二函数，鼠标移出bannerGroup（窗口）
        self.loop();//继续轮播
        self.toggleArrow(false);//隐藏箭头
    });
};

//监听圆点点击
Banner.prototype.listenPageControl = function(){
    var self = this;
    // ul的子元素
    self.pageControl.children("li").each(function (index, obj) {// each：遍历pageControl子节点， index：子节点的下标；obj：子节点标签
        // 把obj（js对象），包装成jQuery对象。再执行点击圆点事件
        $(obj).click(function () {
            self.index = index; //赋值index值
            self.animate(); //点击圆点：轮播相应图片、圆点选中
        });
    });
};


 // 类的主函数，步骤的拼接
Banner.prototype.run = function () {
    this.initBanner(); // 轮播图总宽度
    this.initPageControl(); //根据图片数量,添加圆点数量、和圆点版型（ul）的宽度
    this.loop(); //自动轮播
    this.listenBannerHover(); //监听轮播图hover事件
    this.listenArrowClick(); // 监听箭头上下切换
    this.listenPageControl(); //监听圆点点击事件
 };

 //$(function(){}); 加载完整个HTML,再执行所有功能
$(function () {
    var banner = new Banner();
    banner.run();
});
