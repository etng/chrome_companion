// https://zhuanlan.zhihu.com/p/24567586
function rot13(s) {
  return s.replace(/[A-Za-z]/g, function (c) {
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz=0123456789".charAt(
           "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm,9876543210".indexOf(c)
    );
  } );
}
function encodePass(s){
    return rot13(btoa(encodeURIComponent(s)).split('').reverse().join(''));
}

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


console.log('content script going')
var onload = function(event) {
    console.log('content loaded')

    var selectors = [
        '.main-header-box header',
        '.extension',
        '.activity-recommend',
        '.thumb.article-hero',
        '.related-entry-sidebar-block',
        '.sidebar-bd-entry',
        // '[data-src*="user-gold-cdn"]',
        'dummy',
    ];
    var inject_css = `
.container,
.column-view .columen-view-main,
.column-view .entry-view{
    max-width: none !important;
}
.thumb.post-hero,
.btn.meiqia-btn,
.main-header-box,
.columen-view-aside,
.column-view .post-meta,
.post-like-users,
.container.bottom-container{
    display: none !important;
}

.main-area {
    width: calc(100vw - 40rem) !important;
}

.sidebar {
    width: 40rem !important;
}
.tag-list-title,
.article-banner,
.sidebar .index-book-collect,
.recommended-area,
.request-health-alert,
.comment-list-box,
.author-info-block,
.author-block,
.tag-list-box,
.copy-code-btn,
.sidebar .sticky-block-box .related-entry-sidebar-block{
    display:none !important;
}
    `

    document.title=document.title.replace('  - 掘金', '');


    parseCssRules(inject_css).forEach(function(x){
        sheet.insertRule(x, sheet.cssRules.length)
    })
    setInterval(function(){
        [].forEach.call(document.querySelectorAll(selectors.join(', ')), function(x){
            x.remove();
        })
        document.querySelectorAll('img.lazyload').forEach(function(x){
            if(!x.classList.contains('loaded')){
                x.src = x.dataset['src']
            }
        })
        document.querySelectorAll('a[href^="https://link.juejin.im?target="]').forEach(function(x){
            x.href = decodeURIComponent(x.href.substr("https://link.juejin.im/?target=".length))
        })
    }, 1000)
    console.log('it\s clean now!')
};
if(document.readyState == 'complete'){
    onload()
}
else{
    document.addEventListener("DOMContentLoaded", onload);
}
