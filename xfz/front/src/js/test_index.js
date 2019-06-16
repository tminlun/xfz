//练习index.js逻辑

// 创建类
function Banner() {
    this.index = 0;  //从头轮播时，不从第一张开始轮播；这里保存上一次轮播图片顺序值
    this.bannerGroup = $("#banner-group"); // 获取窗口
    this.bannerGroupHover();  // 鼠标移进出事件
}

// 鼠标移进，停止轮播。鼠标移出，继续轮播下一张
Banner.prototype.bannerGroupHover = function(){
    //函数内的函数如使用类对象，必须使用self
    var self = this; //类对象赋值给self
    this.bannerGroup.hover(function () {
        // 函数一：鼠标移进，停止轮播
        clearInterval(self.timer);
    },function () {
        //函数二：鼠标移出，继续轮播下一张
        self.loop();
    });
};

// 封装轮播功能
Banner.prototype.loop = function(){
    // 函数里的函数要使用类的对象，必须使用self
    var self = this;
    // 对全部火车（图片）进行移动
    var bannerUl = $("#banner-ul");
    // 获取ul全部图片的数量
    var len_bannerLi = $("#banner-ul>li").length;
    // 如果轮播到最后一张
    if(self.index >= len_bannerLi - 1){
        self.index = 0;
    }else{
        // 否则轮播下一张
        self.index++;
    }

    //每两秒换一张（调整left）图片
    this.timer = setInterval(function () {
        // 设置css，并且有轮播功能,3000轮播时间
        bannerUl.animate({"left": -798 * self.index}, 3000)
    },2000)
};

// 对步骤的拼接
Banner.prototype.run = function(){
    // 加载完文档进行轮播
    this.loop();
};

// 文档加载完再执行一系列操作
$(function () {
   var banner = new Banner();
   banner.run();
});
