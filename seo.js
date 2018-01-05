// https://davidwalsh.name/javascript-debounce-function
// https://davidwalsh.name/essential-javascript-functions
// get proptery data
[].forEach.call(document.querySelectorAll('[property]'), function(x){
    console.log(x.getAttribute('property'), x.getAttribute('content'), x.textContent);
})

// https://item.jd.com/3133853.html

var dns_prefetchs = [];
[].forEach.call(document.querySelectorAll('link[rel="dns-prefetch"]'), function(x){
    dns_prefetchs.push(x.href);
})
console.log('dns_prefetchs:', dns_prefetchs.join(' '))
var canonical;
if(canonical = document.querySelector('link[rel="canonical"]')){
    console.log('canonical:', canonical.href, location.href, canonical.href == location.href)
}
var mobile_urls = {};
[].forEach.call(document.querySelectorAll('meta[http-equiv="mobile-agent"]'), function(x){
    var content = x.getAttribute('content')
    var m = /format=([^;]+);\s*url=(.*)/g.exec(content)
    if(m){
        var fmt=m[1], url=m[2];
        if(url.indexOf('//')===0){
            url = location.protocol + url;
        }
        mobile_urls[fmt] = url
    }
    else{
        console.log('can not match mobile_agent ', content)
    }
})
console.log('mobile_urls:', JSON.stringify(mobile_urls))
