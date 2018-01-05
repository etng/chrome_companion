// https://blog.miguelgrinberg.com/
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
        'div.flexMenu',
        'footer.Footer',
        'aside.widgetArea',
        'div.titleImg',
        '#at4-thankyou',
        'div.addthis_bar',
        '.newsletterSubscribe',
        '.joinDiscussion',
        '#comments',
        '.addthis-smartlayers',
        '.hs-cta-wrapper',
        '.tm-click-to-tweet',

    ];
    var xpaths = [

    ]
    var inject_css = `
    main{
        padding-top: 0px;
    }
    .pageContent{
        padding-left: 0px;
    }
    `
    parseCssRules(inject_css).forEach(function(x){
        sheet.insertRule(x, sheet.cssRules.length)
    })
    setInterval(function(){
        [].forEach.call(document.querySelectorAll(selectors.join(', ')), function(x){
            x.remove();
        })

        xpaths.forEach(function(x){
            var dom_obj = document.evaluate(x, document.body).iterateNext()
            if(dom_obj){
                dom_obj.remove()
            }
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
