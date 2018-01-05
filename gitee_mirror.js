// https://gitee.com/mirrors/AT-UI
console.log('content script going')
var onload = function(event) {
    console.log('content loaded')
    var link = document.querySelector('.mirrors-notice a')
    if(link){
        window.location = link.href
    }
};
if(document.readyState == 'complete'){
    onload()
}
else{
    document.addEventListener("DOMContentLoaded", onload);
}
