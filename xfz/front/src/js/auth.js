function Auth() {
    this.mask_wrapper = $('.mask-wrapper');
    // this.scroll = $('.scroll-wrapper');
    // this.scrollLeft = this.scroll.css("left");
}


Auth.prototype.mask_action = function () {
    var self = this; //方法中的方法使用self
    $('#btn').click(function () {
        self.mask_wrapper.show();
    });
    $('.close-btn').click(function () {
        self.mask_wrapper.hide();
    })
};

Auth.prototype.cutLeft = function() {
    $('.switch').click(function () {
        // 必须在点击按钮，再获取元素
        var scrollWrapper = $('.scroll-wrapper');
        var scrollLeft = scrollWrapper.css("left");
        scrollLeft = parseInt(scrollLeft);
        if (scrollLeft < 0){
            scrollWrapper.animate({"left": "0"});
        }
        else{
            scrollWrapper.animate({"left": "-400px"})
        }

    });
};


Auth.prototype.run = function(){
    this.mask_action();// 显示和隐藏登录（注册）按钮
    this.cutLeft(); //切换
};

// 加载完整个页面，再执行功能
$(function () {
    var auth = new Auth();

    auth.run();
});