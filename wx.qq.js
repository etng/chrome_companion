// http://xw.qq.com/tech/20170225044047/TEC2017022504404700
console.log('content script going')

var onload = function(event) {
    console.log('content loaded')
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

    function inject_csses(css_text){
        parseCssRules(css_text).forEach(function(x){
            sheet.insertRule(x, sheet.cssRules.length)
        })
    }

    var selectors = [
        '.info-box.game',
        '.today_hot',
        '.related',
        '.comments',
        '.share',
        '.video.split',
        '.meta',
        '.header',
        '#js_pc_qr_code',
        '.footnav',
        '.vote_iframe',
        '.qr_code_pc_outer',
        'qqmusic',
        '.qqmusic_area',
        '.rich_media_tool',
        '.rich_media_thumb_wrp',
        'a[data-miniprogram-nickname]',
        '.footer'
    ];
    setTimeout(function(){
        var a= document.querySelector('.rich_media_title').innerText, b=document.querySelector('.rich_media_meta_nickname>a').innerText;
        document.title = [a, b].join(" - ");
        if(!a){
            console.log('rich_media_title empty')
        }
    }, 1000);
    [].forEach.call(document.querySelectorAll(selectors.join(', ')), function(x){
        x.remove();
    })
    inject_csses(`
        .rich_media_inner{
            padding-bottom: 0 !important;
        }
.rich_media_area_primary_inner, .rich_media_area_extra_inner {
    max-width: 1024px !important;
    margin: 0 auto !important;
}

.not_in_mm .qr_code_pc_inner
{
    width: 1024px !important;
}
    `)

    ;[].forEach.call(document.querySelectorAll('p'), function(x){if(x.textContent=='如果您喜欢这篇课文，您可以点击右上角三个点的按钮分享给您的朋友~'){x.remove()}})
    ;[].forEach.call(document.querySelectorAll('p'), function(x){if(x.textContent=='点击“阅读原文”查看本课视频'){x.remove()}})
    ;[].forEach.call(document.querySelectorAll('p'), function(x){if(/={3,}/g.test(x.textContent)){x.remove()}})
    console.log('it\s clean now!')
};
if(document.readyState == 'complete'){
    onload()
}
else{
    document.addEventListener("DOMContentLoaded", onload);
}
