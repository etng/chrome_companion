// https://realpython.com/blog/python/offline-python-deployments-with-docker/
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
        '.addthis-smartlayers',
        '.drip-tab-container',
        '.main-content>.row>aside',
        '.main-content>.row>.article>.card.mt-4',
        'footer',
        'nav.navbar.sticky-top',
        'dummy'
    ];
    var inject_css = `

    `

    document.title = document.title.replace(/ \– Real Python$/g, '').trim();


    parseCssRules(inject_css).forEach(function(x){
        sheet.insertRule(x, sheet.cssRules.length)
    })
    setInterval(function(){
        [].forEach.call(document.querySelectorAll(selectors.join(', ')), function(x){
            x.remove();
        })
        document.querySelector('.main-content>.row>.article').setAttribute('class', 'article')
        // document.querySelectorAll('.entry-content h1').forEach(function(x){x.setAttribute('data-text', x.innerText.trim())})
        // ;['交流社区', '文章推荐'].forEach(function(x){
        //     var h1=document.querySelector('h1[data-text*="'+x+'"]')
        //     if(h1){
        //         h1.nextElementSibling.remove()
        //         h1.remove()
        //     }
        // })
        // document.querySelectorAll('a[href^="https://link.juejin.im?target="]').forEach(function(x){
        //     x.href = decodeURIComponent(x.href.substr("https://link.juejin.im/?target=".length))
        // })
    }, 1000)
    console.log('it\s clean now!')
};
if(document.readyState == 'complete'){
    onload()
}
else{
    document.addEventListener("DOMContentLoaded", onload);
}
