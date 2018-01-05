// http://colah.github.io/posts/2015-08-Understanding-LSTMs/
var selectors = [
    '.navbar',
    '.main-disqussion-link-wrp',
    '#disqus_thread',
    '#footer',
];
[].forEach.call(document.querySelectorAll(selectors.join(', ')), function(x){
    x.remove();
})


function xpathSelectorAll(path, parent){
    parent = parent || document.body
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate
    var xresults = document.evaluate(path, parent)
    var nodes = []
    var node;
    while(node=xresults.iterateNext()){
        nodes.push(node)
    }
    return nodes;
}
[].forEach.call(xpathSelectorAll('//section/h4[contains(text(), "More Posts")]/parent::node()'), function(x){
    x.remove()
})

document.querySelector('#content>.container>.row>.col-md-8').setAttribute('class', 'col-md-12')
