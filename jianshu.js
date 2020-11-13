// http://www.jianshu.com/p/fa6ead5a58bd


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
        '#menu',
        '#comment-list',
        '.comment-list',
        '.navbar.navbar-fixed-top',
        'nav.navbar',
        '.note-bottom',
        '.post .author',
        '.post .follow-detail',
        '.post .support-author',
        '.post .meta-bottom',
        '.post .show-foot',
        '.side-tool',
        '#web-note-ad-1',
        '#web-note-ad-2',
        '#web-note-ad-fixed',
        '#note-fixed-ad-container',
        'dummy'
    ];
    var inject_css = `
    ._3Pnjry,
    #note-page-comment,
    section.ouvJEz,
    ul._1iTR78,
    footer,
    aside._2OwGUo{
        display: none !important;
    }

    body {
        padding-top: 0;
    }
    .note .post{
        width: 100%;
    }`
    document.querySelectorAll('a[rel="nofollow"]').forEach(function(a){
        a.href = decodeURIComponent(a.href.substring("https://link.jianshu.com/?t=".length))
    })
    setInterval(function(){
        ;[].forEach.call(document.querySelectorAll(selectors.join(', ')), function(x){
            x.remove();
        })
    }, 1000)
    parseCssRules(inject_css).forEach(function(x){
        sheet.insertRule(x, sheet.cssRules.length)
    })

    console.log('it\s clean now!')
};
if(document.readyState == 'complete'){
    onload()
}
else{
    document.addEventListener("DOMContentLoaded", onload);
}

