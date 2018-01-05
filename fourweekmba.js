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
    '.headerblock',
    '.wl-navigator-widget',
    '.addthis_tool',
    '.sharedaddy',
    '#comments',
    '.navigation.post-navigation',
    'footer',
    '.addthis-smartlayers',
    '#onesignal-bell-container',
    '#dummy'
];
css_rules = `
`
document.title=document.title.replace(' - The Four-Week MBA', '');
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

