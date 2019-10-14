// https://segmentfault.com/a/1190000008864708
var parseCssRules= function(s){
    var pt=/\s*([^{]*\{[^}]*\})\s*/gy;
    var rules = [];
    var matches = [];
    var s1 = s.replace(/\s*\/\*\*[\s\S]*\*\/\s*/g, '');
    do{
    var m = pt.exec(s1);
    if(m){
        matches.push(m)
        rules.push(m[1])
    }
    }while(pt.lastIndex);
    return rules;
};
var sheet = (function() {
    // Create the <style> tag
    var style = document.createElement('style');

    // Add a media (and/or media query) here if you'd like!
    // style.setAttribute('media', 'screen')
    // style.setAttribute('media', 'only screen and (max-width : 1024px)')

    // WebKit hack :(
    style.appendChild(document.createTextNode(''));

    // Add the <style> element to the page
    document.head.appendChild(style);

    return style.sheet;
})();

var onload = function(event){
    console.log('onload', event)
    try{
        document.title=document.title.replace(' - SegmentFault 思否', '')
    }catch(e){
        console.log('failed to update title', e)
    }
    if(/^\/p\//g.test(location.pathname)){
        location.href = document.querySelector('.news__item-title a').href
    }
    else
    {
        var selectors = [
            '#loginBanner.loginBanner',
            '.widget-share__full',
            '.global-nav.sf-header',
            '.global-navTags',
            '.post-topheader__side',
            '#footer',
            'div.side',
            'div.recommend-post',
            '#mainLike',
            '#mainBookmark',
            '.post-topheader__title--icon-symbol',
            '.post-topheader__info .taglist--inline',
            '.post-topheader__info .article__author',
            '.comments--news',
            '.comments-container',
            '.article-operation',
            '.widget-register',
            '#fixedTools',
            '.app-promotion-bar',
            '.article__reward-info',
            '.article__reward-btn',
            '.post-comment-title',
        ];
        var inject_css = `.fmt pre {
            max-height: none;
        }`
        parseCssRules(inject_css).forEach(function(x){
            sheet.insertRule(x, sheet.cssRules.length)
        })
        ;[].forEach.call(document.querySelectorAll(selectors.join(', ')), function(x){
            x.remove();
        })
        document.querySelector('.main.col-xs-12').setAttribute('class', 'col-xs-12  main')
        // var help_link = document.evaluate('//button[contains(@class, "yt-google-help-link"', document.body).iterateNext()
    }
}


if(document.readyState == 'complete'){
    console.log('completed, onload trigger now')
    onload()
}else{
    console.log('wait dom done')
    document.addEventListener("DOMContentLoaded", onload);
}
