console.log('content script going')
var onload = function(event) {
    console.log('content loaded')
    var selectors = [
        '#js_pc_qr_code',
        '.metabar',
        '.js-postShareWidget',
        '.js-stickyFooter',
        '.js-postFooterInfo',
        '.js-postFooterPlacements',
        '.js-responsesStreamWrapper',
        '.js-postActionsFooter',
        '.sectionLayout--fullWidth',
        '.supplementalPostContent',
        'dummy'
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

