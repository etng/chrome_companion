// http://www.cnblogs.com/barney/archive/2009/04/17/1438062.html
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

var selectors = [
    '#BAIDU_DUP_fp_wrapper',
    '.lemmaWgt-secondsKnow',
    '#starFlower',
    '.header-wrapper',
    '.navbar-wrapper',
    '.body-wrapper .before-content',
    '.body-wrapper .main-content .top-tool',
    '.wgt-footer-main',
    '.lemmaWgt-searchHeader',
    '#side-share',
    'a.j-edit-link',
    '#comment_form',
    '.lemma-catalog',
    '.side-content',
    '.side-catalog',
    '.album-list',
    '.lemma-reference',
    '.posterFlag',
    '.lock-lemma',
    '.rs-container-foot',
    '.speak',
    '#open-tag',
    '#tashuo_bottom',
    '.lemma-relation-table',
];
css_rules = `
body.wiki-lemma{
    min-width: auto;
}
.body-wrapper .content-wrapper .content{
    width: auto;
}
.body-wrapper .content-wrapper .content .main-content{
    width: auto;
}
.body-wrapper sup{
    display: none;
}
`
document.title=document.title.replace('_百度百科', '');
if(selectors.length){
    [].forEach.call(document.querySelectorAll(selectors.join(', ')), function(x){
        x.remove();
    })
}
if(css_rules){
    parseCssRules(css_rules).forEach(function(x){
        sheet.insertRule(x, sheet.cssRules.length)
    })
}

