// http://www.cnblogs.com/barney/archive/2009/04/17/1438062.html
var selectors = [
    'h1.postTitle',
    '.postDesc',
    '#header',
    '#sideBarMain',
    '#footer',
    '#blog_post_info_block',
    '#comment_form',
];
[].forEach.call(document.querySelectorAll(selectors.join(', ')), function(x){
    x.remove();
})




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
    console.log(rules)
    return rules;
};
parseCssRules(`
#mainContent{
    float: none;
    margin-left: 0;
}
#mainContent .forFlow{
     margin-left: 0;
}
table{
     width: 100%;
}
body{
     background: none;
}
`).forEach(function(x){
    sheet.insertRule(x, sheet.cssRules.length)
})

