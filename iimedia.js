// http://www.iimedia.cn/49979.html
var selectors = [
    '.header',
    '.banner',
    '.wrapper .left-side',
    '.wrapper .right-side',
    '.footer',
    '.wrapper .article-page .article-relate',
    'a#scrollTop',
    'p.article-bottom2d',
    '.article-outline',
    '.article-desc',
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

// Usage
sheet.insertRule(`.article-page {
    width: auto;
    float: none;
}`, sheet.cssRules.length);
