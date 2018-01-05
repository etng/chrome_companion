var rule_global = new RegExp('(^|&)(utm_source|utm_medium|utm_term|utm_content|utm_campaign|utm_reader|utm_place|ga_source|ga_medium|ga_term|ga_content|ga_campaign|ga_place|yclid|_openstat|fb_action_ids|fb_action_types|fb_ref|fb_source|action_object_map|action_type_map|action_ref_map|_hsenc|_hsmi|)=[^&]*', 'ig');
var rule_youtube = new RegExp('(^|&)(feature)=[^&]*', 'ig');
var rule_facebook = new RegExp('(^|&)(ref|fref|hc_location)=[^&]*', 'ig');
var rule_imdb = new RegExp('(^|&)(ref_)=[^&]*', 'ig');
var is_sina_video = function(url){
	return /https?\:\/\/us\.sinaimg\.cn\/.*\.mp4/g.test(url)
};
var notify_block_weibo = false;
var fetchFavicon = function(url) {
    return new Promise(function(resolve, reject) {
        var img = new Image();
        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            var dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
        };
        img.src = 'chrome://favicon/' + url;
    });
}
var clean_url = function(url){
	var host = url.match(/https?:\/\/(?:www\.)?([-_.\w\d]+)/i)[1].toLowerCase();
	var qpos = url.indexOf('?');
	// if(is_sina_video(info.url)){
	// 	console.log(info.url, 'is sina video, cancel')
	// 	return {cancel: true}
	// }
	if (rule_global !== null && qpos > -1)
	{
		var args = url.substring(qpos + 1, url.length);
		// console.log('args', args)
		// Hardcode, sorry, I'll fix it later
		if (host === 'link.zhihu.com'){
			return decodeURIComponent(args).split('=')[1];
		}
		var cleared = args.replace(rule_global, '').replace(/^[&]+/i, '');
		// console.log('before', cleared)
		cleared = cleared.replace(/(^|&)hmsr=toutiao\.io(&|$)/i, '');
		cleared = cleared.replace(/(^|&)from=toutiao(&|$)/i, '');
		cleared = cleared.replace(/(^|&)fr=email(&|$)/i, '');
		// console.log('after', cleared)
		if (host === 'youtube.com')  cleared = cleared.replace(rule_youtube, '').replace(/^[&]+/i, '');
		if (host === 'facebook.com') cleared = cleared.replace(rule_facebook, '').replace(/^[&]+/i, '');
		if (host === 'imdb.com')     cleared = cleared.replace(rule_imdb, '').replace(/^[&]+/i, '');

		if (args !== cleared)
		{
			url = url.substring(0, qpos);
			if (cleared) {
				url += '?' + cleared;
			}
		}
	}
	return url
}
chrome.webRequest.onBeforeRequest.addListener(function(info)
{
	var cleared = clean_url(info.url);
	if(cleared !== info.url){
		console.log('redirect to ', cleared)
		return {redirectUrl: cleared};
	}
},
{urls: ['https://*/*?*', 'http://*/*?*'], types: ['main_frame']}, ['blocking']);

chrome.webRequest.onBeforeRequest.addListener(
	function(info) {
		console.log(info.url, 'is sina video, cancel')
		if(notify_block_weibo){
			chrome.notifications.create({
				type: 'basic',
				iconUrl: 'icon48.png',
				title: '阻挡微博请求',
				message: '阻挡微博请求 ' + info.url
	 		});
		}
		return {cancel: true};
	},
	{
		urls: [
			"*://us.sinaimg.cn/*",
			"*://rs.sinajs.cn/ht.gif*",
			"*://wbpctips.mobile.sina.cn/adfront/deliver.php*",
			"*://*.im.weibo.com/im/*",
			"*://api.weibo.com/webim/*",
			"*://s.weibo.com/ajax/jsonp/gettopsug*",
			"*://rm.api.weibo.com/2/remind/push_count.json*",
			"*://weibo.com/p/aj/proxy?api=http://contentrecommend.mobile.sina.cn/dot/dot.lua*",
			"*://static.segmentfault.com/build/3rd/sf_typeHelper/*"
		]
	},
	["blocking"]
);

chrome.webRequest.onBeforeRequest.addListener(
	function(info) {
		console.log(info.url, 'is ads, cancel')
		if(notify_ads){
			chrome.notifications.create({
				type: 'basic',
				iconUrl: 'icon48.png',
				title: '阻挡广告请求',
				message: '阻挡广告请求 ' + info.url
	 		});
		}
		return {cancel: true};
	},
	{
		urls: [
			"*://cdn.carbonads.com/carbon.js*"
		]
	},
	["blocking"]
);

var toggleIcon = function(on){
	var path = "icon48.png"
	if(typeof on == 'undefined'){
		on = !JSON.parse(localStorage.on)
	}
	if(!on){
		path = "icon48-disabled.png"
	}
	localStorage.on = JSON.stringify(on)
    chrome.browserAction.setIcon({path: path});
}
// chrome.browserAction.onClicked.addListener(function(tab) {
// });

// http://www.iimedia.cn/49979.html

// chrome.windows.getCurrent(function (currentWindow) {
// chrome.tabs.query({active: true, windowId: currentWindow.id}, function(activeTabs) {
//   chrome.tabs.executeScript(
//     activeTabs[0].id, {file: 'send_links.js', allFrames: true});
// });
// });
var content_scripts = [
	[
		'wx.qq.js',
		/^https?:\/\/mp\.weixin\.qq\.com\/s\/[^\/]*/g
	],
	// [
	// 	'vlive_tv.js',
	// 	/^https?:\/\/(channels|www)\.vlive\.tv\//g
	// ],
	[
		"segmentfault.js",
		/^https?:\/\/segmentfault\.com\/a\/\d+/g
	],
	[
		"zhihu.js",
		/^https?:\/\/zhuanlan\.zhihu\.com\/p\/\d+(\?|$)/g
	],
	[
		"medium.js",
		[
			// https://medium.com/@hakibenita/how-to-turn-django-admin-into-a-lightweight-dashboard-a0e0bbf609ad
			/^https?:\/\/medium\.com\/@[^\/]+\/(.*)-(.*)$/g,
			// https://tech.instacart.com/deep-learning-with-emojis-not-math-660ba1ad6cdc
			/^https?:\/\/tech\.instacart\.com\/(.*)-(.*)$/g,
			/^https?:\/\/medium\.freecodecamp\.com\/(.*)-(.*)$/g,
			''
		]
	],
	[
		"caktusgroup.js",
		/^https?:\/\/www\.caktusgroup\.com\/blog\/\d+\/\d+\/\d+\/.+\/?$/g
	],
	[
		"toutiao_io.js",
		/^https?:\/\/toutiao\.io\/?$/g
	],
	[
		"twitter.js",
		/^https?:\/\/twitter\.com\/?$/g
	],
	[
		"blog_miguelgrinberg.js",
		/^https?:\/\/blog\.miguelgrinberg\.com\/post\/.*?$/g
	],
	[
		"codeship.js",
		/^https?:\/\/blog\.codeship\.com\/.*?$/g
	],
	[
		"jianshu.js",
		/^https?:\/\/www\.jianshu\.com\/p\/.*$/g
	],

	[
		"baidubaike.js",
		/^https?:\/\/baike\.baidu\.com\/item\/.*$/g
	],

	[
		"fourweekmba.js",
		/^https?:\/\/fourweekmba\.com\/.*$/g
	],
	[
		"cloud_tencent_community.js",
		/^https?:\/\/cloud\.tencent\.com\/community\/article\/\d+/g
	],
	[
		"imhjm_article.js",
		/^http:\/\/imhjm\.com\/article\/.*$/g
	],
	[
		"csdn_blog.js",
		/^http:\/\/blog\.csdn\.net\/[^\/]+\/article\/details\/\d+$/g
	],
	[
		"jiqizhixin.js",
		/^https:\/\/www\.jiqizhixin\.com\/articles\/[\d\-]+$/g
	],
	[
		"juejin.js",
		/^https?:\/\/juejin\.im\/post\/.*$/g
	],
	[
		"gitee_mirror.js",
		// https://gitee.com/mirrors/AT-UI
		/^https?:\/\/gitee\.com\/mirrors\/.*$/g
	],
	[
		"wappalyzer_upgrade.js",
		// https://www.wappalyzer.com/upgraded?v5.4.4
		/^https?:\/\/www\.wappalyzer\.com\/upgraded.*$/g
	],
	[
		'', ''
	]
]


var onTabUpdated = function(tab){
	console.log(tab)
	var current_url = tab.url;
	for (var i = 0; i < content_scripts.length; i++) {
		var tmp = content_scripts[i];
		// console.log(tmp)
		var content_script = tmp[0],
		patterns = tmp[1];
		if(content_script){
			if(typeof(patterns)=='object' && patterns.constructor.name=='RegExp'){
				patterns = [patterns]
			}
			else if(typeof(patterns)=='object' && patterns.constructor.name=='Array'){
				patterns = patterns.filter(function(x){
					return typeof(x)=='object' && x.constructor.name=='RegExp';
				})
			}
			if(patterns.filter(function(x){
				return x.test(current_url)
			}).length){
				console.log('should call ', content_script)
				chrome.tabs.executeScript(null, {file: content_script});
			}
		}
	}
	// // debugger;
	// if(/^https?:\/\/mp\.weixin\.qq\.com\/s\/[^\/]*/g.test(tab.url))
	// {
	// 	console.log('should call wx.qq.js')
	// 	chrome.tabs.executeScript(null, {file: "wx.qq.js"});
	// }
	// else if(/^https?:\/\/(channels|www)\.vlive\.tv\//g.test(tab.url)){
	// 	console.log('should call vlive_tv.js')
	// 	chrome.tabs.executeScript(null, {file: "vlive_tv.js"});
	// }
	// else if(/^https?:\/\/segmentfault\.com\/a\/\d+/g.test(tab.url)){
	// 	console.log('should call segmentfault.js')
	// 	chrome.tabs.executeScript(null, {file: "segmentfault.js"});
	// }
	// else if(/^https?:\/\/zhuanlan\.zhihu\.com\/p\/\d+(\?|$)/g.test(tab.url)){
	// 	console.log('should call zhihu.js')
	// 	chrome.tabs.executeScript(null, {file: "zhihu.js"});
	// }
	// else if(/^https?:\/\/toutiao\.io\/?$/g.test(tab.url)){
	// 	console.log('should call toutiao_io.js')
	// 	chrome.tabs.executeScript(null, {file: "toutiao_io.js"});
	// }
	// else if(/^https?:\/\/medium\.com\/@[^\/]+\/(.*)-(.*)$/g.test(tab.url)){
	// 	// https://tech.instacart.com/deep-learning-with-emojis-not-math-660ba1ad6cdc
	// 	console.log('should call medium.js')
	// 	chrome.tabs.executeScript(null, {file: "medium.js"});
	// }


};
chrome.tabs.onCreated.addListener(function(tab){
	onTabUpdated(tab)
})
chrome.tabs.onUpdated.addListener(function(tabId, changes){
	console.log(tabId, changes)
	chrome.tabs.get(tabId, function(tab){
		onTabUpdated(tab)
	})
})


chrome.browserAction.onClicked.addListener(function(tab) {
	toggleIcon();

	// // console.log('should call weibo.js')
	// // chrome.tabs.executeScript(null, {file: "weibo.js"});
	// chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
	// 	var bg = bookmarkTreeNodes[0].children[0];
	// 	// console.log(new Date(bg.dateAdded))
	// 	// console.log(new Date(bg.dateGroupModified))
	// 	// console.log(bg.title)
	// 	// window.bms = bg;
	// 	var bookmarks = [];
	// 	var update_cnt = 0;
	// 	[].forEach.call(bg.children/*.splice(0, 10)*/, function(bm){
	// 		var nu = clean_url(bm.url)
	// 		// console.log(new Date(bm.dateAdded))
	// 		// console.log(bm.title)
	// 		// console.log(bm.url, nu, bm.url == nu)
	// 		if(bm.url != nu){
	// 			console.log('need update', bm.id, {
	// 				title: bm.title,
	// 				url: nu,
	// 			})
	// 			update_cnt += 1
	// 			chrome.bookmarks.update(bm.id, {
	// 				title: bm.title,
	// 				url: nu,
	// 			}, function(node){
	// 				chrome.notifications.create({
	// 					type: 'basic',
	// 					iconUrl: 'icon48.png',
	// 					title: '书签更新 ' + node.title,
	// 					message: 'URL: ' + node.url
	// 		 		});
	// 				// console.log(node.url, node.title, 'updated')
	// 			})
	// 		}
	// 		bookmarks.push({
	// 			title: bm.title,
	// 			url: nu,
	// 			created: bm.dateAdded,
	// 		})
	// 	})
	// 	if(!update_cnt){
	// 		chrome.notifications.create({
	// 			type: 'basic',
	// 			iconUrl: 'icon48.png',
	// 			title: '没有书签需要更新 ',
	// 			message: '很好:)'
	//  		})
	// 	}
	// 	var xhr = new XMLHttpRequest();
	// 	xhr.open("POST", "http://y10n.cn/clean_url/", true);
	// 	xhr.onreadystatechange = function() {
	// 	  if (xhr.readyState == 4) {
	// 	    console.log(JSON.parse(xhr.responseText));
	// 	  }
	// 	}
	// 	xhr.send(JSON.stringify({
	// 		'action': 'sync',
	// 		'payload': {
	// 			'place': 'browserAction',
	// 			'update_cnt': update_cnt,
	// 			'all': btoa(encodeURIComponent(JSON.stringify(bookmarks)))
	// 		}
	// 	}));
	//     // $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
	// });

  // chrome.tabs.executeScript({

  //   code: 'document.body.style.backgroundColor="red"'
  // });
});


// chrome.runtime.onInstalled.addListener(function(e) {
// 	// console.log(e)
//     "install" == e.reason && chrome.tabs.create({
//         url: "http://dh.y10n.cn#intro",
//         active: !0
//     })
//     "update" == e.reason && chrome.tabs.create({
//         url: "http://dh.y10n.cn/#whatsnew",
//         active: !0
//     })
// });


