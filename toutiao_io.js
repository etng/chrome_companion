// http://xw.qq.com/tech/20170225044047/TEC2017022504404700
// https://toutiao.io/
console.log('content script going')
var onload = function(event) {
    console.log('content loaded')

    var selectors = [
        '#welcome-app-banner',
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
