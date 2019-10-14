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
        '.fixed-btn',
        'header.header',
        '#qq-group',
        'footer.footer',
        '#footer-copyright',
        '#btn-reward',
        '#article-correction',
        // '[data-src*="user-gold-cdn"]',
        'dummy',
    ];
    var inject_css = `
.container-page .content{
    width: 80%;
}
.container-page .page-right
{
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
        document.querySelectorAll('a[href^="https://link.juejin.im?target="]').forEach(function(x){
            x.href = decodeURIComponent(x.href.substr("https://link.juejin.im/?target=".length))
        })

        ;[].filter.call(document.querySelectorAll('p'), function(x){return x.innerText.indexOf('公众号')>-1}).forEach(function(x){
            x.remove()
        })
        ;[].filter.call(document.querySelectorAll('h4'), function(x){return x.innerText.indexOf('加QQ群')>-1})
        .forEach(function(x){
            x.parentElement.remove()
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
