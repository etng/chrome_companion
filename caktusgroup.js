console.log('content script going')
var onload = function(event) {
    console.log('content loaded')


        var selectors = [
            '.dsq-brlink',
            '.spacer',
            '#toggle-disqus-container',
            '#related-posts',
            '#related-resources',
            '#nav.navbar',
            '#footer.footer',
            '.newsletter-popup',
            '.hs-cta-wrapper',
            '.blog-image-wrapper',
            '.blog-detail',
            'a[href^="https://www.caktusgroup.com/blog/search/?q="]',
            'h4 a[href="/blog/"]',

        ];
        [].forEach.call(document.querySelectorAll(selectors.join(', ')), function(x){
            x.remove();
        })

        var like = document.evaluate('//h4[contains(text(), "You might also like:")]/ancestor::node()[contains(@class, "full")][contains(@class, "green-bg")]', document.body).iterateNext()
        if(like){
            like.remove()
        }

 console.log('it\s clean now!')
};
if(document.readyState == 'complete'){
    onload()
}
else{
    document.addEventListener("DOMContentLoaded", onload);
}


