// http://xw.qq.com/tech/20170225044047/TEC2017022504404700
console.log('content script going')
var onload = function(event) {
    console.log('content loaded')

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
        '.footer'
    ];
    [].forEach.call(document.querySelectorAll(selectors.join(', ')), function(x){
        x.remove();
    })
    console.log('it\s clean now!')
};
if(document.readyState == 'complete'){
    onload()
}
else{
    document.addEventListener("DOMContentLoaded", onload);
}
