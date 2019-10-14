// from https://swiftcafe.io/2017/04/25/chrome-ext/
// https://github.com/swiftcafex/chrome-qrcode

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;
    var title = tab.title

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');
    console.log(title)
    callback(url, title);
  });

}

var create_qrcode = function(text, typeNumber, errorCorrectionLevel, mode) {
  // qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8'];
  var qr = qrcode(typeNumber || 4, errorCorrectionLevel || 'M');
  qr.addData(text, mode);
  qr.make();

//  return qr.createTableTag();
//  return qr.createSvgTag();
  return qr.createImgTag();
};
function url2domain(url){
   var a = document.createElement('a')
      a.setAttribute('href', url)
      return a.host;
}
function toggle_for_thisdomain(e){
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    function(tabs) {
      var tab = tabs[0]
      var domain = url2domain(tab.url)
      console.log(e.target.value)
      localStorage['disabled_' + domain] = 1 - parseInt(e.target.value)
      // console.log(tab)
      // debugger;
      // console.log(tab.url, tab.title, 'check e')
    }
  )
  return true;
}
document.addEventListener('DOMContentLoaded', function() {
  getCurrentTabUrl(function(url, title) {
    document.querySelector('#url').textContent = url;
    var container = document.querySelector('#image-result');
    container.innerHTML = create_qrcode(url)
    var md_link_ta = document.querySelector('textarea.md_link')
    md_link_ta.innerHTML = '[' + (title?title:url) + ']('  + url + ')'
    var domain = url2domain(url)
    var k = 'disabled_' + domain
    var v = 1 - parseInt(localStorage[k]);
    console.log('v is', v);
    [].forEach.call(document.querySelectorAll('input[type="radio"][name="enable_this_domain"]'), function(x){
      x.addEventListener('click', toggle_for_thisdomain);
      x.setAttribute('checked', x.value == v)
      console.log(x.value ,'checked status', x.getAttribute('checked'))
    })
  });
});
