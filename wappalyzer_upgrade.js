console.log('content script going')
var onload = function(event) {
    window.close()
};
if(document.readyState == 'complete'){
    onload()
}
else{
    document.addEventListener("DOMContentLoaded", onload);
}
