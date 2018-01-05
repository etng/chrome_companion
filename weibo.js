if(/^https?\:\/\/weibo\.com\/p\/.*\/super_index/g.test(location.href)){
    console.log(location.href, '是微博超级话题，尝试签到，尝试关注')
    var btn_follow = document.querySelector('[action-type="follow"]');
    if(btn_follow){
        console.log('关注')
        btn_follow.click()
    }
    setTimeout(function(){
        var btn_take = document.querySelector('[action-type="widget_take"]');
        if(btn_take && (btn_take.querySelector('span').textContent=='签到')){
            console.log('签到')
            btn_take.click()
        }
    }, 5 * 1000)

    var imgURL = chrome.extension.getURL("icon48.png");
    console.log(imgURL)
    document.querySelector('.pf_head_pic_a img.pic').src = imgURL;
}
